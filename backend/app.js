var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user');
    
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// mongoose.connect('mongodb://michael:archer3@ds115045.mlab.com:15045/uxreceiver');
mongoose.Promise = Promise;
// mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://archer1:fanusie@ds011872.mlab.com:11872/redtwinedb', {useMongoClient: true, promiseLibrary: global.Promise});
// PYTHON REFERENCE client = MongoClient("mongodb://admin:passw0rd@ds163232.mlab.com:63232/sdn")
// PYTHON REFERENCE db = client.sdn
// mlab acc - user: ofacasaurus; pass: m1chaelsBlueKettle

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Use environment defined port or 8000
var port = process.env.PORT || 8000;

app.use(require('express-session')({
    secret: 'sNGDGX1Kd5j4sQRYWE33',
    resave: false,
    saveUninitialized: false
}));

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
        passport.authenticate('local')(req, res, function() { // should be in an else - otherwise will still log you in even if you register? maybe that's not too bad....
            res.send('Log in successful');
        });
   });
});

app.get('*', function(req, res) {
    res.send('page not found');
});

app.listen(port, process.env.IP, function() {
    console.log("Server has started on port: "+ port);
});