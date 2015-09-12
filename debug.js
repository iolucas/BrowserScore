
var betaChord1 = new ScoreBeta.Chord({ denominator: 2 });
var betaChord2 = new ScoreBeta.Chord({ denominator: 2 });
var betaChord3 = new ScoreBeta.Chord({ denominator: 4 });
var betaChord4 = new ScoreBeta.Chord({ denominator: 4 });
var betaChord5 = new ScoreBeta.Chord({ denominator: 4 });
var betaChord6 = new ScoreBeta.Chord({ denominator: 4 });
var betaChord7 = new ScoreBeta.Chord({ denominator: 1 });
var betaChord8 = new ScoreBeta.Chord({ denominator: 1 });


function chord1Acc() {
	//return getRandomAccident();
	return "NATURAL";
}

betaChord1.AddNoteCollection([
	{ note: 'A', octave: 4, accident: chord1Acc() },
	{ note: 'B', octave: 4, accident: chord1Acc() },
	{ note: 'C', octave: 4, accident: chord1Acc() },
	{ note: 'D', octave: 4, accident: chord1Acc() },
	{ note: 'E', octave: 4, accident: chord1Acc() },
	{ note: 'F', octave: 4, accident: chord1Acc() },
	{ note: 'G', octave: 4, accident: chord1Acc() },
	{ note: 'A', octave: 5, accident: chord1Acc() },
	{ note: 'B', octave: 5, accident: chord1Acc() },
	{ note: 'C', octave: 5, accident: chord1Acc() },
	{ note: 'D', octave: 5, accident: chord1Acc() },
	{ note: 'E', octave: 5, accident: chord1Acc() },
	{ note: 'F', octave: 5, accident: chord1Acc() },
	{ note: 'G', octave: 5, accident: chord1Acc() },
	{ note: 'A', octave: 6, accident: chord1Acc() },
	{ note: 'B', octave: 6, accident: chord1Acc() },
	{ note: 'C', octave: 6, accident: chord1Acc() },
	{ note: 'D', octave: 6, accident: chord1Acc() },
	{ note: 'E', octave: 6, accident: chord1Acc() },
	{ note: 'F', octave: 6, accident: chord1Acc() },
	{ note: 'G', octave: 6, accident: chord1Acc() }
]);


betaChord2.AddNoteCollection([
	{ note: 'A' , octave: 6 },
	{ note: 'C' , octave: 6 },
	{ note: 'D' , octave: 6 }
]);

betaChord3.AddNote({ note: 'G' , octave: 4});
betaChord3.AddNote({ note: 'A' , octave: 5});
betaChord3.AddNote({ note: 'C' , octave: 5});

betaChord4.AddNote({ note: 'G' , octave: 5});
betaChord4.AddNote({ note: 'E' , octave: 5});
betaChord4.AddNote({ note: 'F' , octave: 5});

betaChord5.AddNote({ note: 'G', octave: 3, accident: "" });
betaChord5.AddNote({ note: 'G', octave: 4, accident: "" });
betaChord5.AddNote({ note: 'B', octave: 4, accident: "" });

betaChord6.AddNote({ note: 'G', octave: 6, accident: "" });
betaChord6.AddNote({ note: 'G', octave: 4, accident: "" });
betaChord6.AddNote({ note: 'D', octave: 4, accident: "" });

betaChord7.AddNote({ note: 'C', octave: 3, accident: "" });
betaChord7.AddNote({ note: 'D', octave: 3, accident: "" });
betaChord7.AddNote({ note: 'E', octave: 3, accident: "" });

betaChord8.AddNote({ note: 'C', octave: 5, accident: "" });
betaChord8.AddNote({ note: 'D', octave: 5, accident: "" });
betaChord8.AddNote({ note: 'E', octave: 5, accident: "" });

var betaMeasure1 = new ScoreBeta.Measure();
var betaMeasure2 = new ScoreBeta.Measure();
var betaMeasure3 = new ScoreBeta.Measure();
var betaMeasure4 = new ScoreBeta.Measure();

betaMeasure1.AddChordCollection([
	betaChord1,
	betaChord2
]);

betaMeasure2.AddChordCollection([
	betaChord3, 
	betaChord4,
	betaChord5, 
	betaChord6
]);

betaMeasure3.InsertChord(betaChord7);

betaMeasure4.InsertChord(betaChord8);

var alphaScore = new ScoreBeta.Score();
document.documentElement.appendChild(alphaScore.Draw());
alphaScore.MoveTo(150, 50.5);


//alphaScore.InsertMeasure(betaMeasure1);
/*alphaScore.InsertMeasure(betaMeasure2);
alphaScore.InsertMeasure(betaMeasure3);
alphaScore.InsertMeasure(betaMeasure4);*/

/*
alphaScore.InsertMeasure(getMeasure());
alphaScore.InsertMeasure(getMeasure());
alphaScore.InsertMeasure(getMeasure());*/

var lucasDen = 32;

lucasChord2 = new ScoreBeta.Chord({ denominator: lucasDen });
lucasChord3 = new ScoreBeta.Chord({ denominator: lucasDen });
lucasChord4 = new ScoreBeta.Chord({ denominator: lucasDen });
lucasChord5 = new ScoreBeta.Chord({ denominator: lucasDen });
lucasChord6 = new ScoreBeta.Chord({ denominator: lucasDen });
lucasChord7 = new ScoreBeta.Chord({ denominator: lucasDen });
lucasChord8 = new ScoreBeta.Chord({ denominator: lucasDen });

lucasChord2.AddNote({ note: 'G', octave: 1, accident: getRandomAccident() });
lucasChord3.AddNote({ note: 'G', octave: 2, accident: getRandomAccident() });
lucasChord4.AddNote({ note: 'G', octave: 3, accident: getRandomAccident() });
lucasChord5.AddNote({ note: 'G', octave: 4, accident: getRandomAccident() });
lucasChord6.AddNote({ note: 'G', octave: 5, accident: getRandomAccident() });
lucasChord7.AddNote({ note: 'G', octave: 6, accident: getRandomAccident() });
lucasChord8.AddNote({ note: 'G', octave: 7, accident: getRandomAccident() });


lucasMeasure = new ScoreBeta.Measure();
lucasMeasure.AddChordCollection([

	lucasChord2,
	lucasChord3,
	lucasChord4,
	lucasChord5,
	lucasChord6,
	lucasChord7,
	lucasChord8


]);

//alphaScore.InsertMeasure(lucasMeasure);


GenerateRandomScore(alphaScore);


alphaScore.Organize();

function GenerateRandomScore(score) {
	var numberOfMeasures = getInt(1, 1);

	for(var i = 0; i < numberOfMeasures; i++) {
		var numberOfChords = getInt(1, 8),
			measure = new ScoreBeta.Measure();

		for(var j = 0; j < numberOfChords; j++) {
			measure.InsertChord(getRandomChord());
		}

		score.InsertMeasure(measure);
	}
}

function getInt(from, to) {
	return Math.round(Math.random()*(to-from) + from);
}


function getMeasure() {
	var measure = new ScoreBeta.Measure();
	measure.InsertChord(getRandomChord());
	measure.InsertChord(getRandomChord());
	measure.InsertChord(getRandomChord());
	measure.InsertChord(getRandomChord());
	return measure;
}

function getRandomChord() {
	var numberOfNotes = getInt(10,20),
		randDen = Math.pow(2, getInt(6,6));
		chord = new ScoreBeta.Chord({ denominator: randDen });

	for(var i = 0; i < numberOfNotes; i++) {
		var randomNote = String.fromCharCode(65 + Math.round(Math.random() * 7)),
			randomOctave = getInt(0,10);

		chord.AddNote({ note: randomNote, octave: randomOctave, accident: getRandomAccident() });
	}
	
	return chord;
}

function getRandomAccident() {
	var value = Math.round(Math.random() * 5),
		acc = "";
	
	switch(value) {

		case 1:
			acc = "NATURAL";
			break;
		
		case 2:
			acc = "SHARP";
			break;

		case 3:
			acc = "DOUBLE_SHARP";
			break;

		case 4:
			acc = "FLAT";
			break;

		case 5:
			acc = "DOUBLE_FLAT";
			break;
	}

	return acc;
}

function log(msg) { console.log(msg); }