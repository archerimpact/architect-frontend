var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user');
    configData = require('./config.js');
    
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const frontend_url = configData.frontend_url;

const db_url = configData.db_url;
mongoose.Promise = Promise;
const db_options = {
    useMongoClient: true,
    promiseLibrary: global.Promise
};

mongoose.connect(db_url,
    db_options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Use environment defined port or 8000
var port = process.env.PORT || 8000;

app.use(require('express-session')({
    secret: configData.express_session_secret,
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

// app.post('/login', passport.authenticate('local', {
//         successRedirect: frontend_url + '/links',
//         failureRedirect: '/failed',
//     }), function(req, res) {
// });
app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            console.log(info);
            return res.redirect(frontend_url + '/loginpage'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect(frontend_url + '/links');
        });
    })(req, res, next)
});

app.get('/loggedIn', function(req, res) {
    res.send("Logged in successfully!")
});


app.get('/logout', function(req, res) { // no authentication here, just for testing
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
            // return res.send(err); // form post action - cannot receive response!
            // implement custom function for this. error message should also be rendered by front-end.
            res.send(err.name + ": " + err.message + "!");
        }
        // passport.authenticate('local')(req, res, function() {
        //     return res.redirect(frontend_url + '/links')
        // });

        passport.authenticate('local', {
            successRedirect: frontend_url + '/links',
            failureRedirect: '/failed',
        })(req, res, function() {
            res.send('Account created; Log in successful');
            // res.redirect(frontend_url + '/links');
        });
   });
});



app.get('*', function(req, res) {
    res.send('page not found');
});

app.listen(port, process.env.IP, function() {
    console.log("Server has started on port: "+ port);
});