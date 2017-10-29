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

////////////////////////////////////////////////////////////////////////////////
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
////////////////////////////////////////////////////////////////////////////////

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
app.post('/api/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            // return next(err);
            return res.send(err);
        }
        if (!user) {
            console.log("whut");
            console.log("in !user: " + info.message);
            return res.send(info);
            // return res.redirect(frontend_url + '/loginpage');
            // NOTE: redirects will cause CORS errors.
        }

        req.logIn(user, function(err) {
            if (err) {
                return res.send(err);
                // return res.redirect(frontend_url + '/loginpage');
            }
            // return res.redirect(frontend_url + '/');
            res.send(user);
            // user assigned to req.user
        });
    })(req, res, next)
});


app.get('/api/logout', function(req, res) {
    req.logout();
    return res.json({ success: true });
    // res.send(res.json({success:true}));
});


app.post('/api/register', function(req, res) {
    var u = {};
    u.username = req.body.username;
    var newUser = new User(u);
    console.log("LOGGER: received, attempting to register");
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log("LOGGER: first if: " + err);
            res.send(err);
        } else {
            console.log("LOGGER: past first error if, proceeding to authenticate");
            passport.authenticate('local'
                // ,{
                // successRedirect: frontend_url + '/lol',
                // failureRedirect: '/failed',
                // }
            ) (req, res, function () {
                console.log("LOGGER: account created");
                console.log(req._passport.session);
                console.log(user);
                res.send('Account created; Log in successful');
                // res.redirect(frontend_url + '/links');
            });
        }
   });
});



app.get('*', function(req, res) {
    res.send('page not found');
});

app.listen(port, process.env.IP, function() {
    console.log("Server has started on port: "+ port);
});