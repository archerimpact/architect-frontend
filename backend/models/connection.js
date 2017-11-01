var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var connectionSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
	vertices: [{ type: Schema.Types.ObjectId, ref: 'Vertex' }], // Must be size 2
	description: String,
	confidence: Number // 1, 2, or 3
});

module.exports = mongoose.model('Connection', connectionSchema);