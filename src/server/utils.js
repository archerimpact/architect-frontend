import 'whatwg-fetch';
import axios from 'axios';
import {configData} from '../config.js';

var qs = require('qs');

/* Brings a document from the backend to frontend */
export function retrieveDocument(sourceid) {
  var url = 'http://localhost:8000/investigation/project/document';
  return new Promise(function (fulfill, reject) {
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
    .catch(function (error) {
      console.log(error);
    })
  });
}
