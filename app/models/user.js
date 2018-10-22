let mongoose = require('mongoose');
 db = require('../db/db');

let Schema = mongoose.Schema;
//used for crypting password
let bcrypt = require('bcrypt-nodejs');

//the Schema
let UserSchema = new Schema({
    name : String,
    username: {type : String, required: true, index:{unique : true}},
    password: {type : String, required: true, select: false},
    admin: Boolean
});

//haching password
UserSchema.pre('save',function (next) {
   let user = this;

   if(!user.isModified('password')) return next();

   bcrypt.hash(user.password,null,null, function (err,hash) {
       if(err) return next(err);

       user.password = hash;
       next();
   });
});

//Comparing the password entered with the one in the database (encrypted method)
UserSchema.methods.comparePassword = function(password){
  let user = this;
  return bcrypt.compareSync(password,user.password);
};


//exporting model
module.exports = db.model('User', UserSchema);