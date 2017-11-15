"use strict";
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
    // _id: Schema.Types.ObjectId, // TODO: this line prevented new accounts being created BUT PROJECTS SAVING BELOW MAY BREAK??
    username: {
        type: String,
        index: { unique: true },
        required: true,
        lowercase: true
    },
    password: String,
    date: Date,
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
