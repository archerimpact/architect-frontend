var passport = require('passport'),
    User = require('../models/user');

exports.isAuthenticated = function(req, res, next) {
    console.log("in users/isAuthenticated: " + req.user);
    console.log(req.isAuthenticated()); // TODO: this is some passport builtin?? vs req.user?
    if (req.user) {
        return next();
    } else {
        return res.redirect('http://localhost:3000/login');
        // return res.status(200).json({success: false, error: 'User not authenticated'});
    }
};

exports.checkAuth = function(req, res) {
    return res.status(200).json({success: true, message: 'User authenticated'});
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
    // return res.json({ success: true });
    return res.redirect('http://localhost:3000/login');

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
                console.log("LOGGER: account created");
                console.log(req._passport.session); // eg. { user: 'lol12' }
                console.log(user); // just as user's entry in db appears
                res.json({ success: true });
            });
        }
    });
};
