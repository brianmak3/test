var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var userSchema = new mongoose.Schema({
   parentName: String,
   parentPhone: Number,
   email: String,
   childName: String,
   childPhone: Number,
   password: String,
   subscription: String,
   dateOfSub: String,
   dateEndSub: String
});
userSchema.methods.generatHarsh = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};
userSchema.methods.validPassword =function (password) {
    return bcrypt.compareSync(password,this.password);
};
module.exports = mongoose.model('users', userSchema);