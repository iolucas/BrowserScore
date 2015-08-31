var betaChord1 = new ScoreBeta.Chord();
var betaChord2 = new ScoreBeta.Chord();
var betaChord3 = new ScoreBeta.Chord();
var betaChord4 = new ScoreBeta.Chord();

console.log(betaChord1.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'C' , octave: 4})));
console.log(betaChord1.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'E' , octave: 4})));
console.log(betaChord1.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'G' , octave: 4})));

console.log(betaChord2.AddNote(new ScoreBeta.Note({ denominator: 2 , note: 'A' , octave: 5})));
console.log(betaChord2.AddNote(new ScoreBeta.Note({ denominator: 2 , note: 'C' , octave: 5})));
console.log(betaChord2.AddNote(new ScoreBeta.Note({ denominator: 2 , note: 'F' , octave: 5})));

console.log(betaChord3.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'D' , octave: 4})));
console.log(betaChord3.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'F' , octave: 4})));
console.log(betaChord3.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'A' , octave: 4})));

console.log(betaChord4.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'D' , octave: 5})));
console.log(betaChord4.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'G' , octave: 5})));
console.log(betaChord4.AddNote(new ScoreBeta.Note({ denominator: 4 , note: 'B' , octave: 5})));


var betaMeasure1 = new ScoreBeta.Measure();
var betaMeasure2 = new ScoreBeta.Measure();

betaMeasure1.InsertChord(betaChord1);
betaMeasure1.InsertChord(betaChord2);

betaMeasure2.InsertChord(betaChord3);
betaMeasure2.InsertChord(betaChord4);

var betaScore = new ScoreBeta.Score(1200, 0 ,{ GClef: true, TimeSig44: true});

betaScore.InsertMeasure(betaMeasure1);
betaScore.InsertMeasure(betaMeasure2);

document.documentElement.appendChild(betaScore.Draw());
betaScore.MoveTo(120,110.5);

//betaMeasure.UpdateGaps(200);
betaScore.UpdateDimensions();



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