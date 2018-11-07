const User = require('../models/user');
const UserLog = require('../models/userLog');
const UserHistory = require('../models/userHistory');
let config = require('../../config');
let validator = require('email-validator');
const ytSearch = require('yt-search');
const Youtube = require('youtube-stream-url');
const YouTube2 = require('simple-youtube-api');
const youtube = new YouTube2('AIzaSyBXPHBDbxvRVBWtc_9AkDHiRtAk0q2ms_o');
let fs = require('fs');
const ytdl = require('ytdl-core');
const vidl = require('vimeo-downloader');
/*Vimeo variables*/
const Vimeo = require('vimeo').Vimeo;
const client = new Vimeo(config.CLIENT_ID, config.CLIENT_SECRET, config.ACCESS_TOKEN);


let secretKey = config.secretKey;


//for creating tokens
let jsonwebtoken = require('jsonwebtoken');


module.exports = function (app, express, io) {
    let api = express.Router();

    api.get('/search/:token/:search', function (req, res) {
        let token = req.params.token;
        let search = req.params.search;
        console.log('the token ---->' + token);
        //check if token exist
        if (token) {
            jsonwebtoken.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    res.status(403).send({success: false, message: "Failed to authenticate user"});
                } else {
                    //all the info of user is down here after authentication
                    req.decoded = decoded;
                    //need instance of history in order to add it while the search has been done
                    let userH = new UserHistory({
                        idUser: req.decoded.id,
                        username: req.decoded.username,
                        request_Video: search,
                        request_date: new Date()
                    });
                    userH.save();
                }
            });
        } else {
            res.status(403).send({success: false, message: "No token provided"});
        }
    })





    /*méthode qui cherche les videos de youtube*/
    api.get('/searchYoutubeVideos/:search', function (req, res) {

        let search = req.params.search;
        console.log(search);
        //res.writeHead(200, {'Content-Type': 'video/mp4'});
        youtube.searchVideos(search, 25)
            .then(function (results) {
                res.json({
                    results
                });
            })
            .catch(console.log);

    })

    /*méthode qui cherche les videos de vimeo*/
    api.get('/searchVimeoVideos/:search', function (req, res) {
        let search = req.params.search;


        search = search.replace(/ /g, "+");
        console.log(search);

        client.request(/*options*/{
            // This is the path for the videos contained within the staff picks
            // channels
            path: '/videos?query=' + search,
            // This adds the parameters to request page two, and 10 items per
            // page

            query: {
                page: 1
            }

        }, /*callback*/function (error, body, status_code, headers) {
            if (error) {
                console.log('error');
                console.log(error);
            } else if (body && body.data[0] && body.data[0].link) {
                res.json({results: body.data});
            }

        })
    })

    /*méthode qui stream la video de youtube*/
    api.get('/watchYoutubeVideo/:url', function (req, res) {
        let url = req.params.url;
        ytdl('https://www.youtube.com/watch?v='+url).pipe(res);
    })

    /*méthode qui stream la video de vimeo*/
    api.get('/watchVimeoVideo/:url', function (req, res) {
        let url = req.params.url;
        if (url) {
            url = 'https://vimeo.com/'+url;
            /*Stream the video to the res*/

            let stream = vidl(url, {quality: '360p'});

            stream.pipe(res);

            stream.on('error', function (err) {
                console.error(err);
                console.info("Steam emit the error")
            });

            stream.on('data', function (chunk) {
            });

            stream.on('end', function () {
                console.log('Finished');
            });
        }
    })

    return api
};