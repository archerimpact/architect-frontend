'use strict'

const archutil = require('./architect-util')
const success = archutil.success;
const error = archutil.error;

exports.login = async function login(req, res, next) {
    // this check should probably never evaluate, since passport.authenticate will have already failed.
    if (!req.user) { return error('Invalid login attempt', res) }
    return success('Logged in successfully', res)
}

exports.logout = async function logout(req, res) {
    req.logout()
    return success('Logged out successfully', res)
}

exports.verify = async function verify(req, res) {
    if (!req.isAuthenticated()) { return error('Invalid authentication', res) }
    return success('Valid authentication', res)
}

exports.register = async function register(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username) { return error('Invalid username', res) }
    if (!password) { return error('Invalid password', res) }

    const new_user     = new User({ username: username })
    const regis_result = await User.register(new_user, password)

    if (!regis_result) { return error('Registration failed; please try again', res) }

    return success('Registered successfully', res)
}