'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const db = app.db
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


exports.create = async function(req, res) {
	if (!checkUserAuth(req, res)) { return }

	const projId   = mongoose.Types.ObjectId()
	const projName = req.body.name || 'Untitled'
	const project  = {
	    _id: projId,
	    name: projName,
	    users: [req.user._id],
  	}

  	const saved = await (new Project(project)).save()
  	if (!saved) { return error('Could not save project', res) }

  	return success('Project created', res)
}


exports.get = async function(req, res) {
	if (!checkUserAuth(req, res)) { return }
	if (!req.query.projectid) { return error('Empty project ID', res) }

	const result = await db.collection('projects').find({
		_id: mongoose.Types.ObjectId(req.query.projectid),
		users: {
			'$in': [req.user._id],
		}
	})

	const projects = await result.toArray()
	if (projects.length === 0) { return error('Project not found', res) }

	return success(projects[0], res)
}


exports.list = async function(req, res) {
	if (!checkUserAuth(req, res)) { return }

	const result = await db.collection('projects').find({
		users: {
			'$in': [req.user._id],
		}
	})

	const projects = await result.toArray()
	// TODO filter projects array to only return _id and name

	return success(projects, res)
}


