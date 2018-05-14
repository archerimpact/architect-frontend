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


async function checkProjectAuth(req, res, field) {
    if (!field) {
        error('Empty project ID', res)
        return false
    }

    const projects = await Project
        .find({
            _id: mongoose.Types.ObjectId(field),
            users: {
                '$in': [req.user._id],
            }
        })

    console.log(projects)

    if (projects.length < 1) {
        error('Project not found', res)
        return false
    }

    return true
}


function validate(str, res) {
    // TODO write real validation
    return str
}

function toBool(str) {
    if (!str) { return null }

    let parsed
    try {
        parsed = JSON.parse(str)
    }
    catch (err) {
        parsed = false
    }

    if (typeof(parsed) !== 'boolean') {
        return false
    }

    return parsed
}


exports.create = async function(req, res) {
    if (!checkUserAuth(req, res)) { return }

    const projId    = mongoose.Types.ObjectId()
    const projName  = validate(req.body.name) || 'Untitled'
    const projDesc  = validate(req.body.description) || ''
    const projImg   = req.body.img || ''
    const projData  = req.body.data || ''
    const published = false
    const timestamp = Date.now()
    const project   = {
        _id: projId,
        name: projName,
        description: projDesc,
        img: projImg,
        data: projData,
        published: published,
        users: [req.user._id],
        created_on: timestamp,
        last_modified: timestamp,
      }

      const saved = await (new Project(project)).save()
      if (!saved) { return error('Could not save project', res) }

      return success('Project created', res)
}


exports.get = async function(req, res) {
    if (!checkUserAuth(req, res)) { return }

    const auth = await checkProjectAuth(req, res, req.query.projectid)
    if (!auth) { return }

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


exports.update = async function(req, res) {
    if (!checkUserAuth(req, res)) { return }

    const auth = await checkProjectAuth(req, res, req.body.projectid)
    if (!auth) { return }

    const updates = {}

    const projName  = validate(req.body.name)
    const projDesc  = validate(req.body.description)
    const projImg   = req.body.img
    const projData  = req.body.data
    const published = toBool(req.body.published)

    if (projName)  { updates.name        = projName  }
    if (projDesc)  { updates.description = projDesc  }
    if (projImg)   { updates.img         = projImg   }
    if (projData)  { updates.data        = projData  }
    if (published) { updates.published   = published }

    if (Object.keys(updates).length === 0) {
        return error('No fields to update', res)
    }

    updates.last_modified = Date.now()

    let dbResponse
    try {
        dbResponse = await Project
            .update(
                { _id: mongoose.Types.ObjectId(req.body.projectid) },
                { $set: updates },
                { upsert: false }
            )
            .exec()
    }
    catch (err) {
        return error(err, res)
    }

    if (!dbResponse || dbResponse.ok !== 1) {
        return error('An error occurred; please try again', res)
    }

    return success('Project updated', res)
}


exports.list = async function(req, res) {
    if (!checkUserAuth(req, res)) { return }

    const projects = await Project
        .find({
            users: {
                '$in': [req.user._id],
            }
        })
        // .select('_id name description')
        .exec()

    return success(projects, res)
}


exports.delete = async function(req, res) {
    if (!checkUserAuth(req, res)) { return }

    const auth = await checkProjectAuth(req, res, req.query.projectid)
    if (!auth) { return }

    const projects = await Project
        .update(
            { _id: mongoose.Types.ObjectId(req.query.projectid) },
            { $set: { users: [] } }
        )
        .exec()

    if (!projects || projects.ok !== 1 || projects.n < 1) {
        return error(projects, res)
    }

    return success(projects, res)
}
