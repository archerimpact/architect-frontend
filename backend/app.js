var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Squirrel = require('./models/squirrel');
    User = require('./models/user');
    
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// mongoose.connect('mongodb://michael:archer3@ds115045.mlab.com:15045/uxreceiver');
mongoose.Promise = Promise;
// mongoose.Promise = require('bluebird');
// mlab acc - user: ofacasaurus; pass: m1chaelsBlueKettle
const db_url = 'mongodb://archer1:fanusie@ds011872.mlab.com:11872/redtwinedb';
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

app.get('/loggedIn', function(req, res) {
    res.send("Logged in successfully!")
})


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
        }
        passport.authenticate('local')(req, res, function() { // should be in an else - otherwise will still log you in even if you register? maybe that's not too bad....
            res.send('Account created; Log in successful');
        });
   });
});



app.post('/squirrels', function(req, res) {
    var req_pretty = JSON.stringify(req.body, null, 2);
    // data = {};
    // data.name = req.body.name;
    // data.favnut = req.body.favnut;
    var newSquirrel = new Squirrel(req.body);

    newSquirrel.save(function (err) {
        if (err) {
            res.send('error: squirrel not saved!');
        } else {
            res.send(`saved ${req_pretty}, great success!`);
            // res.send(res.json(req.body));
        }
    });
});

app.post('/findsquirrel', function (req, res) {
    // var coll = req.body.collection; // hmm not easy to specify a collection dynamically using mongoose, mongodb simpler
    // https://stackoverflow.com/questions/24035872/return-results-mongoose-in-find-query-to-a-variable
    // shows how to do via .exec() or promises.
    query = Squirrel.find().where(req.body.field, req.body.search_term);
    // res.swend(result);
    query.exec(function (err, squirrels) {
        if (err) {
            res.send(`error!: ${err}`);
        } else {
            res.send(squirrels);
        }
    })
});



app.get('*', function(req, res) {
    res.send('page not found');
});

app.listen(port, process.env.IP, function() {
    console.log("Server has started on port: "+ port);
});