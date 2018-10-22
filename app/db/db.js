/*Create connections to mongodb Databases*/
let config = require('../../config');
let mongoose = require('mongoose');

let db = mongoose.createConnection(config.database,{ useNewUrlParser: true });

db.on('error', function(err){
    if(err) throw err;
});

db.once('open', function callback () {
    console.info('Connected to userstory db successfully');
});



module.exports = db;

mongoose.set('useCreateIndex', true);