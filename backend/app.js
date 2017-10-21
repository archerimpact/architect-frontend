var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    request = require('request'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    Note = require('./models/Note'),
    multer = require('multer'),
    path = require('path'),
    util = require('util'),
    fs = require('fs'),
    PDFParser = require("pdf2json");
    
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

function callEntityExtractor(string, callback){
   var optionsEntityExtractor = {
            url: 'https://api.rosette.com/rest/v1/entities', 
            method: 'POST',
            headers: {
                'X-RosetteAPI-Key': '554b291cfc61e3f3338b9f02065bd1a5'
            },
            'Content-Type': 'application/json',
            body: JSON.stringify({'content': string})
        }
    request(optionsEntityExtractor, function(error, response, body) {
        if (!error) {
            return callback(JSON.parse(body));
        } else {
            console.log("there was an error in the Rosette extractor: ")
            return {entities: []}
        }
    })     
}

function submitNote(title, content, entities) {
    var note = new Note({
            type: "textInput",
            title: title,
            content: content,
            entities: entities
        })
    return note.save()
    };


app.get('/notes', function(req,res) {

})

app.post('/entities', function(req, res) {
    console.log("this is the document text you are submitting: " + req.body.text)
    if (req.body.text.length > 20) {
        callEntityExtractor(req.body.text, function(response) {
            submitNote(req.body.title, req.body.text, response.entities)
                .then(item => {
                    res.send("item saved to database");
                })
                .catch(err => {
                    res.status(400).send("unable to save to database");
                })
        })
    }else{
        res.send("Didn't run entity extractor because the length of the content was too short.")
    }
})

app.get('/entities', function(req, res) {
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

const storage = multer.diskStorage({
    destination: './files/',
    filename: function(req, file, callback) {
        // TODO: Change this filename to something more unique in case of repeats
        var file_name = file.originalname;
        callback(null, file_name);
    },
});

app.use(multer({
     storage:storage
     }).single('file'));

const upload = multer({ storage: storage });

app.post('/pdf-uploader', upload.single('file'), async (req, res) => {
    try {
        // TODO: save to google cloud here

        var name = req.file.originalname;
        let text_dest = "./files/" + name.substring(0, name.length - 4) + ".txt";
        let pdfParser = new PDFParser(this,1);

        pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
        pdfParser.on("pdfParser_dataReady", pdfData => {
            var text = pdfParser.getRawTextContent();
            fs.writeFile(text_dest, text, (error) => { console.error(error) });
        });
        pdfParser.loadPDF("./files/" + name);
        res.send("PDF Converted To Text Success")

        // TODO: delete pdf after done with it
    } catch (err) {
        res.sendStatus(400);
    }
})

app.get('*', function(req, res) {
    res.send('page not found');
});