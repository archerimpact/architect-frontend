'use strict';
import 'whatwg-fetch';

var qs = require('qs');

function authenticate(authInfo) {
	var url = 'https://localhost:8000/login';
	var options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: qs.stringify({
			username: authInfo.username,
			password: authInfo.password
		})
	};
	return new Promise(function(fulfill, reject) {
		fetch(url, options)
		.then(res => res.json())
		.then(json => {
			if (!json.login) {
				reject('Error: could not authenticate');
			}
			fulfill(json)
		})
		.catch(err => {
			reject('Error: could not authenticate');
		})
	})
}

function register(authInfo) {
	var url = 'https://localhost:8000/register'
	var options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: qs.stringify({
			username: authInfo.username,
			password: authInfo.password,
			name: authInfo.name,
			email: authInfo.email,
			zip: authInfo.zip,
			company: authInfo.company
		})
	};
	return new Promise(function(fulfill, reject) {
		fetch(url, options)
		.then(res => res.json())
		.then(json => {
			if (!json.login) {
				reject('Error: could not authenticate');
			}
			fulfill(json)
		})
		.catch(err => {
			reject('Error: could not register');
		})
	})
}


/* Sample method for adding links
function addLink(url, label, notes) {
	var url ='http://localhost:8000/jobs';
	var options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: qs.stringify({
			url: url,
			label: label,
			notes: notes
		})
	};
	return new Promise(function(fulfill, reject) {
		fetch(url, options)
		.then(res => {
			return res.json()})
		.then(json => {
			fulfill(json)
		})
		.catch(err => {
			reject('Error: could not add link');
		})
	})
}
*/

export function submitText(title, text) {
	var url ='http://localhost:8000/entities';
	var options = {
		method: 'POST',
		headers: {
    		'Content-Type': 'application/json' },
		body: JSON.stringify({
			'title': title,
			'text': text,
		})
	};
	return new Promise(function(fulfill, reject) {
		fetch(url, options)
		.then(res => {
			return res})
		.then(json => {
			fulfill(json)
		})
		.catch(err => {
			reject('Error: could not add entity because: ' + err);
		})
	})
}


//Gets all entities related to a project. Server returns an object of objects containing all notes.
export function loadEntities() {
	var url ='http://localhost:8000/entities';
	var options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	};

	function notesToEntities(notes) {
        //Turns an object of objects into an array of objects instead to iterate over it

        console.log("here are the notes in notesToEntities: " + notes)
        /* map over all notes, then map over all entities in each note, and build a new array entities 
           which contains all entities of all notes */
       	var entities = notes.map((note) => {
    		return note.entities.map((entity) => {
        		return {"name": entity.normalized, "type": entity.type, "qid": entity.entityId, "sourceid": note._id}
    		})
    	})
    	return [].concat.apply([], entities)
    }

    let newEntities = null;
	return new Promise(function(fulfill, reject) {
		fetch(url, options)
		.then(res => {
			console.log("response type before turning into json: " + typeof(res))
			return res.json()})
		.then(json => {
			var notes = Object.values(json);
			newEntities = notesToEntities(notes);
			fulfill({entities: newEntities, notes: notes})
		})
		.catch(err => {
			reject('Error: could not return entities because ' + err);
		})
	})
}

export function loadSources() {
	var url = 'http://localhost:8000/entities';
	var options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	};

	let notes = null;
	return new Promise(function(fulfill, reject) {
		fetch(url, options)
		.then(res => {
			return res.json()})
		.then(json => {
			console.log(json)
			fulfill(json)
		})
		.catch(err => {
			reject('Error: could not return entities because ' + err);
		})
	})

}

/* This was in Michael's master branch but was not how I exported my functions.

module.exports = {
	authenticate,
	register,
	getProject,
}*/

