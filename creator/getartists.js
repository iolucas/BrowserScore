var https = require('https');
var cheerio = require('cheerio');
var fs = require('fs');

var artistPages = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
	'1'
];

check artist page more metadata to collect

var artIndex = 0;

fs.open('artistLinks.txt', 'w', function(err, fd) {

	getNextLetter(fd);


});

function getNextLetter(fd) {

	if(artIndex >= artistPages.length) {
		console.log('JOB DONE');
		return;
	}

	https.get("https://www.letras.mus.br/letra/" + artistPages[artIndex++] + "/", function(res) {

		var allData = "";

		res.on('data', function(recData) {
			if(recData)
				allData += recData.toString();
		});

		res.on('end', function() {

			$ = cheerio.load(allData);

			var pageArtists = "";

			$('a').each(function() {
				var linkHref = $(this).attr('href');
				
				console.log(linkHref);

				if(linkHref.charAt(0) == '/')
					pageArtists += linkHref + "\r\n";			

			});

			fs.write(fd, pageArtists, function(err) {
				if(err) {
					console.log('ERROR');
					console.log(err);
					return;
				}

				console.log('WRITED');
				getNextLetter(fd);	
			});
		})

		res.resume();
	});

}








