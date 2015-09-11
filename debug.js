
var betaChord1 = new ScoreBeta.Chord({ denominator: 2 });
var betaChord2 = new ScoreBeta.Chord({ denominator: 2 });
var betaChord3 = new ScoreBeta.Chord({ denominator: 4 });
var betaChord4 = new ScoreBeta.Chord({ denominator: 4 });
var betaChord5 = new ScoreBeta.Chord({ denominator: 4 });
var betaChord6 = new ScoreBeta.Chord({ denominator: 4 });
var betaChord7 = new ScoreBeta.Chord({ denominator: 1 });
var betaChord8 = new ScoreBeta.Chord({ denominator: 1 });

/*betaChord1.AddNote({ note: 'E', octave: 3, accident: "" });
betaChord1.AddNote({ note: 'F', octave: 3, accident: "" });
betaChord1.AddNote({ note: 'G', octave: 3, accident: "" });*/
betaChord1.AddNoteCollection([
	{ note: 'A', octave: 4, accident: "" },
	{ note: 'B', octave: 4, accident: "" },
	{ note: 'C', octave: 4, accident: "" },
	{ note: 'D', octave: 4, accident: "" },
	{ note: 'E', octave: 4, accident: "" },
	{ note: 'F', octave: 4, accident: "" },
	{ note: 'G', octave: 4, accident: "" },
	{ note: 'A', octave: 5, accident: "" },
	{ note: 'B', octave: 5, accident: "" },
	{ note: 'C', octave: 5, accident: "" },
	{ note: 'D', octave: 5, accident: "" },
	{ note: 'E', octave: 5, accident: "" },
	{ note: 'F', octave: 5, accident: "" },
	{ note: 'G', octave: 5, accident: "" },
	{ note: 'A', octave: 6, accident: "" },
	{ note: 'B', octave: 6, accident: "" },
	{ note: 'C', octave: 6, accident: "" },
	{ note: 'D', octave: 6, accident: "" },
	{ note: 'E', octave: 6, accident: "" },
	{ note: 'F', octave: 6, accident: "" },
	{ note: 'G', octave: 6, accident: "" }
]);


betaChord2.AddNote({ note: 'A' , octave: 6 });
betaChord2.AddNote({ note: 'C' , octave: 6 });
betaChord2.AddNote({ note: 'D' , octave: 6 });

betaChord3.AddNote({ note: 'G' , octave: 4});
/*betaChord3.AddNote({ note: 'G' , octave: 4});
betaChord3.AddNote({ note: 'A' , octave: 5});
betaChord3.AddNote({ note: 'C' , octave: 5});*/

betaChord4.AddNote({ note: 'G' , octave: 5});
/*betaChord4.AddNote({ note: 'E' , octave: 5});
betaChord4.AddNote({ note: 'F' , octave: 5});
betaChord4.AddNote({ note: 'G' , octave: 5});*/

betaChord5.AddNote({ note: 'G', octave: 3, accident: "" });
/*betaChord5.AddNote({ note: 'G', octave: 4, accident: "" });
betaChord5.AddNote({ note: 'B', octave: 4, accident: "" });*/

betaChord6.AddNote({ note: 'G', octave: 6, accident: "" });
/*betaChord6.AddNote({ note: 'G', octave: 4, accident: "" });
betaChord6.AddNote({ note: 'D', octave: 4, accident: "" });*/

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

alphaScore.InsertMeasure(betaMeasure1);
alphaScore.InsertMeasure(betaMeasure2);
alphaScore.InsertMeasure(betaMeasure3);
alphaScore.InsertMeasure(betaMeasure4);

alphaScore.InsertMeasure(getMeasure());
alphaScore.InsertMeasure(getMeasure());
alphaScore.InsertMeasure(getMeasure());

var lucasDen = 64

lucasChord2 = new ScoreBeta.Chord({ denominator: lucasDen });
lucasChord3 = new ScoreBeta.Chord({ denominator: lucasDen });
lucasChord4 = new ScoreBeta.Chord({ denominator: lucasDen });
lucasChord5 = new ScoreBeta.Chord({ denominator: lucasDen });
lucasChord6 = new ScoreBeta.Chord({ denominator: lucasDen });
lucasChord7 = new ScoreBeta.Chord({ denominator: lucasDen });
lucasChord8 = new ScoreBeta.Chord({ denominator: lucasDen });

lucasChord2.AddNote({ note: 'G', octave: 1 });
lucasChord3.AddNote({ note: 'G', octave: 2 });
lucasChord4.AddNote({ note: 'G', octave: 3 });
lucasChord5.AddNote({ note: 'G', octave: 4 });
lucasChord6.AddNote({ note: 'G', octave: 5 });
lucasChord7.AddNote({ note: 'G', octave: 6 });
lucasChord8.AddNote({ note: 'G', octave: 7 });


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

alphaScore.InsertMeasure(lucasMeasure);

alphaScore.Organize();



function getMeasure() {
	var measure = new ScoreBeta.Measure();
	measure.InsertChord(getRandomChord());
	measure.InsertChord(getRandomChord());
	measure.InsertChord(getRandomChord());
	measure.InsertChord(getRandomChord());
	return measure;
}

function getRandomChord() {
	var chord = new ScoreBeta.Chord({ denominator: 4}),
		randomNote = String.fromCharCode(65 + Math.round(Math.random() * 7)),
		randomOctave = Math.round(Math.random() * 2) + 4;
	chord.AddNote({ note: randomNote, octave: randomOctave });
	return chord;
}

function log(msg) { console.log(msg); }