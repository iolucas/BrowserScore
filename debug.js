var betaChord1 = new ScoreBeta.Chord({denominator: 2});
var betaChord2 = new ScoreBeta.Chord({denominator: 2});

var betaChord3 = new ScoreBeta.Chord({denominator: 4});
var betaChord4 = new ScoreBeta.Chord({denominator: 4});
var betaChord5 = new ScoreBeta.Chord({denominator: 4});
var betaChord6 = new ScoreBeta.Chord({denominator: 4});

var betaChord7 = new ScoreBeta.Chord({denominator: 4});


var note1 = new ScoreBeta.Note({ denominator: 2 , note: 'C' , octave: 4});

console.log(betaChord1.AddNote(note1));
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

//console.log(betaChord7.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'G' , octave: 4})));


var betaMeasure1 = new ScoreBeta.Measure();
var betaMeasure2 = new ScoreBeta.Measure();
var betaMeasure3 = new ScoreBeta.Measure();

betaMeasure1.InsertChord(betaChord1);
betaMeasure1.InsertChord(betaChord2);

betaMeasure2.InsertChord(betaChord3);
betaMeasure2.InsertChord(betaChord4);
betaMeasure2.InsertChord(betaChord5);
betaMeasure2.InsertChord(betaChord6);

betaMeasure3.InsertChord(betaChord7);


var alphaScore = new ScoreBeta.Score();

//var betaScore = new ScoreBeta.ScoreLine(1500, { GClef: true, TimeSig44: true});

alphaScore.InsertMeasure(betaMeasure1);
alphaScore.InsertMeasure(betaMeasure2);
alphaScore.InsertMeasure(betaMeasure3);

//betaScore.InsertMeasure(betaMeasure1);
//betaScore.InsertMeasure(betaMeasure2);
//betaScore.InsertMeasure(betaMeasure3);

document.documentElement.appendChild(alphaScore.Draw());
//document.documentElement.appendChild(betaScore.Draw());
alphaScore.MoveTo(150, 50.5);
//betaScore.MoveTo(150,50.5);

//betaMeasure.UpdateGaps(200);
//betaScore.UpdateDimensions();
//alphaScore.Organize();

var betaMeasure4 = new ScoreBeta.Measure();
betaMeasure4.InsertChord(new ScoreBeta.Chord({denominator: 1}));
alphaScore.InsertMeasure(betaMeasure4);



alphaScore.Organize();

alphaScore.Organize();

function log(msg) { console.log(msg); }