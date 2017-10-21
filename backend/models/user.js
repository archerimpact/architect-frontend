var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
    username: String,
    password: String,
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    entities: [{ type: Schema.Types.ObjectId, ref: 'Entity' }],
    sources: [{ type: Schema.Types.ObjectId, ref: 'Source' }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);