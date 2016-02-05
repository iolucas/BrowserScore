var http = require('http');
var Promise = require('promise');

module.exports = this;

this.query = function(textContent) {

	return getValidationData()
		.then(function(validationData) {
			return getTextData(validationData.csrfToken, validationData.sessionId, textContent);
		});
}

/*analiseText('Lucas Vieria deolavssposds', function(resp) {
	console.log(resp);

});*/



/*function analiseText(text, callback) {

	getValidationData().then(function(validationData) {

		getTextData(validationData.csrfToken, validationData.sessionId, text)
			.then(function(resp) {
				callback(resp);
			});

	}, function(err) {
		console.log(err);
	});
}*/

function extractText(targetText, keyText, endSymbol) {
	var startInd = targetText.indexOf(keyText);
	
	if(keyText == -1)
		return '';

	return targetText.substring(startInd + keyText.length, targetText.indexOf(endSymbol, startInd));
}

function getValidationData() {

	return new Promise(function (resolve, reject) {
		
		var recData = '';

		http.get('http://demo1.alchemyapi.com/language.php', (res) => {
  			res.setEncoding('utf8');

			res.on('data', (chunk) => {
				recData += chunk;
			});

			res.on('end', () => {
				var cookies = res.headers['set-cookie'];

				var sessId = '';
				var csrfToken = '';

				for(var i = 0; i < cookies.length; i++) {
					var cCookie = cookies[i];
					sessId = extractText(cCookie,'PHPSESSID=',';');

					if(sessId != '')
						break;
				}

				csrfToken = extractText(recData,"csrf_token = '","';");

				resolve({
					sessionId: sessId,
					csrfToken: csrfToken
				});	
			});

			res.on('error', (e) => {
				reject(e);		
			});

		}).on('error', (e) => {
  			reject(e);
		});
	});
}

function getTextData(csrf, sessionId, textContent) {
	//Form data copied from browser
	var postData = 'endpoints%5B0%5D%5Bendpoint%5D=entities&endpoints%5B0%5D%5BapiUrl%5D=%2Ftext%2FTextGetRankedNamedEntities&endpoints%5B0%5D%5BshowSourceText%5D=1&endpoints%5B0%5D%5Bsentiment%5D=1&endpoints%5B0%5D%5Bquotations%5D=1&endpoints%5B0%5D%5BmaxRetrieve%5D=50&endpoints%5B1%5D%5Bendpoint%5D=keywords&endpoints%5B1%5D%5BapiUrl%5D=%2Ftext%2FTextGetRankedKeywords&endpoints%5B1%5D%5Bsentiment%5D=1&endpoints%5B1%5D%5BshowSourceText%5D=1&endpoints%5B1%5D%5BmaxRetrieve%5D=50&endpoints%5B2%5D%5Bendpoint%5D=category&endpoints%5B2%5D%5BapiUrl%5D=%2Ftext%2FTextGetRankedTaxonomy&endpoints%5B2%5D%5BshowSourceText%5D=1&endpoints%5B3%5D%5Bendpoint%5D=concepts&endpoints%5B3%5D%5BapiUrl%5D=%2Ftext%2FTextGetRankedConcepts&endpoints%5B4%5D%5Bendpoint%5D=sentiment&endpoints%5B4%5D%5BapiUrl%5D=%2Ftext%2FTextGetTextSentiment&endpoints%5B5%5D%5Bendpoint%5D=relations&endpoints%5B5%5D%5BapiUrl%5D=%2Ftext%2FTextGetRelations&endpoints%5B5%5D%5Bentities%5D=1&endpoints%5B5%5D%5BrequireEntities%5D=1&endpoints%5B5%5D%5Bkeywords%5D=1&endpoints%5B5%5D%5Bsentiment%5D=1&endpoints%5B6%5D%5Bendpoint%5D=language&endpoints%5B6%5D%5BapiUrl%5D=%2Ftext%2FTextGetLanguage&endpoints%5B7%5D%5Bendpoint%5D=title&endpoints%5B7%5D%5BapiUrl%5D=&endpoints%5B8%5D%5Bendpoint%5D=author&endpoints%5B8%5D%5BapiUrl%5D=&endpoints%5B9%5D%5Bendpoint%5D=text&endpoints%5B9%5D%5BapiUrl%5D=&endpoints%5B9%5D%5BextractLinks%5D=1&endpoints%5B10%5D%5Bendpoint%5D=feeds&endpoints%5B10%5D%5BapiUrl%5D=&endpoints%5B11%5D%5Bendpoint%5D=microformats&endpoints%5B11%5D%5BapiUrl%5D=&endpoints%5B12%5D%5Bendpoint%5D=emotion&endpoints%5B12%5D%5BapiUrl%5D=%2Ftext%2FTextGetEmotion';

	postData += '&text=' + encodeURIComponent(textContent);
    postData += '&csrf_token=' + csrf;

	return new Promise(function (resolve, reject) {

		var options = {
			hostname: 'demo1.alchemyapi.com',
			path: '/cgi/api/analyze.php',
			method: 'POST',
			headers: {
			    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			    'Content-Length': postData.length,
				'Cookie': 'PHPSESSID=' + sessionId
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
















