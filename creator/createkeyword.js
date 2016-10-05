var database = require('./apis/dbconnection.js');


var KeywordIndex = null;
var MusicData = null;

database.connect('composindb')
	.then(function(functions) {
		KeywordIndex = functions.keywordIndex;
		MusicData = functions.musicData;

		var k = new KeywordIndex({tteste:'ae'});
		k.save();


	}, function(err) {
		console.log('Error while connecting');
		console.log(err);
	});