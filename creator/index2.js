var AlchemyLanguage = require('./AlchemyLanguage.js');
var AlchemyVision = require('./AlchemyVision.js');
var fs = require('fs');

var textContent = 'Vai minha tristeza E diz a ela que sem ela não pode ser Diz-lhe numa prece Que ela regresse Porque eu não posso mais sofrer Chega de saudade A realidade é que sem ela não há paz Não há beleza É só tristeza e a melancolia Que não sai de mim, não sai de mim, não sai Mas se ela voltar, se ela voltar Que coisa linda, que coisa louca Pois há menos peixinhos a nadar no mar Do que os beijinhos que eu darei Na sua boca Dentro dos meus braçosOs abraços hão de ser milhões de abraçosApertado assim, colado assim, calado assim Abraços e beijinhos, e carinhos sem ter fim Que é pra acabar com esse negócio de você viver sem mim Não há paz Não há beleza É só tristeza e a melancolia Que não sai de mim, não sai de mim, não sai Dentro dos meus braços Os abraços hão de ser milhões de abraços Apertado assim, colado assim, calado assim Abraços e beijinhos, e carinhos sem ter fim Que é pra acabar com esse negócio de você viver sem mim Não quero mais esse negócio de você longe de mim Vamos deixar desse negócio de você viver sem mim';




/*AlchemyLanguage.query(textContent)
	.then(function(metaData) {
		//console.log(metaData);
		writeToFile(metaData)
	}, function(err) {
		console.log(err);
	});*/

//console.log("Querying image...");

AlchemyVision.queryUrl('http://media.salon.com/2014/11/family_in_white.jpg')
	.then(function(metaData) {
		//console.log(metaData);
		console.log("Done, creating file...");
		fs.writeFile('log.html',"<script>var result = " + metaData + ";console.log(result);</script>", function() {
			console.log("File created.");
		})
	}, function(err) {
		console.log(err);
	});


function writeToFile(metaData) {
	fs.writeFile('log.html',"<p>" + metaData + "</p>", function() {
		console.log("File created.");
	});
}