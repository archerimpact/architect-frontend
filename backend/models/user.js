var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	_id: Schema.Types.ObjectId,
    username: String,
    password: String,
    date: Date,
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);