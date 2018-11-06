let mongoose = require('mongoose');
userLogDb = require('../db/userLogDb');

let Schema = mongoose.Schema;



//the Schema
let UserLogSchema = new Schema({
    username : String,
    log_In : {type : String, required: true  },
    log_Out : {type : String, required: true }

});


//exporting model
module.exports = userLogDb.model('UserLogg', UserLogSchema);