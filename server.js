const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const https = require('https');
/*const http = require('http');*/
const fs = require('fs');
let config = require('./config');
let app = express();
const YouTube2 = require('simple-youtube-api');
const youtube = new YouTube2('AIzaSyBXPHBDbxvRVBWtc_9AkDHiRtAk0q2ms_o');
const ytdl = require('ytdl-core');
/*-----------------------------------------------------------------------*/
/*Create connections to mongodb Databases*/
/*let mongoose = require('mongoose');

let db = mongoose.createConnection(config.database,{ useNewUrlParser: true });
let db2 = mongoose.createConnection(config.database2,{ useNewUrlParser: true });

db.on('error', function(err){
    if(err) throw err;
});

db.once('open', function callback () {
    console.info('Connected to userstory db successfully');
});

db2.on('error', function(err){
    if(err) throw err;
});

db2.once('open', function callback () {
    console.info('Connected to testdb db successfully');
});

module.exports = db2,db;

mongoose.set('useCreateIndex', true);*/
/*-----------------------------------------------------------------------*/


// certificat SSL
let options = {
    key: fs.readFileSync('./SSL/server.key'),
    cert: fs.readFileSync('./SSL/server.crt'),
    requestCert: false,
    rejectUnauthorized: false
};



/*let serverHttp = http.createServer(app);*/
let serverHttps = https.createServer(options, app);

let io = require('socket.io')(serverHttps);





app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

//for rendering static files (css / javascript)
app.use(express.static(__dirname + '/public'));


let api = require('./app/routes/api')(app,express,io);
let apiVideo = require('./app/routes/apiVideo')(app,express,io);

/* /api is the root of our api, means that if we want to access the signup api
* we should type localhost:3000/api/signup */
app.use('/api', api);
app.use('/apiVideo', apiVideo);

//the parent file of the view pages (Angular routing)
app.get('/',function(req,res){
   res.sendFile(__dirname + '/public/app/views/index.html');
});



serverHttps.listen(config.port,function(err){
   if(err){
       console.log(err);
   } else{
       console.log("Listening on port 3000");
   }
});

/*
serverHttp.listen(3000);*/
