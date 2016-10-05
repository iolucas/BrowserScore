var imaga = require('./apis/imaga.js');
var database = require('./apis/dbconnection.js');
var express = require('express');
var app = express();
var Promise = require('promise');
var fs = require('fs');

var multer  = require('multer');
var upload = multer({ dest: 'public/tempimg/' });


console.log("PHOTOM BETA");
console.log('');

var KeywordIndex;
var MusicData;

var queryImg;

console.log('Connecting db...')
database.connect('composindb')
	.then(function(functions) {
		console.log('Db connected.')
		KeywordIndex = functions.keywordIndex;
		MusicData = functions.musicData;

		console.log('Initing Imaga...');
		return imaga.init();

	}, function(err) {
		console.log('Error while connecting');
		console.log(err);
	})

	.then(function(queryImgFunc) {

		queryImg = queryImgFunc;

		console.log('Imaga initiated.');
		console.log('Initing server...');
		console.log('');

		app.listen(8080, function () {
			console.log('PHOTOM RUNNING ON 8080');
		});
	});

app.use(express.static('public'));

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 40; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

app.post('/post', upload.single('img-file'), function (req, res, next) {var regex = /^data:.+\/(.+);base64,(.*)$/;

	console.log(req);

	var imgData = req.body.img;
	if(!imgData) {
		res.send("INVALID");
		return;
	}

	var fileName = makeid() + '.png';

	var matches = req.body.img.match(regex);
	var ext = matches[1];
	var data = matches[2];
	var buffer = new Buffer(data, 'base64');
	fs.writeFileSync('public/tempimg/' + fileName, buffer);

	var queryUrl = 'http://189.100.248.62:8080/tempimg/' + fileName;

	getImgMusic(queryUrl)
		.then(function(result) {
			/*res.send('<img width="500" height="500" src="' + queryUrl + '"><br><br>s<iframe width="560" height="315" src="https://www.youtube.com/embed/' + result.get('youtubeid') + '" frameborder="0" allowfullscreen></iframe>');*/
			var youtubeId = result.get('youtubeid');
			var artist = result.get('artist');
			var title = result.get('title');


			console.log(artist + " - " + title + " - " + youtubeId);
			res.send('<div id="resultData"><h1>'+ artist + " - " + title +'</h1></div><iframe id="resultVideo" src="https://www.youtube.com/embed/' + youtubeId + '" frameborder="0" allowfullscreen>');

			console.log('Response successfull');

		}, function(err) {
			console.log("ERROR");
			console.log(err);
			res.send('ERROR');
		});

});

app.get('/', function (req, res) {
	res.send('' + fs.readFileSync('photomIndex.html'));

});

/*app.get('/query', function (req, res) {
	var queryUrl = req.query.url;
	
	if(!queryUrl) {
		res.send("INVALID URL");
		return;
	}

	//res.send('query');
	getImgMusic(queryUrl)
		.then(function(result) {
			res.send('<img width="500" height="500" src="' + queryUrl + '"><br><a target="_blank" href="https://www.youtube.com/watch?v=' + result.get('youtubeid')+'">' + result.get('title') + " " + result.get('artist') + '</a>');
			//res.send(result.get('title') + " " + result.get('artist') + " " + result.get('youtubeid'));
			console.log('Response successfull');

		}, function(err) {
			console.log("ERROR");
			console.log(err);
			res.send('ERROR');
		});
});*/

function getImgMusic(url) {

	console.log('Querying image meta data...');

	return new Promise(function (resolve, reject) {

		queryImg(url)
			.then(function(metadata) {
				console.log('Image meta data received.');

				console.log(metadata);

				console.log('Creating tags maps...');

				var tagsArr = JSON.parse(metadata).tagss;
				var tagsScore = {}
				var tags = [];

				for(var t = 0; t < tagsArr.length; t++) {
					var tag = tagsArr[t];
					tagsScore[tag.namee.toLowerCase()] = tag.confidence;
					tags.push(tag.namee.toLowerCase());
				}

				console.log(tags);

				console.log('Maps created.');

				console.log('Getting keywords...');

				var songsPoints = {}

				KeywordIndex.where('text').in(tags).then(function(results) {
					
					console.log('Keyword get.');

					console.log('Managing results and generating songs points...');

					for(var i = 0; i < results.length; i++) {

						var resKeyword = results[i].get('text');
						var resMembers = results[i].get('members');

						for(var j = 0; j < resMembers.length; j++) {

							var url = resMembers[j].url;
							var relevance = resMembers[j].relevance;

							if(songsPoints[url] == undefined)	
								songsPoints[url] = 0;

							songsPoints[url] += parseFloat(tagsScore[resKeyword]) * parseFloat(relevance);
						}

					}

					console.log('Done');



					var songsPointsArr = [];
					for(song in songsPoints) {
						var songObj = {
							url: song,
							points: Math.round(songsPoints[song])
						}
						songsPointsArr.push(songObj);
					}

					var songsSorted = songsPointsArr.sort(function(a,b) {
						if(a.points > b.points)
							return -1;
						return 1;
					});


					//Getting the number of points sum to generate the random value
					var pointsSum = 0;
					for(var a = 0; a < 10; a++) {
						if(songsSorted[a] == undefined)
							break;

						console.log(songsSorted[a]);

						pointsSum += songsSorted[a].points;
					}

					var randValue = Math.round(Math.random() * pointsSum);

					console.log('Getting choosed entry...');

					var accum = 0;
					var choosedSongObj;

					for(var a = 0; a < songsSorted.length; a++) {
						var choosedSongObj = songsSorted[a];

						accum += choosedSongObj.points;

						if(randValue <= accum)
							break;
					}

					console.log('');
					console.log('');

					MusicData.findOne({url:choosedSongObj.url}).then(function(result) {
						resolve(result);
					}, function(err) {
						reject(err);
					});

				}, function(err){
					reject(err);
				});

		}, function(err) {
			reject(err);
		});


	});

	



}

		

		
		


