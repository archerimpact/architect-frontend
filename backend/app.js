var express = require('express'),
    session = require('express-session'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    MongoStore = require('connect-mongo')(session),
    users_controller = require('./controllers/users'),
    configData = require('./config.js'),
    multer = require('multer'),
    path = require('path'),
    util = require('util'),
    fs = require('fs'),
    PDFParser = require("pdf2json");

mongoose.Promise = Promise;
mongoose.connect(configData.db_url, configData.db_options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = {
    app,
    db
};

// Use environment defined port on 8000
var port = process.env.PORT || 8000;
app.set('port', port);
app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/investigation', require('./controllers/investigation'));

//////////// Setting Headers (CORS) ////////////
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
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
////////////////////////////////////////////////

const sessionOptions = {
    resave: true,
    saveUninitialized: true,
    secret: configData.express_session_secret,
    proxy: false,
    name: "sessionId",
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 10080000, // 1000*60*24*7 // Note persistent vs session cookies
        expires: new Date(new Date().getTime() + (1000*60*60*24*30)) // 30 days
    },
    store: new MongoStore({
        url: configData.db_url,
        autoReconnect: true
    })
};

app.use(session(sessionOptions));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate()); // TODO: use this or self-defined one?


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//////////// USERS_CONTROLLER ROUTES ////////////
app.post('/api/login', users_controller.login);
app.get('/api/logout', users_controller.logout);
app.post('/api/register', users_controller.register);
app.get('/api/checkauth', users_controller.isAuthenticated, users_controller.checkAuth);
// app.get('/api/checkauth', passport.authenticate, users_controller.checkAuth);
/////////////////////////////////////////////////


app.get('*', function(req, res) {
    res.status(404).send('Not found');
});

// app.listen(port, process.env.IP, function() {
//     console.log("Server has started on port: " + port);
// });
