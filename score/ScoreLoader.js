xmlns = "http://www.w3.org/2000/svg";
xlink = "http://www.w3.org/1999/xlink";  


var ScoreLoader = new function() {
	this.Open = function(musicFile) {

		//create new score svg object
		var scoreObj = new ScoreBuilder.Score({ clef: musicFile.clef, timeSig: musicFile.timeSig });

		//iterate thru the measures of the music file
		var measures = musicFile.measures ? musicFile.measures : [];

		for(var i = 0; i < measures.length; i++) {
			var measureObj = new ScoreBuilder.Measure();

			var chords = measures[i].chords ? measures[i].chords : [];

			for(var j = 0; j < chords.length; j++) {
				var chordObj = new ScoreBuilder.Chord({ denominator: chords[j].den });
				
				var notes = chords[j].notes ? chords[j].notes : [];

				for(var k = 0; k < notes.length; k++)
					chordObj.AddNote(notes[k]);

				measureObj.InsertChord(chordObj);
			}

			scoreObj.InsertMeasure(measureObj);
		}

		return scoreObj;
	}
}