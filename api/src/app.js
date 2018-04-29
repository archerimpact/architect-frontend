'use strict'

const mongoose = require('mongoose')
const schema = require('./schema')
const User = schema.User
const projects = require('./projects')

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express()

const passport = require('passport')
const LocalStrategy = require('passport-local')
const auth = require('./passport-connector')

const credentials = require('./credentials')

const mongoURL = 'mongodb://alice:archer@ds125578.mlab.com:25578/redtwine1'
mongoose.connect(mongoURL)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//////////// Setting Headers (CORS) ////////////
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Content-Type, Accept, Origin, Referer, Accept, User-Agent')
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)
    // Pass to next layer of middleware
    next();
});
////////////////////////////////////////////////



const sessionOptions = {
    resave: false,              // don't save session if unmodified
    saveUninitialized: false,   // don't create session until something stored
    secret: credentials.sessionSecret,
    proxy: false,
    name: 'sessionId',
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 10080000,       // 1000*60*60*24*7 // Note persistent vs session cookies
        expires: new Date(new Date().getTime() + (1000*60*60*24*7)) // 7 days
    },
}
app.use(session(sessionOptions))


app.listen(8000, '127.0.0.1', () => {
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
app.post('/projects/create',    projects.create)
app.get('/projects/get',        projects.get)
app.get('/projects/all',        projects.list)
app.delete('/projects/delete',  projects.delete)


/* General Routes */
app.get('/', (req, res) => {
    console.log('Server running!')
})

app.get('*', function(req, res) {
    res.status(404).send('Not found')
})
