var multer = require('multer'),
    path = require('path'),
    util = require('util'),
    fs = require('fs'),
    vertex = require('./models/vertex'),
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

app.post('/pdf-uploader', upload.single('file'), async (req, res) => {
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
        var doc = {
        	_id: new mongoose.Types.ObjectId;
        	content: fs.readFileSync(text_dest, "utf8")
        }
        var newDoc = new vertex.Document(doc);
        newDoc.save();

        var source = {
			_id: new mongoose.Types.ObjectId, 
			// TODO: cloudReference: String,
		    // entities: TODO: Alice fill this in with the extracted entities as a String array
		    type: "Document"
		    source: doc._id // Must be documentSchema, imageSchema, or VideoSchema
		}

		var newSource = new vertex.Source(source);
		newSource.save();

		var vert = {
			_id: new mongoose.Types.ObjectId,
			name: name,
			notes: String,
		    type: String, // Must be Source or Entity
		    date_added: Date,
		    source: { type: Schema.Types.ObjectId, ref: 'Source' },
		    entity: { type: Schema.Types.ObjectId, ref: 'Entity' }
		}



        res.send("PDF Converted To Text Success")

        // TODO: delete pdf after done with it
    } catch (err) {
        res.sendStatus(400);
    }
})

