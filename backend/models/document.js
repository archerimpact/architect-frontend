var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var DocumentSchema = new mongoose.Schema({
    title: String,
    text: String,
    entities: Array,
    type: String,
});

DocumentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Document', DocumentSchema);