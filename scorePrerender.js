//Pre processment before renderer score

//Set missing coords to fill measure beats
//Remove overflowed beats @ a measure
//set chords note positions according to the clef

//implementar sistema para pegar cordenadas das notas antes
//impelmentar sistema para completar clef, key and time sigs for all measures que nao tem
//implementar sistema barras serem colocas fora das measures

//will not implement full new architecture due to time consumption, uncertains and probability to come to the same actual situation
//CHANGE THE CURRENT PROJECT, DONT CREATE NOTHING NEW


var ScorePrerender = function(mJson) {

	//Clone the mJson object to the pre rendered json object
	var prmJson = JSON.parse(JSON.stringify(mJson));
	
	//Iterate thru score parts
	for(var a = 0; a < prmJson.scoreParts.length; a++) {
		var scorePart = prmJson.scoreParts[a],
			currentClef = scorePart.measures[0].clef,	//var to keep the clef variable
			currentKeySig = scorePart.measures[0].keySig,	//var to keep the clef variable
			currentTimeSig = scorePart.measures[0].timeSig;	//var to keep the clef variable

		if(currentClef == undefined)
			throw "PRE_RENDER_ERROR__NO_CLEF_AT_THE_FIRST_MEASURE";

		if(currentKeySig == undefined)
			throw "PRE_RENDER_ERROR__NO_KEYSIG_AT_THE_FIRST_MEASURE";
		
		if(currentTimeSig == undefined)
			throw "PRE_RENDER_ERROR__NO_TIMESIG_AT_THE_FIRST_MEASURE";

		//Iterate thru the measures of the current score part
		for(var b = 0; b < scorePart.measures.length; b++) {
			var scoreMeasure = scorePart.measures[b],
				POS0_NOTE,
				POS0_OCTAVE;
			
			//If there is a clef @ this measure, set it
			if(scoreMeasure.clef != undefined)
				currentClef = scoreMeasure.clef;
			else //if not, set the score measure clef the previous clef
				scoreMeasure.clef = currentClef;

			//If there is a keysig @ this measure, set it
			if(scoreMeasure.keySig != undefined)
				currentKeySig = scoreMeasure.keySig;
			else //if not, set the score measure clef the previous clef
				scoreMeasure.keySig = currentKeySig;

			//If there is a timesig @ this measure, set it
			if(scoreMeasure.timeSig != undefined)
				currentTimeSig = scoreMeasure.timeSig;
			else //if not, set the score measure clef the previous clef
				scoreMeasure.timeSig = currentTimeSig;

			//Here we will update the clefs, key sigs and time sigs later
			//Ensure that beats match measure total beats

			//Set POS0_NOTE and POS0_OCTAVE according to the clef
	        switch(currentClef) {

	            case "G2":
	                POS0_NOTE = 'E'.charCodeAt(0);
	                POS0_OCTAVE = 5; 
	                break;

	            case "G2_OCT":
	                POS0_NOTE = 'E'.charCodeAt(0);
	                POS0_OCTAVE = 6; 
	                break;

	            case "F4":
	                POS0_NOTE = 'G'.charCodeAt(0);
	                POS0_OCTAVE = 3; 
	                break;

	            case "C3":
	                POS0_NOTE = 'F'.charCodeAt(0);
	                POS0_OCTAVE = 3; 
	                break;

	            case "C4":
	                throw "CLEF_TO_BE_IMPLEMENTED";
	                break;

	            default:
	                throw "INVALID_CHORD_CLEF_SET: " + clef;
	        }


			//Iterate thru the chords
			for(var c = 0; c < scoreMeasure.chords.length; c++) {
				var scoreChord = scoreMeasure.chords[c];

				//if there is no note
				if(scoreChord.notes == undefined)
					continue;

				//Iterate the notes @ the chord
				for(var d = 0; d < scoreChord.notes.length; d++) {
					var scoreNote = scoreChord.notes[d];
					        
					if(scoreNote.n.charCodeAt(0) < 65 || scoreNote.n.charCodeAt(0) > 71)
            			throw "INVALID_NOTE_LETTER";  

					//Get note coordinate

	                //get the element y coordinate based on its values for note and octave
	                var matchValue = 0;

	                //If the note is A or B, must add 1 to the octave to match the piano standard of notes and octaves
	                if(scoreNote.n == "A" || scoreNote.n == "B")
	                    matchValue = 1;

	                scoreNote.y = -((scoreNote.n.charCodeAt(0) - POS0_NOTE) + (scoreNote.o + matchValue - POS0_OCTAVE) * 7);
				}
			}
		}
	}

	console.log(prmJson);

	//Return the pre rendered music json
	return prmJson;
}