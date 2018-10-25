const User = require('../models/user');
let config = require('../../config');
let validator = require('email-validator');
const ytSearch = require('yt-search');
const Youtube = require('youtube-stream-url');
const YouTube2 = require('simple-youtube-api');
const youtube = new YouTube2('your api key');
let fs = require('fs');
const ytdl = require('ytdl-core');

let secretKey = config.secretKey;




//for creating tokens
let jsonwebtoken = require('jsonwebtoken');

function createToken(user) {
    let token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        username: user.username,
        admin: user.admin
    }, secretKey, {
        //Le temps où l'utilisateur peut rester connecté avant de devoir se reconnecter
        expiresIn: 3600
    });

    return token;
}

module.exports = function (app, express, io) {
    let api = express.Router();

    api.get('/streamVideo/:search',function(req,res){
        let search = req.params.search;
        console.log(search);
        res.writeHead(200,{'Content-Type':'video/mp4'});
        youtube.searchVideos(search, 1)
            .then(function(results) {
                console.log(`The video's title is ${results[0].title}`);

                ytdl(results[0].url)
                    .pipe(res);

            })
            .catch(console.log);

    })


    api.post('/checkEmail', function (req, res) {
        if (validator.validate(req.body.username)) {
            res.json({
                checked: true
            });
        }
        else {
            res.json({
                checked: false
            });
        }
    });

    api.post('/signup', function (req, res) {
        let user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            admin: false
        });

        let token = createToken(user);

        user.save(function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: 'User has been created !',
                token: token
            });
        });
    });


    api.post('/login', function (req, res) {
        User.findOne({
            username: req.body.username
        }).select('name username password admin').exec(function (err, user) {
            if (err) throw err;
            if (!user) {
                res.send({message: "L'utilisateur n'existe pas !"});
            } else if (user) {
                let validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.send({message: "Mot de passe incorrecte !"});
                } else {
                    //Create a token for the login
                    let token = createToken(user);

                    res.json({
                        success: true,
                        message: "Successfully logged in !",
                        token: token
                    });
                }
            }
        });
    });


    /*UP : destination A*/
    /*DOWN : destination B*/
    //position of this middlware in the code is important !
    //this middleware checks if the authenticity of the token
    api.use(function (req, res, next) {
        console.log("Somebody just came to our app !");
        let token = req.body.token || req.param('token') || req.headers['x-access-token'];
        //check if token exist
        if (token) {
            jsonwebtoken.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    res.status(403).send({success: false, message: "Failed to authenticate user"});
                } else {
                    //all the info of user is down here after authentication
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({success: false, message: "No token provided"});
        }
    });

    //Destination B here !


    api.get('/me', function (req, res) {
        res.json(req.decoded);
    });

    api.get('/users', function (req, res) {
        User.find({}, function (err, users) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(users);
        });
    });

    //ATTENTION : FAILLE => il faut privilégier cette méthode à l'administrateur seul
    api.post('/deleteUser', function (req, res) {
        User.deleteOne({username: req.body.username}, function (err) {
            if (err)
                console.log(err);
            else
                res.json({message: 'User deleted'});
        });
    });

/*------------------------------------------------------------------------------------*/
   /* /!*Méthodes pour video*!/
    api.post('/videoSearch', function (req, res) {
        let search = req.body.title;
        ytSearch(search, function (err, r) {
            if (err) throw err;

            const videos = r.videos;
            // const playlists = r.playlists;
            // const accounts = r.accounts;

            const firstResult = videos[0];
            const resultId = firstResult.videoId;

            console.log(resultId);

            Youtube.getInfo({url: "https://www.youtube.com/watch?v=" + resultId})
                .then(function (video) {
                    if(video){
                        res.json({
                            url: video.formats[0].url
                        })
                    }
                });
        })
    })

    api.post('/youtubeSearch',function (req,res) {
        youtube.searchVideos(req.body.search, 1)
            .then(function(results) {
                console.log(`The video's title is ${results[0].title}`);


                ytdl(results[0].url)
                    .pipe(res);

            })
            .catch(console.log);
    })
*/



    return api
};