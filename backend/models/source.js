var mongoose = require('mongoose');

/*var SourceSchema = new mongoose.Schema({
    username: String,
    password: String
});

module.exports = mongoose.model('Source', SourceSchema);*/
var DocumentSchema = new mongoose.Schema({
	gcp_name: String, // gcp location, something?
	content: String
});

module.exports = mongoose.model('Document', DocumentSchema);