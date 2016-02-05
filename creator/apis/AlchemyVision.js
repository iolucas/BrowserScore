module.exports = this;

var http = require('http');
var Promise = require('promise');


this.queryUrl = function(imgUrl) {

	return new Promise(function (resolve, reject) {

		var postData = JSON.stringify({
			url: imgUrl
		});

		var options = {
			hostname: 'vision.alchemy.ai',
			path: '/img-request',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': postData.length
			}
		};

		var recData = '';

		var req = http.request(options, (res) => {

			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				recData += chunk;
			});
			res.on('end', () => {
				resolve(recData);	
			})
		});

		req.on('error', (e) => {
			reject(e);		
		});

		req.write(postData);
		req.end();
	});

}