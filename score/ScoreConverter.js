

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

    noteObj.accident = note.accidental;

    //Check if it got a chord object
    noteObj.chord = note.chord;

    return noteObj;
}

function toComposinFormat(jsonObj) {

    //Create the new score object with the measures array
    var neoScore = { measures: [] }

    try {

        var fileParts = jsonObj.part;

        //Ensure the parts object is an array 
        if(!(fileParts.length >= 0))
            fileParts = [fileParts];

        //Get the measure array from the file
        var fileMeasures = fileParts[0].measure;
        //Ensure the measures object is an array 
        if(!(fileMeasures.length >= 0))
            fileMeasures = [fileMeasures];

        //Add all properties from the work field that are strings
        if(jsonObj.work)
            for(var member in jsonObj.work)
                if(typeof jsonObj.work[member] == "string")
                    neoScore[member] = jsonObj.work[member];

        //Add all properties from the identification field that are strings
        if(jsonObj.identification)
            for(var member in jsonObj.identification)
                if(typeof jsonObj.identification[member] == "string")
                    neoScore[member] = jsonObj.identification[member];

        //iterate thru the fileMeasures array
        for(var i = 0; i < fileMeasures.length; i++) {
            //if the measure object got the attribute member
            if(fileMeasures[i].attributes)
                neoScore.attributes = fileMeasures[i].attributes


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

                //if the chord array has been initiated and the note obj is a chord member
                if(fileMeasureChords.length > 0 && noteObj.chord)
                    fileMeasureChords[fileMeasureChords.length - 1].push(noteObj);  //push the note to the last chord
                else //if not
                    fileMeasureChords.push([noteObj]); //put a new chord object on file measures chords array 
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