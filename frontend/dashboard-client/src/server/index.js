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
		});
	});
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
			fulfill(json);
		})
		.catch(err => {
			reject('Error: could not register');
		});
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
	var url ='http://localhost:8000/investigation/entities';
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
			fulfill(res);
		})
		.catch(err => {
			reject('Error: could not add entity because: ' + err);
		});
	});
}

export function loadEntities() {
	/* Gets all entities related to a project. Server returns an object of objects containing all notes. */

	var url ='http://localhost:8000/investigation/entities';
	var options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	};

	function documentsToEntities(documents) {
		/* map over all notes, then map over all entities in each note, and build a new array entities 
		   which contains all entities of all notes */

		var entities = documents.map((document) => {
			return document.entities.map((entity) => {
				return {"name": entity.normalized, "type": entity.type, "qid": entity.entityId, "sourceid": document._id}
			});
		});
		return [].concat.apply([], entities);
	}

	let newEntities = null;
	return new Promise(function(fulfill, reject) {
		fetch(url, options)
		.then(res => {
      console.log("reached response")
			return res.json();
		})
		.then(json => {
			var documents = Object.values(json);
			newEntities = documentsToEntities(documents);
			fulfill({entities: newEntities, documents: documents})
		})
		.catch(err => {
			reject('Error: could not return entities because ' + err);
		});
	});
}