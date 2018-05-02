'use strict'

const mongoose = require('mongoose')
const app = require('./app')

const schema = require('./schema')
const Project = schema.Project

const archutil  = require('./architect-util')
const success   = archutil.success
const error     = archutil.error
const authError = archutil.authError


function checkUserAuth(req, res) {
    if (!req.user) {
        authError('Must be signed in to access a project', res)
        return false
    }
    return true
}


function validate(str) {
    // TODO write real validation
    return str
}


exports.create = async function(req, res) {
    if (!checkUserAuth(req, res)) { return }

    const projId   = mongoose.Types.ObjectId()
    const projName = validate(req.body.name) || 'Untitled'
    const projDesc = validate(req.body.description) || ''
    const project  = {
        _id: projId,
        name: projName,
        description: projDesc,
        users: [req.user._id],
      }

      const saved = await (new Project(project)).save()
      if (!saved) { return error('Could not save project', res) }

      return success('Project created', res)
}


exports.get = async function(req, res) {
    if (!checkUserAuth(req, res)) { return }
    if (!req.query.projectid) { return error('Empty project ID', res) }

    const projects = await Project
        .find({
            _id: mongoose.Types.ObjectId(req.query.projectid),
            users: {
                '$in': [req.user._id],
            }
        })
        .exec()

    if (projects.length === 0) { return error('Project not found', res) }

    return success(projects[0], res)
}


exports.list = async function(req, res) {
    if (!checkUserAuth(req, res)) { return }

    const projects = await Project
        .find({
            users: {
                '$in': [req.user._id],
            }
        })
        .select('_id name description')
        .exec()

    return success(projects, res)
}


exports.delete = async function(req, res) {
    if (!checkUserAuth(req, res)) { return }

    const projects = await Project
        .remove({
            _id: mongoose.Types.ObjectId(req.query.projectid),
            users: {
                '$in': [req.user._id],
            }
        })
        .exec()

    if (!projects || projects.ok !== 1 || projects.n < 1) {
        return error('Failed to delete', res)
    }

    return success('Project deleted', res)
}
