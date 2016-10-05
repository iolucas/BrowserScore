module.exports = this;

var https = require('https');
var Promise = require('promise');
var cheerio = require('cheerio');

var currToken = '';
var currCookie = '';

this.init = function() {

	return new Promise(function (resolve, reject) {

		getValidationData().then(function(validInfo) {
			currToken = validInfo.token;
			currCookie = validInfo.cookie;

			resolve(function(url) {
				return getImageMeta(url, currToken, currCookie);
			});

		}, function(err) {
			reject(err);
		});
	});
}

/*getValidationData().then(function(validInfo) {

	getImageMeta('http://static.ddmcdn.com/gif/earliest-dogs-660x433-130306-akita-660x433.jpg', validInfo.token, validInfo.cookie)
		.then(function(metaData) {
			console.log(metaData);
		}, function(err) {
			console.log("ERROR");
			console.log(err);
		});



}, function(e) {
	console.log("error");
	console.log(e);
});*/

function getImageMeta(url, token, cookie) {

	return new Promise(function (resolve, reject) {

		var postData = 'color_results=0&language=en&url=' + encodeURIComponent(url) + '&_token=' + token;


		var options = {
			hostname: 'imagga.com',
			path: '/auto-tagging-demo/query',
			method: 'POST',
			headers: {
			    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			    'Content-Length': postData.length,
				'Cookie': cookie
			}
		};

		var recData = '';

		var req = https.request(options, (res) => {

			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				recData += chunk;
			});
			res.on('end', () => {
				resolve(recData)	
			})
		});

		req.on('error', (e) => {
			reject(e);
		});

		req.write(postData);
		req.end();

	});
}



function getValidationData() {

	return new Promise(function (resolve, reject) {
		
		var recData = '';
		var cookie = '';

		var req = https.get('https://imagga.com/auto-tagging-demo', (res) => {
  			res.setEncoding('utf8');

			res.on('data', (chunk) => {
				recData += chunk;
			});

			res.on('end', () => {

				$ = cheerio.load(recData);
				var token = $('input[name=_token]','#analyze-form').prop('value');
				resolve({
					token: token,
					cookie: cookie
				});

			});

			res.on('error', (e) => {
				reject(e);		
			});

		}).on('error', (e) => {
  			reject(e);
		});

		req.on('response', function(inMsg) {
			cookie = inMsg.headers['set-cookie'].join('; ');
		});
	});
}