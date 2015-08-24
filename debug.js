var score1 = ScoreBuilder.CreateLine(1500, { GClef: true, TimeSig44: true});   //create a scoreline with 890 length
document.documentElement.appendChild(score1.Build());

score1.MoveTo(10.5, 10.5);

score1.InsertMeasure();
score1.InsertMeasure();
score1.InsertMeasure();

score1.UpdateSpaces();

var score2 = ScoreBuilder.CreateLine(1500, { GClef: true, TimeSig44: false});   //create a scoreline with 890 length
document.documentElement.appendChild(score2.Build());

score2.MoveTo(10.5, score1.GetHeight() + 21.5);

score2.InsertMeasure();
score2.InsertMeasure();
score2.InsertMeasure();
score2.InsertMeasure();

score2.UpdateSpaces();



function log(msg) { console.log(msg); }