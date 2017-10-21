var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linkSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
	nodes: [{ type: Schema.Types.ObjectId, ref: 'Node' }], // Must be size 2
	description: String,
	confidence: Number // 1, 2, or 3
});

module.exports = mongoose.model('Link', linkSchema);