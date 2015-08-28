var betaNote = new ScoreBeta.Note({ denominator: 2 , note: 'C' , octave: 5});
var betaNote1 = new ScoreBeta.Note({ denominator: 2 , note: 'G' , octave: 4});
var betaNote2 = new ScoreBeta.Note({ denominator: 2 , note: 'G' , octave: 5});
var betaChord = new ScoreBeta.Chord();
//betaChord.AddNote(betaNote);
console.log(betaChord.AddNote(betaNote1));
//console.log(betaChord.AddNote(betaNote2));

betaChord.Draw().setAttribute("transform", "translate(100 110)");

document.documentElement.appendChild(betaChord.Draw());
//document.documentElement.appendChild(betaNote.Draw());
//betaNote.MoveTo(120, 130);
//betaChord.MoveTo(0, 0);
var lines = DrawScoreLines(1500);
SetTransform(lines, {translate: [10.5, 110.5]}); 
document.documentElement.appendChild(lines);



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