//var proxylang = require('./proxylang');
var database = require('./apis/dbconnection.js');

var csrf = '41faeac4a19b57be77e403ed6ec5804e4bca8fdcd30c26e48854f7f2c1727fd5';

//connect to the database
database.connect('composindb')
	.then(function(functions) {
		var MusicData = functions.musicData;

		console.log('Querying data...')

		MusicData.where('title').equals('Hallelujah').then(function(results){
			var watsonResult = JSON.parse(results[0].get('watsonResult'));

			/*results.forEach(function(result) {
				console.log(result.get('title'));
			});*/
			
			console.log(watsonResult[1]);


			/*for(key in watsonResult)
				console.log(watsonResult[key]);*/



		});

		return;

		/*MusicData.where('language').in(['en'])
			.then(function(results) {
				
				var watsonUndef = [82,114,146,382,383,429,430]

				var ind = -1;
				var finalInd = 7;

				console.log(finalInd + ' documents found.');

				var intRef = setInterval(function(){
					ind++;

					if(ind >= finalInd) {
						clearInterval(intRef);
						console.log('JOB DONE');
					} else {
						var result = results[watsonUndef[ind]];		

						console.log('Quering watson number ' + watsonUndef[ind]);

						proxylang.query(result.get('lyric'), csrf).then(function(data) {
							console.log(data);

							console.log('Saving data...')
							result.set('watsonResult', data);
							result.save(function(){
								console.log('saved!')
							});

						});	
					}
				}, 1000);

			});*/
			

	}, function(err) {
		console.log('Error while connecting');
		console.log(err);
	});