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

var url = 'mongodb://alicema:crazy644@ds115045.mlab.com:15045/uxreceiver';
mongoose.connect(url);
var db = mongoose.connection;
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

var options = {
            url: 'https://api.rosette.com/rest/v1/entities', 
            method: 'POST',
            headers: {
                'X-RosetteAPI-Key': '554b291cfc61e3f3338b9f02065bd1a5'
            },
            'Content-Type': 'application/json',
            }

app.post('/project', function(req, res) {
    //console.log("this is the document " + req.body.title)
    var d = {};
    d.type = "textInput"
    d.title = req.body.title;
    d.content = req.body.text;
    if (d.content.length > 20) {
        //console.log("here's your text: " + d.content);
        var post_data = JSON.stringify({'content': d.content})
        options.body = post_data
        //console.log("made it to line 71 in app.js")
        request(options, function(error, response, body) {
            if (!error) {
                var bodyJSON = JSON.parse(body)
                d.entities = bodyJSON.entities;
                var newNote = new Note(d);
                newNote.save()
                    .then(item => {
                        res.send("item saved to database");
                    })
                    .catch(err => {
                        //console.log("this is the error: " + err);
                        res.status(400).send("unable to save to database");
                    });
            } else {console.log("there was an error: " + error)}
        })
    }else{
        res.send("Item already in database")
    }
})

app.get('/project', function(req, res) {
    //var collection;
    db.collection('notes').find({type: "textInput"}).toArray(function(err, result) {
        if (err) throw err;
        //console.log("here is the result of all of the documents: " + result);
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

/*app.listen(port, process.env.IP, function() {
    console.log("Server has started on port: "+ port);
});*/