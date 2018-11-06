/*Create connections to mongodb Databases*/
let config = require('../../config');
let mongoose = require('mongoose');

let userHistoryDb = mongoose.createConnection(config.userHistoryDb,{ useNewUrlParser: true });

db.on('error', function(err){
    if(err) throw err;
});

userHistoryDb.once('open', function callback () {
    console.info('Connected to userHistoryDb db successfully');
});



module.exports = userHistoryDb;

//mongoose.set('useCreateIndex', true);