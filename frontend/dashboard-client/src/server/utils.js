import 'whatwg-fetch';
import axios from 'axios';

var qs = require('qs');

export function saveDocument(file, projectid) {
    const data = new FormData();
    data.append('file', file);
    data.append('projectid', projectid);
    var url = 'http://localhost:8000/investigation/pdf';
    var options = {
        method: 'POST',
        body: data
    };
    fetch(url, options)
    .then(response => {
        // TODO: depending on the response, give user information about file upload
        console.log(response);
    })
    .catch(err => {
        console.log('Error: could not upload document because: ' + err);
    });
}

/* Brings a document from the backend to frontend. TOOD: Angelina, does not yet work correctly */
export function retrieveDocument(name, projectid) {
    var url = 'http://localhost:8000/investigation/project/document';
    return new Promise(function(fulfill, reject) {
        axios.get(url, {
            params: {
                projectid: projectid,
                file_name: name
            }
        })
        .then(function (document) {
            fulfill(document);
            // downlaod this file locally
        })
        .catch(function(error) {
            console.log(error);
        })
    });
}

export function addProject(name) {
    var url = 'http://localhost:8000/investigation/project';
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
            name: name
        })
    };
    fetch(url, options)
    .then(response => {
        // TODO: depending on the response, give user information about project add
        console.log(response);
    })
    .catch(err => {
        console.log('Error: could not add project because: ' + err);
    });
}

export function getProjectList() {
    var url = 'http://localhost:8000/investigation/projectList';
    var options = {
        method: 'GET',
    };
    return new Promise((fulfill, reject) => {
        fetch(url, options)
        .then(res => res.json())
        .then(json => {
            fulfill(json);
        })
        .catch(err => {
            reject('Error: could not return project list because: ' + err);
        });
    })
}

export function getVertexList() {
    var url = 'http://localhost:8000/investigation/vertexList';
    var options = {
        method: 'GET',
    };
    return new Promise((fulfill, reject) => {
        fetch(url, options)
        .then(res => res.json())
        .then(json => {
            fulfill(json);
        })
        .catch(err => {
            reject('Error: could not return vertex list because: ' + err);
        });
    })
}

export function getConnectionList() {
    var url = 'http://localhost:8000/investigation/connectionList';
    var options = {
        method: 'GET',
    };
    return new Promise((fulfill, reject) => {
        fetch(url, options)
        .then(res => res.json())
        .then(json => {
            fulfill(json);
        })
        .catch(err => {
            reject('Error: could not return vertex list because: ' + err);
        });
    })
}
