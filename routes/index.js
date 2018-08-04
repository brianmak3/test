

//var nodemailer = require('nodemailer');
var http = require('http').Server();
var client = require('socket.io').listen(8081).sockets;
var User = require('./model/users');





module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send('Error 404: Page not found.');
    });

    client.on('connection', function (socket) {
        socket.on('appData',function(data){
            var module = data.action;
            var response;
            var newUser;
            var credentials;
            switch(module) {
              case 'Sign up':
                   credentials = data.data;
                  User.findOne({childPhone: credentials[4].value}, function (err, user) {
                      if(err)
                          throw err;
                      else if(user){
                          response = 'The child phone number is already registered.';
                      }else{
                          newUser = new User();
                          newUser.parentName = credentials[0].value;
                          newUser.parentPhone = credentials[1].value;
                          newUser.email = credentials[2].value;
                          newUser.childName = credentials[3].value;
                          newUser.childPhone = credentials[4].value;
                          newUser.password = newUser.generatHarsh(credentials[5].value);
                          newUser.subscription = subscrition()[0];
                          newUser.dateOfSub = subscrition()[1];
                          newUser.dateEndSub = subscrition()[2];
                          newUser.save(function (err) {
                              if(err)
                                  throw err;
                          });
                          response = 'You have successfully created your account.';
                      }
                      socketResponse(socket, {
                          action: 'Homeresponse',
                          module: module,
                          data: newUser,
                          message: response
                      }, null);
                  });
                  break;
              case 'Sign in':
                  credentials = data.data;
                  User.findOne({childPhone: credentials[0].value},function (err, user) {
                      if(err)
                          throw err;
                      else if(!user){
                          response = 'The phone  number is not registered';
                      }else if(!user.validPassword(credentials[1].value)){
                          response = 'Enter a valid password';
                      }else{
                          newUser = user;
                      }
                      socketResponse(socket, {
                          action: 'Homeresponse',
                          module: module,
                          data: newUser,
                          message: response
                      }, null);
                  });
                  break;
          }
        });
    })
};
function socketResponse(socket, data, third) {
    socket.emit('serverData', data);
    if(third){
        socket.broadcast.emit('serverData', data);

    }
}
function subscrition(){
    var today = new Date(Date.now());
    var endDate = new Date(today + (30*24*3600));
    today = today.getDate()+'/'+parseInt(today.getMonth()+1)+'/'+ today.getFullYear();
    endDate = endDate.getDate()+'/'+parseInt(endDate.getMonth()+1)+'/'+ endDate.getFullYear();
    var paid = 'Paid';
    return[paid, today, endDate];

}

