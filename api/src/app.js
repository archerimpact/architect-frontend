'use strict'

const mongoose = require('mongoose')
const express = require('express')
const app = express()
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const bodyParser = require('body-parser')
const credentials = require('./credentials')
const auth = require('./passport-connector')
const schema = require('./schema')
const User = schema.User

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const sessionOptions = {
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: credentials.sessionSecret,
    proxy: false,
    name: "sessionId",
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 10080000, // 1000*60*60*24*7 // Note persistent vs session cookies
        expires: new Date(new Date().getTime() + (1000*60*60*24*7)) // 7 days
    },
}
app.use(session(sessionOptions))


const mongoURL = 'mongodb://localhost/architect'
mongoose.connect(mongoURL)
exports.db = mongoose.connection


app.listen(8001, '127.0.0.1', () => {
    console.log('Server has started')
})


/* User Authentication */
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(passport.initialize())
app.use(passport.session())

app.post('/auth/login',    passport.authenticate('local'), auth.login)
app.get('/auth/logout',    auth.logout)
app.post('/auth/register', auth.register)
app.get('/auth/verify',    auth.verify)


/* Project Management */
// TODO expose db in a better way so this import can be moved to the top
const projects = require('./projects')
app.post('/projects/create', projects.create)
app.get('/projects/get',     projects.get)
app.get('/projects/all',     projects.list)


/* General Routes */
app.get('/', (req, res) => {
    console.log('Server running!')
})

app.get('*', function(req, res) {
    res.status(404).send('Not found')
})
