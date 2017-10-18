var cloudinary = require('cloudinary'),
	fetch = require('whatwg-fetch');

module.exports = {
	fileUploadMiddleware: function(req, res) {
		cloudinary.uploader.upload_stream((result) => {
			var url = 'https://localhost:8000/api/upload';
			var options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: qs.stringify({
					url: result.secure_url,
					name: req.body.name,
				})
			};
			fetch(url, options)
			.then(response => {
				res.status(200).json(response.data.data);
			})
			.catch(err => {
				res.status(500).json(err.response.data);
			});
		}).end(req.file.buffer);
	}
}

/*export default function fileUploadMiddleware(req, res) {
	cloudinary.uploader.upload_stream((result) => {
		var url = 'https://localhost:8000/api/upload';
		var options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: qs.stringify({
				url: result.secure_url,
				name: req.body.name,
			})
		};
		fetch(url, options)
		.then(response => {
			res.status(200).json(response.data.data);
		})
		.catch(err => {
			res.status(500).json(err.response.data);
		});
	}).end(req.file.buffer);
}*/
