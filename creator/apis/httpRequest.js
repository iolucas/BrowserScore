module.exports = this;

var Promise = require('promise');

this.get = function(url, https) {

	var http;

	if(https)
		http = require('https');
	else
		http = require('http');

	return new Promise(function (resolve, reject) {

		http.get(url, function(res) {

			var allData = "";

			res.on('data', function(recData) {
				if(recData)
					allData += recData.toString();
			});

			res.on('end', function() {
				resolve(allData);
			})

			res.resume();
		}).on('error', function() {
			reject(arguments);
		});
	});
}