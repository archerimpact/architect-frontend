var mongoose = require('mongoose');

var DocumentSchema = new mongoose.Schema({
    title: String,
    text: String,
    entities: Array,
    type: String,
});

module.exports = mongoose.model('Document', DocumentSchema);