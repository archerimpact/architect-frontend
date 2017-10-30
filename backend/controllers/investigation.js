var multer = require('multer'),
    path = require('path'),
    util = require('util'),
    fs = require('fs'),
    vertex = require('../models/vertex'),
    Project = require('../models/project'),
    mongoose = require('mongoose'),
    PDFParser = require("pdf2json");

const app = require('../app');

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

function saveDoc(text, name) {  
    var doc = {
        _id: new mongoose.Types.ObjectId,
        content: text
    }
    var newDoc = new vertex.Document(doc);
    newDoc.save()
        .then(item => {
            console.log("Successful save 1/3");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database because: " + err);
        })

    var source = {
        _id: new mongoose.Types.ObjectId, 
        // TODO: cloudReference: String,
        // entities: TODO: Alice fill this in with the extracted entities as a String array
        type: "Document",
        source: doc._id // Must be documentSchema, imageSchema, or VideoSchema
    }

    var newSource = new vertex.Source(source);
    newSource.save()
        .then(item => {
            console.log("Successful save 2/3");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database because: " + err);
        })

    var vert = {
        _id: new mongoose.Types.ObjectId,
        name: name,
        type: "Source", // Must be Source or Entity
        date_added: Date.now(),
        source: source._id
    }

    var newVert = new vertex.Vertex(vert);
    newVert.save()
        .then(item => {
            console.log("Successful save 3/3");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database because: " + err);
        })
}

app.post('/investigation/pdf', upload.single('file'), async (req, res) => {
    try {
        // TODO: save to google cloud here
        var name = req.file.originalname;
        let text_dest = "./files/" + name.substring(0, name.length - 4) + ".txt";
        let pdf_dest = "./files/" + name;
        let pdfParser = new PDFParser(this,1);

        pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
        pdfParser.on("pdfParser_dataReady", pdfData => {
            var text = pdfParser.getRawTextContent();
            fs.writeFile(text_dest, text, (error) => { console.error(error) });
        });
        pdfParser.loadPDF(pdf_dest);

        saveDoc(fs.readFileSync(text_dest, "utf8"), name)
            .then(item => {
                res.send("PDF Converted To Text Success");
            })
            .catch(err => {
                res.sendStatus(400);
            })

        // TODO: delete pdf after done with it
    } catch (err) {
        res.sendStatus(400);
    }
})

app.post('/investigation/project', function(req, res) {
    var project = {
        _id: new mongoose.Types.ObjectId,
        name: req.body.name
        //users: // Put in a fake one
    };
    var newProject = new Project(project);
    newProject.save()
        .then(item => {
            res.send("New project saved");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database because: " + err);
        })
});

app.get('/investigation/projectList', function(req, res) {
    Project.find(function (err, projects) {
        var names = [];
        if (err) return console.error(err);
        for (var i = 0; i < projects.length; i++) {
            names = names.concat(projects[i].name)
        }
        res.send(names);
    })
});

app.post('/investigation/searchSources', function(req, res) {
    var phrase = req.body.phrase
    vertex.Vertex.find()
    .populate({
        path: 'source',
        populate: {
            path: 'source',
            model: 'Document'
        }
    })
    //.populate("source.source")
    .exec(function (err, vertices) {
        var found = [];
        if (err) return console.error(err);
        for (var i = 0; i < vertices.length; i++) {
            if (vertices[i].source.source.content.search(phrase) != -1) {
                found = found.concat(vertices[i].name)
            }
            //console.log(vertices[i])
            //console.log(vertices[i].source)
            //names = names.concat(projects[i].name)
        }
        res.send(found);
    })
});
