var Letras = require('./apis/Letras.js');
var database = require('./apis/dbconnection.js');
var topsongs = require('./topSongs.js');


console.log('Connecting to composindb...');

var insertData = null;

//connect to the database
database.connect('composindb')
	.then(function(functions) {
		console.log("Connected to composindb.");

		insertData = functions.insert;

		var songInd = -1;
		var finalInd = topsongs.length;
		
		var intervalRef = setInterval(function() {
			songInd++;
			
			if(songInd >= finalInd) {
				clearInterval(intervalRef);
				console.log('JOB DONE');
				console.log(songInd);
			} else {
				console.log("Getting song " + songInd);
				startSpider(topsongs[songInd]);
			}

		}, 1000);
			

	}, function(err) {
		console.log('Error while connecting');
		console.log(err);
	});

function startSpider(path) {
	console.log('Getting data...')

	Letras.query('https://www.letras.mus.br' + path)
		.then(function(musicMeta) {
			console.log('Data ready.');
			console.log('Writing to database...');

			return insertData(musicMeta);

		}, function(err) {
			console.log('Error while getting data.');
			console.log(err);
		})
		.then(function(entry) {
			console.log('Data inserted.');

		}, function(err) {
			console.log('Error while inserting data.');
			console.log(err);
		});
}



/*Letras.query('https://www.letras.mus.br/zayn-malik/pillow-talk/')
	.then(function(musicMeta) {
		console.log(musicMeta);
		console.log(JSON.stringify(musicMeta).length);

	}, function(err) {
		console.log('ERROR');
		console.log(err);
	});*/