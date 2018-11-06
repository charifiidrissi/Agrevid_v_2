/*Create connections to mongodb Databases*/
let config = require('../../config');
let mongoose = require('mongoose');

let userLogDb = mongoose.createConnection(config.userLogDb,{ useNewUrlParser: true });

db.on('error', function(err){
    if(err) throw err;
});

userLogDb.once('open', function callback () {
    console.info('Connected to userLogDb db successfully');
});



module.exports = userLogDb;

//mongoose.set('useCreateIndex', true);