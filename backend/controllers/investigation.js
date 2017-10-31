var multer = require('multer'),
    path = require('path'),
    util = require('util'),
    fs = require('fs'),
    vertex = require('../models/vertex'),
    Project = require('../models/project'),
    mongoose = require('mongoose'),
    request = require('request'),
    PDFParser = require("pdf2json");

const app = require('../app').app;
const db = require('../app').db;

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

function saveDoc(text, name, entities) {  
    var doc = {
        _id: new mongoose.Types.ObjectId,
        content: text,
        entities: entities
    }
    var newDoc = new vertex.Document(doc);
    newDoc.save()
        .then(item => {
            console.log("Successful save 1/3");
        })
        .catch(err => {
            console.log("Unable to save to database because: " + err);
        })
        
    var source = {
        _id: new mongoose.Types.ObjectId, 
        // TODO: cloudReference: String,
        // entities: TODO: Alice fill this in with the extracted entities as a String array
        type: "Document",
        source: doc._id, // Must be documentSchema, imageSchema, or VideoSchema
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

function saveEntity(name, type, sources) {  
    console.log("type of sources: " + typeof(sources))
    var entity = {
        _id: new mongoose.Types.ObjectId,
        name: name,
        type: type,
        sources: sources
    }
    var newEntity = new vertex.Entity(entity);
    newEntity.save()
        .then(item => {
            console.log("Successful save 1/2");
        })
        .catch(err => {
            console.log("Unable to save to database because: " + err);
        })
        
    var vert = {
        _id: new mongoose.Types.ObjectId,
        name: name,
        type: "Entity", // Must be Source or Entity
        date_added: Date.now(),
        entity: entity._id
    }

    var newVert = new vertex.Vertex(vert);
    newVert.save()
        .then(item => {
            console.log("Successful save 2/2");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database because: " + err);
        })
    return vert._id
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

        saveDoc(fs.readFileSync(text_dest, "utf8"), name, [])
            .then(item => {
                res.send("PDF Converted To Text Success");
            })
            .catch(err => {
                res.sendStatus(400);
            })

        // TODO: delete pdf after done with it
    } catch (err) {
        res.sendStatus(400);
    };
})

function callEntityExtractor(string, callback) {
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
      console.log("there was an error in the Rosette extractor: ");
      return {entities: []};
    };
  });     
}

app.post('/investigation/entities', function(req, res) {
  if (req.body.text.length > 20) {
    callEntityExtractor(req.body.text, function(response) {
      saveDoc(req.body.text, req.body.title, response.entities)
    })
  }else{
    res.send("Didn't run entity extractor because the length of the content was too short.")
  };
})

app.get('/investigation/entities', function(req, res) {
    db.collection('documents').find({}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
    });
})

app.post('/investigation/project', function(req, res) {
    var project = {
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        entities: []
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
    db.collection('projects').find({}).toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
    });
    /*Project.find(function (err, projects) {
        var names = [];
        if (err) return console.error(err);
        for (var i = 0; i < projects.length; i++) {
            names = names.concat(projects[i].name)
        }
        projects.toArray(function(err, result) {
          if (err) throw err;
          res.send(result)
        })
    }) */
});

app.get('/investigation/project', function(req, res) {
  console.log("getting a project, here's req params: ", req.query)
  var projectid = req.query.project
  console.log("here's your projectid: " + projectid + " and its type: " + typeof(mongoose.Types.ObjectId(projectid)))
  db.collection('projects').find({_id: mongoose.Types.ObjectId(projectid)}).toArray(function(err, result) {
    res.send(result)
  })
})

app.get('/investigation/project/entities', function(req, res) {
  console.log("getting project entities, here's req params: ", req.query)
  var projectid = req.query.project
  console.log("here's your projectid: " + projectid + " and its type: " + typeof(mongoose.Types.ObjectId(projectid)))
  db.collection('projects').find({_id: mongoose.Types.ObjectId(projectid)}).toArray(function(err, results) {
    console.log("here are the results: ", results)
    db.collection('vertexes').find({_id: {$in: results[0].entities}}).toArray(function(err, result) {
      console.log("here's your entity: ", result)
      res.send(result)
    });
  })
})

app.post('/investigation/entity', function(req, res){
    var sources = []
    var entityid = saveEntity(req.body.name, req.body.type, sources)
    console.log("this is the entity id: " + entityid + "and its type is: " + typeof(entityid))
    console.log('this is the project id: ' + req.body.project + "and its type is: " + typeof(projectid))
    db.collection('projects').update(
      {_id : mongoose.Types.ObjectId(req.body.project)},
      {$push: {entities: entityid}}
    )
})