'use strict'

exports.success = function success(msg, res) {
    return res.status(200).json({ success: true, message: msg })
}

exports.error = function error(msg, res) {
    return res.status(400).json({ success: false, error: msg })
}