var database = require('./apis/dbconnection.js');
var fs = require('fs');

var KeywordIndex;
var MusicData;

var missid = '';

database.connect('composindb')
	.then(function(functions) {
		console.log('Db connected.')
		KeywordIndex = functions.keywordIndex;
		MusicData = functions.musicData;

		MusicData.where('language').equals('en').then(function(results){
			for(var i = 0; i < results.length; i++) {
				var youtubeid = results[i].get('youtubeid');
				if(youtubeid.length < 5) {
					missid += results[i].get('artist') + " - " + results[i].get('title') + '\r\n';
				}
					//console.log(results[i].get('url'));
			}
				
			console.log('DONE.Saving...');

			fs.writeFileSync('missid.txt', missid);
			console.log('saved');

		});

	}, function(err) {
		console.log('Error while connecting');
		console.log(err);
	});