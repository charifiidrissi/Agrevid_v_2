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

//user
let userConnected;

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
                    userConnected = user;
                    res.json({
                        success: true,
                        message: "Successfully logged in !" + (new Date()).toLocaleString(),
                        token: token
                    });

                    //save date and time for login
                    dateLogin = (new Date()).toLocaleString();
                    let userLoginDate = new UserLog({
                        username: user.username,
                        log_In: dateLogin,
                        log_Out: "not yet"
                    });

                    userLoginDate.save();

                }
            }
        });
    });

    api.post('/logoutDate', function (req, res) {

        let myquery = {username: userConnected.username, log_In: dateLogin};
        let newvalues = {$set: {log_Out: (new Date().toLocaleString())}};
        UserLog.updateOne(myquery, newvalues, function (err) {
            if (err)
                res.json({message: 'err'});
            else
                res.json({message: 'logout date is saved'});
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

    api.get('/userhistorys', function (req, res) {
        UserHistory.find({username: req.decoded.username}, function (err, userHis) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(userHis);
        });
    });

    api.post('/userhistorysParam', function (req,res) {
        UserHistory.find({username: req.body.username}, function (err, userHis) {
            if (err) {
                res.json(err);
                return;
            }
            if(userHis.length==0) res.json({request_Video:'No Date',request_date:'No Date'});
            else res.json(userHis);
        });
    });

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

    api.post('/user', function (req, res) {
        User.find({username: req.body.username}, function (err, user) {
            if (err) {
                res.send(err);
                return;
            }

            res.json(user);
        });
    });

    api.get('/userLoggs', function (req, res) {
        UserLog.find({username: req.decoded.username}, function (err, userLoggs) {
            if (err) {
                res.send(err);
                return;
            }

            res.json(userLoggs);
        });
    });

    api.post('/searchUserLoggs', function (req, res) {
        UserLog.find({username: req.body.username}, function (err, userLoggs) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(userLoggs);
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

    api.post('/updateUser', function (req, res) {
        //quand l utilisateur change son email il faut affecter le changement dans tout les bases de données ou collections
        let myquery = {_id: req.decoded.id};
        let newvalues = {$set: {name: req.body.name, username: req.body.email}};
        User.updateOne(myquery, newvalues, function (err) {
            if (err)
                console.log(err);
            else
                res.json({message: 'User has been modified'});
        });
        let myquery2 = {username: req.decoded.username};
        let newvalues2 = {$set: {username: req.body.email}};
        UserHistory.updateMany(myquery2, newvalues2);

        let myquery3 = {username: req.decoded.username};
        let newvalues3 = {$set: {username: req.body.email}};
        UserLog.updateMany(myquery3, newvalues3);

    });

    return api
};