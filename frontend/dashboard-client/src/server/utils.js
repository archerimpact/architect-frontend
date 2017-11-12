import 'whatwg-fetch';
import { configData } from '../config.js';

export function saveDocument(file) {
    const data = new FormData();
    data.append('file', file);
    data.append('originalname', 'random_file_name');
    var url = configData.backend_url + '/investigation/pdf';
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