var betaChord1 = new ScoreBeta.Chord({denominator: 2});
var betaChord2 = new ScoreBeta.Chord({denominator: 2});

var betaChord3 = new ScoreBeta.Chord({denominator: 4});
var betaChord4 = new ScoreBeta.Chord({denominator: 4});
var betaChord5 = new ScoreBeta.Chord({denominator: 4});
var betaChord6 = new ScoreBeta.Chord({denominator: 4});

var betaChord7 = new ScoreBeta.Chord({denominator: 1});

var betaChord8 = new ScoreBeta.Chord({denominator: 1});

console.log(betaChord1.AddNote(new ScoreBeta.Note({ denominator: 2 , note: 'C' , octave: 4})));
console.log(betaChord1.AddNote(new ScoreBeta.Note({ denominator: 2 , note: 'E' , octave: 4})));
console.log(betaChord1.AddNote(new ScoreBeta.Note({ denominator: 2 , note: 'G' , octave: 4})));

console.log(betaChord2.AddNote(new ScoreBeta.Note({ denominator: 2 , note: 'A' , octave: 5})));
console.log(betaChord2.AddNote(new ScoreBeta.Note({ denominator: 2 , note: 'C' , octave: 5})));
console.log(betaChord2.AddNote(new ScoreBeta.Note({ denominator: 2 , note: 'F' , octave: 5})));

console.log(betaChord3.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'C' , octave: 4})));
console.log(betaChord3.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'E' , octave: 4})));
console.log(betaChord3.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'G' , octave: 4})));

console.log(betaChord4.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'D' , octave: 4})));
console.log(betaChord4.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'F' , octave: 4})));
console.log(betaChord4.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'A' , octave: 4})));

console.log(betaChord5.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'E' , octave: 4})));
console.log(betaChord5.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'G' , octave: 4})));
console.log(betaChord5.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'B' , octave: 4})));

console.log(betaChord6.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'B' , octave: 4})));
console.log(betaChord6.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'G' , octave: 4})));
console.log(betaChord6.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'D' , octave: 4})));

console.log(betaChord7.AddNote(new ScoreBeta.Note({ denominator: 1, note: 'C', octave: 4 })));
console.log(betaChord7.AddNote(new ScoreBeta.Note({ denominator: 1, note: 'G', octave: 4 })));
console.log(betaChord7.AddNote(new ScoreBeta.Note({ denominator: 1, note: 'E', octave: 4 })));

betaChord8.AddNote(new ScoreBeta.Note( { note: 'G', denominator: 1, octave: 4}));


var betaMeasure1 = new ScoreBeta.Measure();
var betaMeasure2 = new ScoreBeta.Measure();
var betaMeasure3 = new ScoreBeta.Measure();
var betaMeasure4 = new ScoreBeta.Measure();

betaMeasure1.InsertChord(betaChord1);
betaMeasure1.InsertChord(betaChord2);

betaMeasure2.InsertChord(betaChord3);
betaMeasure2.InsertChord(betaChord4);
betaMeasure2.InsertChord(betaChord5);
betaMeasure2.InsertChord(betaChord6);

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
alphaScore.InsertMeasure(getMeasure());
alphaScore.InsertMeasure(getMeasure());

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
	var chord = new ScoreBeta.Chord({denominator: 4}),
		randomNote = String.fromCharCode(65 + Math.round(Math.random() * 7)),
		randomOctave = Math.round(Math.random() * 2) + 4;
	chord.AddNote(new ScoreBeta.Note({ denominator: 4, note: randomNote, octave: randomOctave }));
	return chord;
}

function log(msg) { console.log(msg); }