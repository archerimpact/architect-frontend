var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    request = require('request'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    Document = require('./models/document');
    Note = require('./models/Note')
    
var app = express();

mongoose.connect('mongodb://michael:archer3@ds115045.mlab.com:15045/uxreceiver');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Use environment defined port or 8000
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

var optionsEntityExtractor = {
            url: 'https://api.rosette.com/rest/v1/entities', 
            method: 'POST',
            headers: {
                'X-RosetteAPI-Key': '554b291cfc61e3f3338b9f02065bd1a5'
            },
            'Content-Type': 'application/json',
            }

app.post('/project', function(req, res) {
    console.log("this is the document text you are submitting: " + req.body.text)
    var note = {
        type: "textInput",
        title: req.body.title,
        content: req.body.text
    };
    if (note.content.length > 20) {
        //Runs entity extractor here using Alice's API key defined in optionsEntityExtractor
        optionsEntityExtractor.body = JSON.stringify({'content': note.content})
        request(optionsEntityExtractor, function(error, response, body) {
            if (!error) {
                var bodyJSON = JSON.parse(body)

                //Saves entities to the note object, then store this in the Note schema in MongoDB.
                note.entities = bodyJSON.entities;
                var newNote = new Note(note);
                newNote.save()
                    .then(item => {
                        res.send("item saved to database");
                    })
                    .catch(err => {
                        res.status(400).send("unable to save to database");
                    });
            } else {console.log("there was an error in the Rosette extractor: " + error)}
        })
    }else{
        console.log("Didn't run entity extractor because the length of the content was too short.")
        res.send("Length too short.")
    }
})

app.get('/project', function(req, res) {
    db.collection('notes').find({type: "textInput"}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
    });
})

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

app.get('*', function(req, res) {
    res.send('page not found');
});