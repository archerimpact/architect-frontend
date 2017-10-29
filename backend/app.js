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

// app.use(require('express-session')({
//     secret: configData.express_session_secret,
//     resave: false,
//     saveUninitialized: false
// }));

const sessionOptions = {
    resave: true,
    saveUninitialized: true,
    secret: configData.express_session_secret,
    proxy: false,
    name: "sessionId",
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60000
    },
    store: new MongoStore({
        url: configData.db_url,
        autoReconnect: true
    })
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.post('/api/login', users_controller.login);
app.get('/api/logout', users_controller.logout);
app.post('/api/register', users_controller.register);

app.get('*', function(req, res) {
    res.status(404).send('Not found');
});

app.listen(port, process.env.IP, function() {
    console.log("Server has started on port: "+ port);
});
