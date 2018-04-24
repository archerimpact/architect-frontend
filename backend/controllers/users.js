var passport = require('passport'),
    User = require('../models/user');

exports.isAuthenticated = function(req, res, next) {
    console.log("in users/isAuthenticated: " + req.user);
    console.log(req.isAuthenticated()); // TODO: this is some passport builtin?? vs req.user?
    if (req.user) {
        return next();
    }
    else {
        return res.status(200).json({success: false, error: 'User not authenticated'});
    }
};

exports.checkAuth = function(req, res) {
    if (req.user) {
        return res.status(200).json({success: true, message: 'User is authenticated'});
    }
    else {
        return res.status(200).json({success: false, message: 'User is not authenticated'});
    }
};

exports.login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({ success: false, message: info.message });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.json({ success: false, message: err });
            }
            return res.json({ success: true, message: 'authentication success' });
        });
    })(req, res, next)
};

exports.logout = function(req, res) {
    req.logout();
    return res.json({ success: true });
};

exports.register = function(req, res) {
    var u = {};
    u.username = req.body.username;
    var newUser = new User(u);
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.json({ success: false, name: err.name, message: err.message });
        } else {
            passport.authenticate('local') (req, res, function () {
                res.json({ success: true });
            });
        }
    });
};
