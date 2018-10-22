/*Create connections to mongodb Databases*/
let config = require('../../config');
let mongoose = require('mongoose');

let db2 = mongoose.createConnection(config.database2,{ useNewUrlParser: true });



db2.on('error', function(err){
    if(err) throw err;
});

db2.once('open', function callback () {
    console.info('Connected to testdb db successfully');
});

module.exports = db2;

mongoose.set('useCreateIndex', true);