var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    multer = require('multer'),
    path = require('path'),
    util = require('util'),
    fs = require('fs'),
    PDFParser = require("pdf2json");

mongoose.connect('mongodb://alice:archer@ds143245.mlab.com:43245/uxreceiverdev');
//mongoose.connect('mongodb://alice:archer@ds243085.mlab.com:43085/angelina_db');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = {
  app,
  db
};

// Use environment defined port on 8000
var port = process.env.PORT || 8000;
app.set('port', port)

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});

app.use(require('express-session')({
    secret: 'sNGDGX1Kd5j4sQRYWE33',
    resave: false,
    saveUninitialized: false
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
})

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.post('/login', passport.authenticate('local', {
        successRedirect: '/loggedIn',
        failureRedirect: '/failed',
    }), function(req, res) {
});

app.get('/logout', function(req, res) {
    req.logout();
    res.send('logged out');
});

app.post('/register', function(req, res) {
    var u = {};
    u.username = req.body.username;
    var newUser = new User(u);
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
        }
        passport.authenticate('local')(req, res, function() {
            res.send('Log in successful');
        });
   });
});

app.use('/investigation', require('./controllers/investigation'))

app.use('/cloud', require('./controllers/cloud'))

app.get('*', function(req, res) {
    res.send('page not found');
});
