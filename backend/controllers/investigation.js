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
    return vert._id
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

        callEntityExtractor(fs.readFileSync(text_dest, "utf8"), function(response) {
          saveDoc(fs.readFileSync(text_dest, "utf8"), name, response.entities)
        })
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

app.get('/investigation/source', function(req,res) {
  var sourceid = req.query.source
  db.collection('vertexes').find({_id: mongoose.Types.ObjectId(sourceid)}).toArray()
    .then((vertexes) => {
      console.log("here's your vertexes: ", vertexes)
      if (vertexes.length === 0) {
        res.send([])
      }
      vertexesToResponse(vertexes, "Source", function(response) {
        console.log("Here's your response in 207: ", response)
        if (response.length === vertexes.length) {
          res.send(response)
        }
      })
    })
    .catch((err)=>{console.log(err)})
})

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

app.get('/investigation/project', function(req, res) {
  var projectid = req.query.project
  db.collection('projects').find({_id: mongoose.Types.ObjectId(projectid)}).toArray(function(err, result) {
    res.send(result)
  })
})

app.post('/investigation/entity', function(req, res){
    var entityid = saveEntity(req.body.name, req.body.type, [])

    /* Updates the project document to include this entity in its list of entities. */
    db.collection('projects').update(
      {_id : mongoose.Types.ObjectId(req.body.project)},
      {$push: {entities: entityid}}
    )
})

function vertexesToResponse(vertexes, type, callback) {
  var response = [];
  if (type === "Source") {
    vertexes = vertexes.map((vertex) => {
      return db.collection('sources').find({_id: vertex.source}).toArray()
        .then((source) => {
          return db.collection('documents').find({_id: source[0].source}).toArray()
          .then((document) => {
            vertex.sourceType = source[0].type;
            vertex.content = document[0].content;
            vertex.entities = document[0].entities;
            response.push(vertex)
            return callback(response)
          })
          .catch((err)=> {console.log(err)})
        })
        .catch((err)=> {console.log(err)})
    })
  }
  if (type === "Entity") {
    vertexes = vertexes.map((vertex) => {
      return db.collection('entities').find({_id: vertex.entity}).toArray()
        .then((entities) => {
          vertex.type = entities[0].type;
          response.push(vertex)
          return callback(response)
        })
        .catch((err)=> {console.log(err)})
    }) 
  }
}

app.post('/investigation/project/entityExtractor', function(req, res) {
  if (req.body.text.length > 20) {
    callEntityExtractor(req.body.text, function(response) {
      var vertid = saveDoc(req.body.text, req.body.title, response.entities)
      db.collection('projects').update(
        {_id : mongoose.Types.ObjectId(req.body.project)},
        {$push: {sources: vertid}}
      )
      .then((data) => {res.send(200)})
    })
  }else{
    res.send("Didn't run entity extractor because the length of the content was too short.")
  };
})

app.get('/investigation/project/entities', function(req, res) {
  var projectid = req.query.project
  db.collection('projects').find({_id: mongoose.Types.ObjectId(projectid)}).toArray(function(err, projects) {
    db.collection('vertexes').find({_id: {$in: projects[0].entities}, type: "Entity"}).toArray()
      .then((vertexes) => {
        if (vertexes.length === 0) {
          res.send([])
        }
        vertexesToResponse(vertexes, "Entity", function(response) {
          if (response.length === vertexes.length) {
            res.send(response)
          }
        })
      })
      .catch((err)=>{console.log(err)})
  });
})

app.get('/investigation/project/sources', function(req, res) {
  var response = [];
  var projectid = req.query.project
  db.collection('projects').find({_id: mongoose.Types.ObjectId(projectid)}).toArray()
  .then((projects) => {
    db.collection('vertexes').find({_id: {$in: projects[0].sources}, type: "Source"}).toArray()
    .then((vertexes) => {

      /* if the project's array of sources doesn't exist, return an empty array */
      if (vertexes.length === 0) {
        res.send([])
      }
      vertexesToResponse(vertexes, "Source", function(response) {
        if (response.length === vertexes.length) {
          res.send(response)
        }
      })
    })
    .catch((err) => {console.log(err)})
  })
})

app.post('/investigation/searchSources', function(req, res) {
    var phrase = req.body.phrase;
    vertex.Vertex.find()
    .populate({
        path: 'source',
        populate: {
            path: 'source',
            model: 'Document'
        }
    })
    .exec(function (err, vertices) {
        var found = [];
        if (err) return console.error(err);
        for (var i = 0; i < vertices.length; i++) {
            if (vertices[i].source.source.content.search(phrase) != -1) {
                found = found.concat(vertices[i].name)
            }
        }
        res.send(found);
    })
});
