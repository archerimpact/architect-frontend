import 'whatwg-fetch';

export function saveDocument(file) {
    const data = new FormData();
    data.append('file', file);
    data.append('originalname', 'random_file_name');
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

export function addProject(name) {
    const data = new FormData();
    data.append('name', name);
    var url = 'http://localhost:8000/investigation/project';
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
        console.log('Error: could not add project because: ' + err);
    });
}