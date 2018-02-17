var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var graphSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  entities: [{ type: Schema.Types.ObjectId, ref: 'Entity' }],
  sources: [{ type: Schema.Types.ObjectId, ref: 'Source' }],
  connections: [{ type: Schema.Types.ObjectId, ref: 'Connection' }],
});

module.exports = mongoose.model('Graph', graphSchema);