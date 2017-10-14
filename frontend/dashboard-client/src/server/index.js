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


module.exports = {
	authenticate,
	register,
	addLink
}