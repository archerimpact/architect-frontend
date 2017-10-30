"use strict";
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        index: { unique: true },
        required: true,
        lowercase: true
    },
    password: {
        type: String,
    },
    test_count : {
        type: Number,
        default: 0
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
