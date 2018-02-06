var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
	name: String,
    entities: [{ type: Schema.Types.ObjectId, ref: 'Entity' }],
    sources: [{ type: Schema.Types.ObjectId, ref: 'Source' }],
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    connections: [{ type: Schema.Types.ObjectId, ref: 'Connection' }],
    graphs: [{ type: Schema.Types.ObjectId, ref: 'Graph' }],
});

module.exports = mongoose.model('Project', projectSchema);