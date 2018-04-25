'use strict';

const mongoose = require('mongoose')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const bodyParser = require('body-parser')
const auth = require('./passport-connector')
const schema = require('./mongo-connector')
const User = schema.User

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const sessionOptions = {
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'sNGDGX1Kd5j4sQRYWE33',
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


passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


const mongoURL = 'mongodb://localhost/architect'
const db = mongoose.connect(mongoURL)


app.listen(8001, '127.0.0.1', () => {
    console.log('Server has started')
});

app.get('/', (req, res) => {
	console.log(User);
});

app.use(passport.initialize())
app.use(passport.session())

app.post('/auth/login', passport.authenticate('local'), auth.login)
app.get('/auth/logout', auth.logout)
app.post('/auth/register', auth.register)
app.get('/auth/verify', auth.verify)


app.get('*', function(req, res) {
    res.status(404).send('Not found');
});