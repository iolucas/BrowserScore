

function getNoteDen(type) {
    var currDenominator = null;

    switch(type) {
        case "whole":
            currDenominator = 1;
            break;

        case "half":
            currDenominator = 2;
            break;

        case "quarter":
            currDenominator = 4;
            break;

        case "eighth":
            currDenominator = 8;
            break;

        case "16th":
            currDenominator = 16;
            break;

        case "32nd":
            currDenominator = 32;
            break;

        case "64th":
            currDenominator = 64;
            break;

        case "128th":
            currDenominator = 128;
            break;

        default:
            if(type == undefined) {
                currDenominator = 1;
            } else {
                console.log("Denominator not implemented: ");
                console.log(type);
                //throw "Denominator not implemented: " + measures[i].note[j]; 
            }                                               
    }

    return currDenominator;
}

function getNoteObj(note) {
    var noteObj = {}    //note object to store note information
    
    //Get note denominator
    noteObj.denominator = getNoteDen(note.type);

    //Check if the note is not a rest
    if(note.pitch) {
        noteObj.note = note.pitch.step;
        noteObj.octave = parseInt(note.pitch.octave);
    } else if(note.rest) {
        //do nothing, that is fine
    } else {
        console.log("Error. Note don't have either a pitch or a rest object.");
        console.log(note);
    }

    if(note.accidental) {
        if(note.accidental == "flat-flat")
            noteObj.accident = "DOUBLE_FLAT";
        else
            noteObj.accident = note.accidental.toUpperCase();

        noteObj.accident = noteObj.accident.replace("-", "_");
    }

    //Check if it got a X coord
    if(note["@attributes"] && note["@attributes"]["default-x"])
        noteObj.xCoord = note["@attributes"]["default-x"];

    return noteObj;
}

function toComposinFormat(jsonObj) {

    //Create the new score object with the measures array
    var neoScore = { measures: [] }

    try {
        //Get the measure array from the file
        var fileMeasures = jsonObj.part.measure;
        //Ensure the measures object is an array 
        if(!(fileMeasures.length >= 0))
            fileMeasures = [fileMeasures];

        //iterate thru the fileMeasures array
        for(var i = 0; i < fileMeasures.length; i++) {
            //if the measure object got the attribute member
            if(fileMeasures[i].attributes) {
                //get and set the clef
                neoScore.clef = fileMeasures[i].attributes.clef.sign;

                //get and set the timesig
                neoScore.timeSig = fileMeasures[i].attributes.time['beats'] + fileMeasures[i].attributes.time['beat-type']; 
                neoScore.timeSig = parseInt(neoScore.timeSig); 
            }

            //FORGET FOR NOW
            //create fileChords array to handle the file pseudo chords
            //(since they are defined as having the same x coordinate on the score line)
            //------------------------

            //Get the notes for the current measure
            var fileMeasureNotes = fileMeasures[i].note;
            //Ensure the notes are whitin an array
            if(!(fileMeasureNotes.length >= 0))
                fileMeasureNotes = [fileMeasureNotes];

            //Array to set the notes chords within this measure
            var fileMeasureChords = [];

            //iterate thru the notes on the measure
            for(var j = 0; j < fileMeasureNotes.length; j++) {
                //Get note obj 
                var noteObj = getNoteObj(fileMeasureNotes[j]);

                //if we already got a chord and the just got obj has a xCoord
                if(fileMeasureChords.length > 0 && noteObj.xCoord) {
                    //get the last note object inserted
                    var lastChord = fileMeasureChords[fileMeasureChords.length - 1],
                        lastChordLength = lastChord.length,
                        lastNoteObj = lastChord[lastChordLength - 1];

                    //if the last note and the current got the same x, they are a chord
                    if(lastNoteObj.xCoord && lastNoteObj.xCoord == noteObj.xCoord)
                        lastChord.push(noteObj);//push the current note to the chord
                    else
                        //put a new chord object on file measures chords array
                        fileMeasureChords.push([noteObj]);  

                } else { //if none of them
                    //put a new chord object on file measures chords array
                    fileMeasureChords.push([noteObj]);  
                }
            }

            var neoMeasure = { chords: [] };
            //iterate thru the file measure chords
            for(var k = 0; k < fileMeasureChords.length; k++) {
                var neoChord = { notes: [] },
                    fileChord = fileMeasureChords[k];

                for(var l = 0; l < fileChord.length; l++) {
                    if(!neoChord.den)   //if the neochord den hasn't been set yet
                        neoChord.den = fileChord[l].denominator;    //set it
                        
                    if(fileChord[l].note) {   // if the file chord has a note (is not a rest)
                        var neoNote = { n: fileChord[l].note, o: fileChord[l].octave }
                        if(fileChord[l].accident)
                            neoNote.a = fileChord[l].accident;
                        //push the current note to the chord
                        neoChord.notes.push(neoNote);
                    }
                }

                //push the neo chord to the current neomeasure
                neoMeasure.chords.push(neoChord);   
            }

            //push the current neomeasure to the neoscore
            neoScore.measures.push(neoMeasure);
        }

        return neoScore;

    } catch(e) {
        console.log("Error while converting.");
        console.log(e);
    }
}