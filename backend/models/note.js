var mongoose = require('mongoose');

var NoteSchema = new mongoose.Schema({
    title: String,
    content: String,
    entities: Array,
    type: String,
});


module.exports = mongoose.model('Note', NoteSchema);