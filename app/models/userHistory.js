let mongoose = require('mongoose');
userHistoryDb = require('../db/userHistoryDb');

let Schema = mongoose.Schema;



//the Schema
let UserHistorySchema = new Schema({
    idUser : String,
    request_Video : {type : String, required: true  },
    request_date : {type : Date, defauly :Date.now }
});


//exporting model
module.exports = userHistoryDb.model('UserHistory', UserHistorySchema);