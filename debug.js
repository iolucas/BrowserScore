
var betaChord1 = { den: 2 }
var betaChord2 = { den: 2 }
var betaChord3 = { den: 4 }
var betaChord4 = { den: 4 }
var betaChord5 = { den: 4 }
var betaChord6 = { den: 4 }
var betaChord7 = { den: 1 }
var betaChord8 = { den: 1 }


function chord1Acc() {
	return getRandomAccident();
	//return "NATURAL";
}

betaChord1.notes = [
	{ n: 'A', o: 4, a: chord1Acc() },
	{ n: 'B', o: 4, a: chord1Acc() },
	{ n: 'C', o: 4, a: chord1Acc() },
	{ n: 'D', o: 4, a: chord1Acc() },
	{ n: 'E', o: 4, a: chord1Acc() },
	{ n: 'F', o: 4, a: chord1Acc() },
	{ n: 'G', o: 4, a: chord1Acc() },
	{ n: 'A', o: 5, a: chord1Acc() },
	{ n: 'B', o: 5, a: chord1Acc() },
	{ n: 'C', o: 5, a: chord1Acc() },
	{ n: 'D', o: 5, a: chord1Acc() },
	{ n: 'E', o: 5, a: chord1Acc() },
	{ n: 'F', o: 5, a: chord1Acc() },
	{ n: 'G', o: 5, a: chord1Acc() },
	{ n: 'A', o: 6, a: chord1Acc() },
	{ n: 'B', o: 6, a: chord1Acc() },
	{ n: 'C', o: 6, a: chord1Acc() },
	{ n: 'D', o: 6, a: chord1Acc() },
	{ n: 'E', o: 6, a: chord1Acc() },
	{ n: 'F', o: 6, a: chord1Acc() },
	{ n: 'G', o: 6, a: chord1Acc() }
];


betaChord2.notes = [
	{ n: 'A' , o: 6 },
	{ n: 'C' , o: 6 },
	{ n: 'D' , o: 6 }
];

betaChord3.notes = [
	{ n: 'A' , o: 4},
	{ n: 'A' , o: 5},
	{ n: 'C' , o: 5}
];

betaChord4.notes = [
	{ n: 'G' , o: 5},
	{ n: 'E' , o: 5},
	{ n: 'F' , o: 5}
];

betaChord5.notes = [
	{ n: 'G', o: 3, a: "" },
	{ n: 'G', o: 4, a: "" },
	{ n: 'B', o: 4, a: "" }
];

betaChord6.notes = [
	{ n: 'G', o: 6, a: "" },
	{ n: 'G', o: 4, a: "" },
	{ n: 'D', o: 4, a: "" }
];

betaChord7.notes = [
	{ n: 'C', o: 3, a: "" },
	{ n: 'D', o: 3, a: "" },
	{ n: 'E', o: 3, a: "" }];

betaChord8.notes = [
	/*{ n: 'C', o: 5, a: "" },
	{ n: 'D', o: 5, a: "" },
	{ n: 'E', o: 5, a: "" }*/
	{ n: 'B', o: 2, a: "SHARP" }
];

var betaMeasure1 = new Object();
var betaMeasure2 = new Object();
var betaMeasure3 = new Object();
var betaMeasure4 = new Object();

betaMeasure1.chords = [
	betaChord1,
	betaChord2
];

betaMeasure2.chords = [
	betaChord3, 
	betaChord4,
	betaChord5, 
	betaChord6
];

betaMeasure3.chords = [
	betaChord7
];

betaMeasure4.chords = [
	betaChord8
];

/*
var deltaChord = {
	den: 4,
	notes: [
		{ n: 'G', o: 5 , a: "FLAT"}
		//{ note: 'G', octave: 4, accident:  }
	]
}

var deltaMeasure = {
	chords: [deltaChord]
}*/


var deltaFile = {
	clef: 'G',
	timeSig: 44,
	measures: [
		getMeasure(),
		betaMeasure1,
		betaMeasure2,
		betaMeasure3,
		betaMeasure4
	]
}

/*
var deltaScore = ScoreLoader.Open(deltaFile);
document.documentElement.appendChild(deltaScore.Draw());
deltaScore.Organize(1500, 300);
deltaScore.MoveTo(10.5, 0.5);*/

document.documentElement.test123 = function() {
	//return deltaScore;
}

document.documentElement.showFile = function(jsonObj) {
	//return deltaScore;
}

document.documentElement.OpenFile = function(scoreFile) {
	//console.log(scoreFile);
	//console.log(deltaFile);


	var scoreObj = ScoreLoader.Open(scoreFile);
	document.documentElement.appendChild(scoreObj.Draw());
	scoreObj.Organize(1500, 300);
	scoreObj.MoveTo(15.5, 0.5);
}


/*
for(var oct = 0; oct < 10; oct++) {
	for(var not = 0; not < 7; not++) {
		var newChord = new ScoreBuilder.Chord({ denominator: 4 });
		newChord.AddNote({ note: String.fromCharCode(65 + not) , octave: oct });
		lucasMeasure.InsertChord(newChord);
	}
}*/

//GenerateRandomScore(alphaScore);


function GenerateRandomScore(score) {
	var numberOfMeasures = getInt(1, 1);

	for(var i = 0; i < numberOfMeasures; i++) {
		var numberOfChords = getInt(1, 8),
			measure = new ScoreBuilder.Measure();

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
	var measure = {
		chords: [
			getRandomChord(),
			getRandomChord()
		]
	}
	return measure;
}

function getRandomChord() {
	var numberOfNotes = getInt(10,20),
		randDen = Math.pow(2, getInt(0,6));
		chord = { den: randDen , notes: [] };

	for(var i = 0; i < numberOfNotes; i++) {
		var randomNote = String.fromCharCode(65 + getInt(0,6)),
			randomOctave = getInt(0,10);

		chord.notes.push({ n: randomNote, o: randomOctave, a: getRandomAccident() });
	}
	
	return chord;
}

function getRandomAccident() {
	//return "DOUBLE_FLAT";
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

function getDebugRect(width, height, x, y, parent) {
	var debRect = document.createElementNS(xmlns, "rect");
	debRect.setAttribute("width", width);
	debRect.setAttribute("height", height);
	debRect.setAttribute("x", x);
	debRect.setAttribute("y", y);
	debRect.setAttribute("fill", "none");
	debRect.setAttribute("stroke", "#333");
	debRect.setAttribute("stroke-width", 1);
	if(parent)
		parent.appendChild(debRect);
	else
		document.documentElement.appendChild(debRect);
	return debRect;
}

            function getRandomAccident() {
                //return "";
                var value = Math.round(Math.random() * 5),
                    acc = "";
                
                switch(value) {

                    case 1:
                        acc = "natural";
                        break;
                    
                    case 2:
                        acc = "sharp";
                        break;

                    case 3:
                        acc = "double-sharp";
                        break;

                    case 4:
                        acc = "flat";
                        break;

                    case 5:
                        acc = "flat-flat";
                        break;
                }

                return acc;
            }

                        //debug();

            function debug() {
                var chord = new ScoreBuilder.Chord({ denominator: 1 });
                chord.AddNote({n: 'G', o:3 });
                chord.Organize();
                svgContainer.appendChild(chord.Draw());
                chord.Draw().translate(100, 100);


            }

                        function getMeasureR() {
                var measureObj = new ScoreBuilder.Measure(),
                    measureData = getMeasure();

                var chords = measureData.chords ? measureData.chords : [];

                for(var j = 0; j < chords.length; j++) {
                    var chordObj = new ScoreBuilder.Chord(chords[j].den);
                    
                    var notes = chords[j].notes ? chords[j].notes : [];

                    for(var k = 0; k < notes.length; k++)
                        chordObj.AddNote(notes[k]);

                    measureObj.InsertChord(chordObj);
                }
                measureObj.SetEndBar("simple");
                //measureObj.SetEndBar("simple");

                return measureObj;                
            }

            function getChordR() {
                var chords = getRandomChord();

                var chordObj = new ScoreBuilder.Chord(chords.den);
                
                var notes = chords.notes ? chords.notes : [];

                for(var k = 0; k < notes.length; k++)
                    chordObj.AddNote(notes[k]);

                return chordObj;
            }

            function getInt(from, to) {
                return Math.round(Math.random()*(to-from) + from);
            }

            function getMeasure() {
                var measure = {
                    chords: [
                        getRandomChord(),
                        getRandomChord(),
                        //{ den: 1 , notes: [{n: 'B', o: 5, a: ""}] }
                    ]
                }
                return measure;
            }

            function getRandomChord() {
                var numberOfNotes = getInt(1,1),
                    randDen = Math.pow(2, getInt(0,6));
                    chord = { den: randDen , notes: [] };

                for(var i = 0; i < numberOfNotes; i++) {
                    var randomNote = String.fromCharCode(65 + getInt(0,6)),
                        randomOctave = getInt(3,6);

                    chord.notes.push({ n: randomNote, o: randomOctave, a: getRandomAccident() });
                }
                
                return chord;
            }

function log(msg) { console.log(msg); }