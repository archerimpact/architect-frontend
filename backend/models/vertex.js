var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vertexSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	connections: [{ type: Schema.Types.ObjectId, ref: 'Connection' }],
	notes: String,
    type: String, // Must be Source or Entity
    date_added: Date,
    source: { type: Schema.Types.ObjectId, ref: 'Source' },
    entity: { type: Schema.Types.ObjectId, ref: 'Entity' }
});

var sourceSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
	cloudReference: String,
	url: String,
	metaData: {
		// TODO: what kind of metadata?
	},
	// TODO: possibly change this to be entitySchema rather than String later on
    entities: [String],
    type: String, // Must be "Document", "Image", or "Video"
    source: { type: Schema.Types.ObjectId } // Must be documentSchema, imageSchema, or VideoSchema
})

var entitySchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
	type: String, // i.e. person, location, etc.
	sources: [{ type: Schema.Types.ObjectId, ref: 'Source' }]
});

var documentSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
	content: String,
});

var imageSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
});

var videoSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
});

module.exports = {
	Vertex: mongoose.model('Vertex', vertexSchema),
	Source: mongoose.model('Source', sourceSchema),
	Entity: mongoose.model('Entity', entitySchema),
	Document: mongoose.model('Document', documentSchema),
	Image: mongoose.model('Image', imageSchema),
	Video: mongoose.model('Video', videoSchema)
}