var
    // express = require('express'),
    // session = require('express-session'),
    // app = express(),
    // mongoose = require('mongoose'),
    // bodyParser = require('body-parser'),
    passport = require('passport'),
    // LocalStrategy = require('passport-local'),
    User = require('../models/user');
    // MongoStore = require('connect-mongo')(session),
    // configData = require('./config.js');

exports.isAuthenticated = function(req, res, next) {
    console.log(req.user);
    if (req.user) {
        // return next();
        return res.json({success: true});
    } else {
        return res.status(401).json({success: false, error: 'User not authenticated'});
    }
};

exports.login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
            // return res.send(err);
        }
        if (!user) {
            // console.log("in !user: " + info.message);
            // return res.send(info)
            return res.json({ success: false, message: info.message });
            // return res.redirect(frontend_url + '/loginpage');
            // NOTE: redirects will cause CORS errors.
        }

        req.logIn(user, function(err) {
            if (err) {
                // return res.send(err);
                return res.json({ success: false, message: err });
                // return res.redirect(frontend_url + '/loginpage');
            }
            // return res.redirect(frontend_url + '/');
            // res.send(user);
            return res.json({ success: true, message: 'authentication success' });
        });
    })(req, res, next)
};

exports.logout = function(req, res) {
    req.logout();
    return res.json({ success: true });
    // res.send(res.json({success:true}));
};

exports.register = function(req, res) {
    var u = {};
    u.username = req.body.username;
    var newUser = new User(u);
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            // res.send(err);
            return res.json({ success: false, name: err.name, message: err.message });
        } else {
            passport.authenticate('local'
                // ,{
                // successRedirect: frontend_url + '/lol',
                // failureRedirect: '/failed',
                // }
            ) (req, res, function () {
                console.log("LOGGER: account created");
                console.log(req._passport.session); // eg. { user: 'lol12' }
                console.log(user); // just as user's entry in db appears
                res.json({ success: true });
                // res.send('Account created; Log in successful');
                // res.redirect(frontend_url + '/links');
            });
        }
    });
};
