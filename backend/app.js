var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    Document = require('./models/source'),
    multer = require('multer'),
    cloudinary = require('cloudinary'),
    path = require('path'),
    util = require('util');
    //fileUploadMiddleware = require('./fileUploadMiddleware');
    //upload = multer({ dest: 'files/'});
    
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect('mongodb://michael:archer3@ds115045.mlab.com:15045/uxreceiver');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Use environment defined port or 8000
var port = process.env.PORT || 8000;

// Connect to cloudinary
cloudinary.config({
    cloud_name: 'dvwqtvo58',
    api_key: '324848967822393',
    api_secret: 'EZMeOg74aBd0Tpa3L9LxA8qfh1I',
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

//const storage = multer.memoryStorage();
//const upload = multer({ storage });
const storage = multer.diskStorage({
    destination: './files/',
    filename: function(req, file, callback) {
        console.log(file);
        var file_name = file.originalname;//Date.now()+path.extname(file.originalname)
        callback(null, file_name);
    },
});

app.use(multer({
     storage:storage
     }).single('file'));

const upload = multer({ storage: storage });

app.post('/pdf-uploader', upload.single('file'), async (req, res) => {
    try {
        //const data = req.filename;
        //res.send(req.file.originalname)
        // TODO: save to google cloud here

        let fs = require('fs'), PDFParser = require("pdf2json");

        var name = req.file.originalname;
        let text_dest = "./files/" + name.substring(0, name.length - 4) + ".txt";

        // PDF part
        let pdfParser = new PDFParser(this,1);

        pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
        pdfParser.on("pdfParser_dataReady", pdfData => {
            //res.write(pdfParser.getRawTextContent());
            text = pdfParser.getRawTextContent();
            //res.end(text);
            fs.writeFile(text_dest, text, (error) => { console.error(error) });
        });
        //res.write('Text is located at: ' + text_dest);
        pdfParser.loadPDF("./files/" + name);
        //callback(null, 'very_specific_file_name');

        res.send("made it")

        //TODO: delete pdf
        //res.send({ name: req.file, hello: "wow" });
    } catch (err) {
        //res.send("ERROR WRONG");
        res.sendStatus(400);
    }
})

/*app.post('/files', function(req, res) {
    //res.send("hello");
    //console.log(req);
    //res.send(req.file);
    upload.single('file');
    //res.send(util.inspect(req.file));
    //upload(req, res, function(err) {
     //   res.end('File is uploaded')
    //})
    res.send("file might be uploaded");
    //fileUploadMiddleware;
});*/
//app.post('/files', upload.single('file'), fileUploadMiddleware);

app.get('*', function(req, res) {
    res.send('page not found');
});

app.listen(port, process.env.IP, function() {
    console.log("Server has started on port: "+ port);
});