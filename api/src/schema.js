'use strict'

const mongoose = require('mongoose')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId, // TODO: this line prevented new accounts being created BUT PROJECTS SAVING BELOW MAY BREAK?? Maybe _id
    username: {
        type: String,
        index: { unique: true },
        required: true,
        lowercase: true
    },
    password: String,
    // email: String,
})
userSchema.plugin(passportLocalMongoose)


const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    img: String,
    data: String,
    published: Boolean,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
})


exports.User    = mongoose.model('User', userSchema)
exports.Project = mongoose.model('Project', projectSchema)
