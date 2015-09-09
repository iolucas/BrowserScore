var alphaChord = new ScoreBeta.Chord({ denominator: 2 });

//document.documentElement.appendChild(alphaChord.Draw());
alphaChord.MoveTo(250,50);

//console.log(alphaChord.InsertNote({ note: 'G', octave: 4}));
//console.log(alphaChord.InsertNote({ note: 'A', octave: 5}));
//console.log(alphaChord.InsertNote({ note: 'D', octave: 0}));
//console.log(alphaChord.InsertNote({ note: 'C', octave: 0}));


var betaChord1 = new ScoreBeta.Chord({denominator: 2});
var betaChord2 = new ScoreBeta.Chord({denominator: 2});

var betaChord3 = new ScoreBeta.Chord({denominator: 4});
var betaChord4 = new ScoreBeta.Chord({denominator: 4});
var betaChord5 = new ScoreBeta.Chord({denominator: 4});
var betaChord6 = new ScoreBeta.Chord({denominator: 4});

var betaChord7 = new ScoreBeta.Chord({denominator: 1});

var betaChord8 = new ScoreBeta.Chord({denominator: 1});

console.log(betaChord1.AddNote({ note: 'B', octave: 4 , accident: "" }));
console.log(betaChord1.AddNote({ note: 'C', octave: 4 , accident: "" }));
console.log(betaChord1.AddNote({ note: 'G', octave: 4 , accident: "" }));

console.log(betaChord2.AddNote({ note: 'A' , octave: 5}));
console.log(betaChord2.AddNote({ note: 'C' , octave: 5}));
console.log(betaChord2.AddNote({ note: 'D' , octave: 5}));

console.log(betaChord3.AddNote({ note: 'C' , octave: 4}));
console.log(betaChord3.AddNote({ note: 'E' , octave: 4}));
console.log(betaChord3.AddNote({ note: 'F' , octave: 4}));

console.log(betaChord4.AddNote({ note: 'D' , octave: 4}));
console.log(betaChord4.AddNote({ note: 'F' , octave: 4}));
console.log(betaChord4.AddNote({ note: 'A' , octave: 4}));

console.log(betaChord5.AddNote({ note: 'E' , octave: 4}));
console.log(betaChord5.AddNote({ note: 'G' , octave: 4}));
console.log(betaChord5.AddNote({ note: 'B' , octave: 4}));

console.log(betaChord6.AddNote({ note: 'B' , octave: 4}));
console.log(betaChord6.AddNote({ note: 'G' , octave: 4}));
console.log(betaChord6.AddNote({ note: 'D' , octave: 4}));

console.log(betaChord7.AddNote({ note: 'C', octave: 4 }));
console.log(betaChord7.AddNote({ note: 'G', octave: 4 }));
console.log(betaChord7.AddNote({ note: 'E', octave: 4 }));

betaChord8.AddNote({ note: 'G', octave: 4});


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
	var chord = new ScoreBeta.Chord({ denominator: 4 }),
		randomNote = String.fromCharCode(65 + Math.round(Math.random() * 7)),
		randomOctave = Math.round(Math.random() * 2) + 4;
	chord.AddNote({ note: randomNote, octave: randomOctave });
	return chord;
}

function log(msg) { console.log(msg); }