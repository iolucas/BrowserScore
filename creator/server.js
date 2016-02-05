var express = require('express');
var app = express();
var database = require('./apis/dbconnection.js');
var fs = require('fs');

var MusicData = null;

database.connect('composindb')
	.then(function(functions) {
		MusicData = functions.musicData;

		app.listen(3000, function () {
			console.log('Example app listening on port 3000!');
		});

	}, function(err) {
		console.log('Error while connecting');
		console.log(err);
	});

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

app.get('/key', function (req, res) {

	MusicData.find({language: 'en'}).then(function(results){

		var resString = '';
		var keywordsColl = {};

		for(key in results) {
			var result = results[key];
			var watsonResults = JSON.parse(result.get('watsonResult'));

			console.log('Working on ' + result.get('title') + '...')

			for(wKey in watsonResults) {
				var watsonResult = JSON.parse(watsonResults[wKey]);

				if(watsonResult.endpoint != 'keywords')
					continue;

				for(kInd in watsonResult.data.keywords) {
					var keyword = watsonResult.data.keywords[kInd];

					var keywordText = keyword.text.toLowerCase();

					if(keywordsColl[keywordText] == undefined)
						keywordsColl[keywordText] = 0;

					keywordsColl[keywordText]++;

					//watson += keyword.text + ' ' + keyword.relevance + '<br>';
				}
			}
		}

		console.log('Creating result array...');
		var resultArr = [];

		for(kInd in keywordsColl)
			resultArr.push({keyword : kInd, occur: keywordsColl[kInd]});
			//resString += kInd + ' ' + keywordsColl[kInd] + '<br>';	
		console.log('Result array created.');
		
		console.log('Sorting...');		

		var sortedResultArr = resultArr.sort(function(a,b) {
			if(a.occur > b.occur)
				return -1;
			return 1;
		});

		console.log('Sorted.');
		console.log('Creating output string...');

		for(var x = 0; x < sortedResultArr.length; x++)
			resString += sortedResultArr[x].keyword + ' ' + sortedResultArr[x].occur + ' ' + x + '<br>';	

		console.log('Created.');

		res.send(resString);

	}, function(){
		res.send('ERROR');	
	});

});


app.get('/', function (req, res) {
	//res.send('oi');
	//var fileContent = '' + fs.readFileSync('debug.html');

	//fileContent = fileContent.replace('<%%>', 'lucas');

	//res.send(fileContent);

	if(req.query.pageTitle) {

		MusicData.findOne({pageTitle: req.query.pageTitle}).then(function(result){
			var resString = '' + fs.readFileSync('debug.html');

			//var title = result.get('title');
			var lyric = result.get('lyric').replaceAll('\n','<br>');

			var watsonResults = JSON.parse(result.get('watsonResult'));

			console.log(watsonResults);

			var watson = '';
			for(key in watsonResults) {
				var watsonResult = JSON.parse(watsonResults[key]);

				switch(watsonResult.endpoint) {
					case 'title': continue;
					case 'author': continue;
					case 'text': continue;
					case 'feeds': continue;
					case 'microformats': continue;
					case 'language': continue;

					case 'entities':
						watson += 'ENTITIES: ' + JSON.stringify(watsonResult.data.entities) + '<br><br>';
						continue;

					case 'keywords':
						watson += 'KEYWORDS<br><br>';

						for(kInd in watsonResult.data.keywords) {
							var keyword = watsonResult.data.keywords[kInd];

							watson += keyword.text + ' ' + keyword.relevance + '<br>';
							//watson += keyword.sentiment.type + ' '+ keyword.sentiment.score +'<br>';

							//watson += '<br>';
						}

						watson += '<br>';

						continue;

					case 'category':
						watson += 'CATEGORY<br><br>';

						for(cInd in watsonResult.data.taxonomy) {
							var category = watsonResult.data.taxonomy[cInd];

							watson += category.label + ' ' + category.score + '<br>';
							//watson += keyword.sentiment.type + ' '+ keyword.sentiment.score +'<br>';

							//watson += '<br>';
						}

						watson += '<br>';
						//watson += 'CATEGORY: ' + JSON.stringify(watsonResult.data.taxonomy) + '<br><br>';
						continue;

					case 'concepts':
						watson += 'CONCEPTS<br><br>';

						for(conInd in watsonResult.data.concepts) {
							var concept = watsonResult.data.concepts[conInd];
							watson += concept.text + ' ' + concept.relevance + '<br>';
						}

						watson += '<br>';
						//watson += 'CONCEPTS: ' + JSON.stringify(watsonResult.data.concepts) + '<br><br>';
						continue;

					case 'sentiment':
						watson += 'SENTIMENT: ' + JSON.stringify(watsonResult.data.docSentiment) + '<br><br>';
						continue;

					case 'relations':
						//watson += 'RELATIONS: ' + JSON.stringify(watsonResult.data.relations) + '<br><br>';
						continue;

					case 'emotion':
						watson += 'EMOTIONS<br><br>';

						for(key in watsonResult.data.emotion) {
							watson += key + ' ' + watsonResult.data.emotion[key] + '<br>';
						}

						watson += '<br>';
						continue;
				}

				watson += JSON.stringify(watsonResult) + '<br><br>';
			}


			resString = resString
				.replace('<%title%>', result.get('title'))
				.replace('<%artist%>', result.get('artist'))
				.replace('<%lyric%>', lyric)
				.replace('<%watson%>', watson);

			res.send(resString);
			
			/*var resString = '';

			for(var i = 0; i < results.length; i++) {
				var result = results[i];
				//var watsonResult = JSON.parse(result.get('watsonResult'));

				//resString += '<script>var watsonRes = ' + watsonResult[1] + ';</script>';
				resString += '<div>' + result.get('title') +'->'+ result.get('page')+'</div>';
			}*/

			//res.send(fileContent.replace('<%%>', resString));
			
		
		}, function(err) {
			console.log('Error');
			console.log(err);
		});
	} else {



		MusicData.find(req.query).then(function(results){
			var resString = '';

			for(var i = 0; i < results.length; i++) {
				var result = results[i];
				if(result.get('language') != 'en')
					continue;
				//var watsonResult = JSON.parse(result.get('watsonResult'));

				//resString += '<script>var watsonRes = ' + watsonResult[1] + ';</script>';
				resString += '<div><a href="?pageTitle=' + encodeURIComponent(result.get('pageTitle')) + '">' + 
					result.get('artist') + ' - ' + result.get('title') +'</a></div>';
			}

			//res.send(fileContent.replace('<%%>', resString));
			res.send(resString);
		
		}, function(err) {
			console.log('Error');
			console.log(err);
		});
	}

	/*MusicData.where('title').equals('Hallelujah').then(function(results){
		var watsonResult = JSON.parse(results[0].get('watsonResult'));
		
		console.log(watsonResult[1]);
	});*/

	//res.send('Hello World!');			
});
