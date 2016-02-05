var http = require('http');
var fs = require('fs');
var Promise = require('promise');

var filePointer = 0;

for(var i = 0; i < 1; i++) {
	setInterval(function(){
		getImg();		
	}, 10000);
	

}


function getImg() {

	var filePoint = filePointer++;
	console.log("Request Num:" + filePoint + "...");

	getImgMetaData('http://www.wallpapereast.com/static/images/wallpaper-6.jpg')
		.then(function(resp) {
			console.log('writing ' + resp.length + " @->" + filePoint)
			fs.writeFile('results/testeResult'+ filePoint +'.txt', resp, (err) => {
	  			if (err) throw err;
	  			console.log('Wrote!');
			});

		}, function(err) {
			console.log('ERROR');
			console.log(err);

		});

}




function getImgMetaData(imgUrl) {

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
			console.log(res);
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




/*function postImg() {



var postData = JSON.stringify({
	url: 'http://www.wallpapereast.com/static/images/wallpaper-6.jpg'
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

var req = http.request(options, (res) => {
  //console.log(`STATUS: ${res.statusCode}`);
  //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    //console.log(`BODY: ${chunk}`);
    console.log(chunk);
  });
  res.on('end', () => {
    console.log('No more data in response.')
  })
});

req.on('error', (e) => {
  //console.log(`problem with request: ${e.message}`);
  console.log('error');
  console.log(e);
});

// write data to request body
req.write(postData);
req.end();

}*/