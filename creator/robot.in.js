var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/composindb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// we're connected!
	console.log('conected');
	start();
});


function start() {

	var musicDataSchema = mongoose.Schema({
    	title: String
	});

	var MusicData = mongoose.model('MusicData', musicDataSchema);

	var silence = new MusicData({});

	silence.save(function(err, coll) {
		console.log(arguments);

	});

}