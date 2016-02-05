var httpRequest = require('./apis/httpRequest.js');
var cheerio = require('cheerio');
var fs = require('fs');

httpRequest.get('https://www.letras.mus.br/mais-acessadas/', true)
	.then(function(data) {
		
		$ = cheerio.load(data);

		var pageLinks = "module.exports = [";

		$('.top-list_mus').find('a').each(function() {
			var linkHref = $(this).attr('href');

			pageLinks += "'" + linkHref + "',";

			//console.log(linkHref);
			//counting++;
			
			/*console.log(linkHref);

			if(linkHref.charAt(0) == '/')
				pageArtists += linkHref + "\r\n";*/			

		});

		pageLinks += "]"; 

		fs.writeFile('topSongs.js', pageLinks, function(err) {
			if(err) {
				console.log('ERROR');
				console.log(err);
				return;
			}

			console.log('WRITED');
		});


	}, function(err) {
		console.log(err);
	});