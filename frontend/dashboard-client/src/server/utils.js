import 'whatwg-fetch';
import axios from 'axios';
import { configData } from '../config.js';

var qs = require('qs');

export function saveDocument(file, projectid) {
    const file_data = new FormData();
    file_data.append('file', file);

    var url = configData.backend_url + '/investigation/pdf';

    return new Promise(function(fulfill, reject) {
        axios.post(url, file_data)
        .then(function (response) {
            console.log("success");
        })
        .catch(function(error) {
          console.log(error);
        })
    });
}

/* Brings a document from the backend to frontend */
export function retrieveDocument(sourceid) {
    var url = 'http://localhost:8000/investigation/project/document';
    return new Promise(function(fulfill, reject) {
        axios.get(url, {
            params: {
                sourceid: sourceid,
            },
            responseType: "arraybuffer"
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

export function getVertexList(projectid) {
  var url = 'http://localhost:8000/investigation/vertexList';

  return new Promise(function(fulfill, reject) {
    axios.get(url, {
      params: {
        projectid: projectid
      }
    })
    .then(function (response) {
      fulfill(response.data)
    })
    .catch(function(error) {
      console.log(error);
    })
  });
}

export function getConnectionList(projectid) {

  var url ='http://localhost:8000/investigation/connectionList';

  //debugger;

  return new Promise(function(fulfill, reject) {
    axios.get(url, {
      params: {
        projectid: projectid
      }
    })
    .then(function (response) {
      fulfill(response.data)
    })
    .catch(function(error) {
      console.log(error);
    })
  });
}
