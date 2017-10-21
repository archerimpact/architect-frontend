var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nodeSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
	links: [{ type: Schema.Types.ObjectId, ref: 'Link' }],
	notes: String,
    type: String, // Must be Source or Entity
    source: { type: Schema.Types.ObjectId, ref: 'Source' },
    entity: { type: Schema.Types.ObjectId, ref: 'Entity' }
});

var sourceSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
	cloudReference: String,
	metaData: {
		date: Date
	},
	// TODO: possibly change this to be entitySchema rather than String later on
    entities: [String],
    type: String // Must be Document, Image, or Video
})

var entitySchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
	type: String, // i.e. person, location, etc.
	sources: [{ type: Schema.Types.ObjectId, ref: 'Source' }]
});

var documentSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
	content: String,
	url: String
});

var imageSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
});

var videoSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
});

module.exports = {
	Node: mongoose.model('Node', nodeSchema),
	Source: mongoose.model('Source', sourceSchema),
	Entity: mongoose.model('Entity', entitySchema),
	Document: mongoose.model('Document', documentSchema),
	Image: mongoose.model('Image', imageSchema),
	Video: mongoose.model('Video', videoSchema)
}