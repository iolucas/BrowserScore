var betaChord1 = new ScoreBeta.Chord({denominator: 2});
var betaChord2 = new ScoreBeta.Chord({denominator: 2});

var betaChord3 = new ScoreBeta.Chord({denominator: 4});
var betaChord4 = new ScoreBeta.Chord({denominator: 4});
var betaChord5 = new ScoreBeta.Chord({denominator: 4});
var betaChord6 = new ScoreBeta.Chord({denominator: 4});

var betaChord7 = new ScoreBeta.Chord({denominator: 1});


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

//console.log(betaChord5.AddNote(new ScoreBeta.Note({ denominator: 2 , note: 'G' , octave: 4})));
//console.log(betaChord6.AddNote(new ScoreBeta.Note({ denominator: 2 , note: 'D' , octave: 4})));

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
//betaMeasure3.InsertChord(betaChord6);

var betaScore = new ScoreBeta.ScoreLine(1500, { GClef: true, TimeSig44: true});

betaScore.InsertMeasure(betaMeasure1);
betaScore.InsertMeasure(betaMeasure2);
betaScore.InsertMeasure(betaMeasure3);

document.documentElement.appendChild(betaScore.Draw());
betaScore.MoveTo(150,50.5);

//betaMeasure.UpdateGaps(200);
betaScore.UpdateDimensions();




var alphaScore = new ScoreBeta.Score();

document.documentElement.appendChild(alphaScore.Draw());
alphaScore.MoveTo(150, 250.5);



//------------------- OLD BETA -------------------

var score1 = ScoreBuilder.CreateLine(1500, { GClef: true, TimeSig44: true});   //create a scoreline with 890 length
//document.documentElement.appendChild(score1.Build());

score1.MoveTo(10.5, 10.5);

score1.InsertMeasure();
score1.InsertMeasure();
score1.InsertMeasure();

score1.UpdateSpaces();

var score2 = ScoreBuilder.CreateLine(1500, { GClef: true, TimeSig44: false});   //create a scoreline with 890 length
//document.documentElement.appendChild(score2.Build());

score2.MoveTo(10.5, score1.GetHeight() + 21.5);

score2.InsertMeasure();
score2.InsertMeasure();
score2.InsertMeasure();
score2.InsertMeasure();

score2.UpdateSpaces();



function log(msg) { console.log(msg); }