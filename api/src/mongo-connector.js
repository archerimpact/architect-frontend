'use strict'

const mongoose = require('mongoose')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = mongoose.Schema({
    // _id: Schema.Types.ObjectId, // TODO: this line prevented new accounts being created BUT PROJECTS SAVING BELOW MAY BREAK?? Maybe _id
    username: {
        type: String,
        index: { unique: true },
        required: true,
        lowercase: true
    },
    password: String,
    date: Date,
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
});

userSchema.plugin(passportLocalMongoose)

exports.User = mongoose.model('User', userSchema)