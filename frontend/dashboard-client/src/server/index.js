'use strict';
import 'whatwg-fetch';

var qs = require('qs');

function authenticate(authInfo) {
	var url = 'https://localhost:/3001/login';
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
	var url = 'https://localhost:/3001/register'
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

function addJob(jobTitle, startTime, endTime, location, rate, notes) {
	var url ='https://workngo-rhayes128.c9users.io/employer/jobs';
	var options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: qs.stringify({
			jobTitle: jobTitle,
			startTime: startTime,
			endTime: endTime,
			rate: rate,
			loc: location,
			notes: notes,
			date: 'July 27, 2017',
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
			reject('Error: could not add job');
		})
	})
}

export function postProject(title, text) {
	var url ='http://localhost:8000/project';
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


export function getProject() {
	var url ='http://localhost:8000/project';
	var options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	};

	function rosetteToEntities(rosettes) {
        console.log(typeof(rosettes))
        console.log(rosettes)
        var rosette;
        var notes = [];
        for (rosette in rosettes) {
            notes.push(rosettes[rosette].entities)
            console.log("here are the entities just pushed: " + rosettes[rosette].entities)
        }
        var rosette = Object.values(rosette)
        console.log("here's all the entities: " + notes)
        console.log("here's entities[0]: " + notes[0])

       	var entities = notes.map((note) => {
    		return note.map((entity) => {
        		return {"name": entity.normalized, "type": entity.type}
    		})
    	})
    	return [].concat.apply([], entities)
    }

    let newEntities = null;

	return new Promise(function(fulfill, reject) {
		fetch(url, options)
		.then(res => {
			return res.json()})
		.then(json => {
			newEntities = rosetteToEntities(json);
			fulfill(newEntities)
		})
		.catch(err => {
			reject('Error: could not return entities');
		})
	})
}




/*module.exports = {
	authenticate,
	register,
	getProject,
}*/

