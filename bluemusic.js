//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
///////////////// 		BLUE MUSIC JS		//////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////


var BlueMusic = new function() {
    var self = this;

    this.GetScore = new function() {

        var getScore = this;

        this.FromMusicXML = function(musicXMLData) {
            var musicXMLObject = null;

            if(typeof musicXMLData == "string")
                musicXMLObject = parseXml(musicXMLData);
            else
                musicXMLObject = musicXMLData;     
            
            return getScore.FromMJSON(convertMusicXmlToMJson(musicXMLObject));   
        }

        this.FromMJSON = function(mJson) {
            //console.log(mJson);
            return getScoreFromMJSON(mJson);
        }
    }


    //PRIVATE MEMBERS

    function convertMusicXmlToMJson(musicXMLObject) {

        var mJsonString = xml2json(musicXMLObject);
            mJsonObject = JSON.parse(mJsonString.replace("undefined", "")); //replace the undefined string that is appearing

                console.log(mJsonObject); 

        if(mJsonObject["score-partwise"])
            return getMJson(mJsonObject["score-partwise"]);

        return new Object();
    }

    function getMJson(scorePartwise) {
        var newMJson = { scoreParts: [] };

        if(scorePartwise["movement-title"])
            newMJson.title = scorePartwise["movement-title"];    

        if(scorePartwise["work"] && scorePartwise["work"]["work-title"]) {
            if(newMJson.title)
                newMJson.subtitle = scorePartwise["work"]["work-title"];
            else
                newMJson.title = scorePartwise["work"]["work-title"];
        }

        if(scorePartwise.identification) {

            if(scorePartwise.identification.creator) {
                var creators;

                if(scorePartwise.identification.creator.length == undefined)
                    creators = [scorePartwise.identification.creator];
                else
                    creators = scorePartwise.identification.creator;

                for(var i = 0; i < creators.length; i++) {
                    var currCreator = creators[i];

                    if(currCreator["@type"] != undefined && currCreator["#text"] != undefined)
                        newMJson[currCreator["@type"]] = currCreator["#text"]; 
                }
            }

        }

        if(scorePartwise.part) {
            var parts = scorePartwise.part.length == undefined ? [scorePartwise.part] : scorePartwise.part;

            for(var partInd = 0; partInd < parts.length; partInd++) {
                var newPart = { measures: [] }

                newMJson.scoreParts.push(newPart);

                var fileMeasures = parts[partInd].measure.length == undefined ? [parts[partInd].measure] : parts[partInd].measure;
                //iterate thru the fileMeasures array
                for(var i = 0; i < fileMeasures.length; i++) {
                    var currMeasure = fileMeasures[i];  
                    
                    var newMeasure = { chords: [] }

                    newPart.measures.push(newMeasure);  

                    //if the measure object got the attribute member
                    if(currMeasure.attributes) {
                        var measureAttr = currMeasure.attributes.length == undefined ? currMeasure.attributes : currMeasure.attributes[0];

                        if(measureAttr.clef && measureAttr.clef.line && measureAttr.clef.sign) {
                            newMeasure.clef = measureAttr.clef.sign + measureAttr.clef.line;     
                        }

                        if(measureAttr.key && measureAttr.key.fifths)
                            newMeasure.keySig = parseInt(measureAttr.key.fifths);
                            
                        if(measureAttr["time"]) {
                            var beats = measureAttr["time"]["beats"],
                                beatType = measureAttr["time"]["beat-type"],
                                beatSymbol = measureAttr["time"]["@symbol"];

                            if(beatSymbol)
                                newMeasure.timeSig = beatSymbol;
                            else if(beats && beatType)
                                newMeasure.timeSig = beats + "," + beatType; 
                        }  
                    }  
                    //DEBUG PURPOSES
                    //if(newMeasure.clef && (newMeasure.clef == "TAB6" || newMeasure.clef == "percussion"))
                        //newMeasure.clef = "G2"; 
                    
                    if(newMeasure.clef && newMeasure.clef.indexOf("G") != -1)
                        newMeasure.clef = "G2";  


                    if(currMeasure["direction"] && 
                        currMeasure["direction"]["direction-type"] && 
                        currMeasure["direction"]["direction-type"]["metronome"] &&
                        currMeasure["direction"]["direction-type"]["metronome"]["beat-unit"] &&
                        currMeasure["direction"]["direction-type"]["metronome"]["per-minute"]) {

                        var tempoDenString = currMeasure["direction"]["direction-type"]["metronome"]["beat-unit"],
                            tempoValue = currMeasure["direction"]["direction-type"]["metronome"]["per-minute"],
                            tempoDen;

                        switch(tempoDenString) {
                            case "eighth":
                                tempoDen = 8;
                                break;

                            case "quarter":
                                tempoDen = 4;
                                break;

                            case "half":
                                tempoDen = 2;
                                break;

                            default:
                                throw "NOT_IMPLEMENTED_TEMPO_ATTRIBUTES: " + tempoDenString;
                        }


                        newMJson.tempo = [tempoDen, tempoValue];
                    }    


                    //If the measure object got any bar
                    if(currMeasure.barline) {
                        var barLines = currMeasure.barline.length == undefined ? [currMeasure.barline] : currMeasure.barline;
                        for(var j = 0; j < barLines.length; j++) {
                            var currBarLine = barLines[j];
                            //If the bar don't have either location or style, proceed next bar
                            if(!currBarLine["@location"] || !currBarLine["bar-style"])
                                continue;

                            var barName = "";

                            //Check if there is a repeat
                            if(currBarLine["repeat"] && currBarLine["repeat"]["@direction"]) {
                                if(currBarLine["repeat"]["@direction"] == "forward")
                                    barName = "repeat_f";
                                else if(currBarLine["repeat"]["@direction"] == "backward")
                                    barName = "repeat_b";
                            }

                            //If the bar name hasn't been set yet
                            if(barName == "") {
                                //check other data
                                switch(currBarLine["bar-style"]) {
                                    case "light": 
                                        //if light, means simple, already placed
                                        break;

                                    case "light-light": 
                                        barName = "double";
                                        break;

                                    case "light-heavy":
                                        barName = "end";    
                                        break;

                                    case "heavy-light":
                                        //if heavy light, only plausible is the repeat f, that is not catch here
                                        break; 

                                    case "heavy":
                                        //A just "heavy" bar means nothing. Cased here cause it appears some times
                                        break;   

                                    default:
                                        throw "NOT_IMPLEMENTED_BAR_TO_CONVERT: " + currBarLine["bar-style"];
                                }
                            }

                            if(currBarLine["@location"] == "left" && newMeasure.startBar == undefined)    
                                newMeasure.startBar = barName;   //start bar     

                            else if(currBarLine["@location"] == "right" && newMeasure.endBar == undefined)
                                newMeasure.endBar = barName;   //end bar
                        }  
                    }   //---End bar check

                    //If the end bar hasn't been set, set the standard
                    if(newMeasure.endBar == undefined)
                        newMeasure.endBar = "simple";    

                    
                    var fileMeasureNotes;

                    //Get the notes for the current measure
                    //Ensure the notes are whitin an array
                    if(fileMeasures[i].note != undefined) 
                        fileMeasureNotes = fileMeasures[i].note.length == undefined ? [fileMeasures[i].note] : fileMeasures[i].note;
                    else
                        fileMeasureNotes = [];

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
                            if(neoChord.denominator == undefined)   //if the neochord den hasn't been set yet
                                neoChord.denominator = fileChord[l].denominator;    //set it

                            //if the dotted hasn't been set and some not got a dot, set it to the chord
                            if(neoChord.dotted == undefined && fileChord[l].dot) {
                                neoChord.dotted = 1;    //set it
                            }
                                
                            if(fileChord[l].note) {   // if the file chord has a note (is not a rest)
                                var neoNote = { n: fileChord[l].note, o: fileChord[l].octave }
                                if(fileChord[l].accident)
                                    neoNote.a = fileChord[l].accident;
                                //push the current note to the chord
                                neoChord.notes.push(neoNote);
                            }
                        }

                        //push the neo chord to the current neomeasure
                        newMeasure.chords.push(neoChord);   
                    }
                }
                /*for(var j = 0; j < measures.length; j++) {
                    var newMeasure = { chords: [] },
                        chordsRef = newMeasure.chords,
                        currMeasure = measures[j],
                        notes;

                    newPart.measures.push(newMeasure);
                    
                    if(currMeasure.attributes) {
                        if(currMeasure.attributes.clef && currMeasure.attributes.clef.line && currMeasure.attributes.clef.sign) {
                            newMeasure.clef = currMeasure.attributes.clef.sign + currMeasure.attributes.clef.line;     
                        }

                        if(currMeasure.attributes.key && currMeasure.attributes.key.fifths)
                            newMeasure.keySig = parseInt(currMeasure.attributes.key.fifths);
                            
                        if(currMeasure.attributes["time"]) {
                            var beats = currMeasure.attributes["time"]["beats"],
                                beatType = currMeasure.attributes["time"]["beat-type"];

                            if(beats && beatType)
                                newMeasure.timeSig = beats + "," + beatType; 
                        }    
                    }

                    var notes = currMeasure.note.length == undefined ? [currMeasure.note] : currMeasure.note;

                    //iterate thru the notes on the measure
                    for(var k = 0; k < notes.length; k++) {
                        //Get note obj 
                        var noteObj = getNoteObj(notes[k]);

                        //if the chord array has been initiated and the note obj is a chord member
                        if(chordsRef.length > 0 && noteObj.chord)
                            chordsRef[chordsRef.length - 1].push(noteObj);  //push the note to the last chord
                        else //if not
                            chordsRef.push([noteObj]); //put a new chord object on file measures chords array 
                    }

                    //iterate thru the file measure chords
                    for(var k = 0; k < chordsRef.length; k++) {
                        var neoChord = { notes: [] },
                            fileChord = chordsRef[k];

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

                }*/

            }
        }

        //console.log(scorePartwise);
        //console.log(newMJson);
        return newMJson;
    }

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
    if(note.hasOwnProperty("pitch")) {
        noteObj.note = note.pitch.step;
        noteObj.octave = parseInt(note.pitch.octave);
    } else if(note.hasOwnProperty("rest")) {
        //do nothing, that is fine
    } else {
        console.log("Error. Note don't have either a pitch or a rest object.");
        console.log(note);
    }

    noteObj.accident = note.accidental;

    //Check if it got a chord object
    if(note.hasOwnProperty("chord"))
        noteObj.chord = true;

    //Check if it got a dot object
    if(note.hasOwnProperty("dot"))
        noteObj.dot = true;

    return noteObj;
}



    function getScoreFromMJSON(mJson) {

        //Create the new score
        var newScore = new ScoreBuilder.Score();

        if(mJson.title)
            newScore.SetTitle(mJson.title);
        else
            newScore.SetTitle("Untitled");

        if(mJson.subtitle)
            newScore.SetSubtitle(mJson.subtitle);
        
        if(mJson.composer)
            newScore.SetComposer(mJson.composer);

        if(mJson.lyricist)
            newScore.SetLyricist(mJson.lyricist);

        if(mJson.tempo && mJson.tempo.length > 1) {
            if(mJson.tempo.length == 3)
                newScore.SetTempo(mJson.tempo[0], mJson.tempo[1], mJson.tempo[2]);
            else
                newScore.SetTempo(mJson.tempo[0], 0, mJson.tempo[1]);
        }

        if(mJson.scoreParts && mJson.scoreParts.length > 0)
            newScore.SetScoreGroup(getScoreGroup(mJson.scoreParts));

        return newScore;
    }

    function getScoreGroup(scoreParts) {


        var newScoreGroup = new ScoreBuilder.ScoreGroup();
        if(scoreParts && scoreParts.length > 0) {
            for(var i = 0; i < scoreParts.length; i++) {
                newScoreGroup.InsertPart(getScorePart(scoreParts[i]));    
            }
        }

        return newScoreGroup;
    }

    function getScorePart(scorePart) {
        var newScorePart = new ScoreBuilder.ScorePart();
        if(scorePart && scorePart.measures && scorePart.measures.length > 0) {
            for(var i = 0; i < scorePart.measures.length; i++) {
                newScorePart.InsertMeasure(getScoreMeasure(scorePart.measures[i]));    
            }
        }

        return newScorePart;
    }

    function getScoreMeasure(scoreMeasure) {
        var newScoreMeasure = new ScoreBuilder.Measure();

        if(scoreMeasure == undefined)
            return newScoreMeasure;

        if(scoreMeasure.clef)
            newScoreMeasure.SetClef(scoreMeasure.clef);
            
        if(scoreMeasure.keySig)
            newScoreMeasure.SetKeySig(scoreMeasure.keySig);

        if(scoreMeasure.timeSig)
            newScoreMeasure.SetTimeSig(scoreMeasure.timeSig); 

        if(scoreMeasure.startBar)
            newScoreMeasure.SetStartBar(scoreMeasure.startBar);

        if(scoreMeasure.endBar)
            newScoreMeasure.SetEndBar(scoreMeasure.endBar);

        if(scoreMeasure.chords && scoreMeasure.chords.length > 0) {
            for(var i = 0; i < scoreMeasure.chords.length; i++) {
                newScoreMeasure.InsertChord(getScoreChord(scoreMeasure.chords[i]));    
            }
        }  

        return newScoreMeasure;                 
    }

    function getScoreChord(scoreChord) {

        var newScoreChord = new ScoreBuilder.Chord(scoreChord.denominator, scoreChord.dotted);

        if(scoreChord.notes && scoreChord.notes.length > 0) {
            newScoreChord.AddNoteCollection(scoreChord.notes);
        }

        return newScoreChord; 
    }

    //Function to parse XML strings to xml dom
    function parseXml(xmlString) {
        var xmlDom = null;
        if (window.DOMParser) {
            
            try { 
                xmlDom = (new DOMParser()).parseFromString(xmlString, "text/xml"); 
            } catch (e) { xmlDom = null; }
        
        } else if (window.ActiveXObject) {
            
            try {
                xmlDom = new ActiveXObject('Microsoft.XMLDOM');
                xmlDom.async = false;
                if (!xmlDom.loadXML(xmlString)) // parse error ..
                    window.alert(xmlDom.parseError.reason + xmlDom.parseError.srcText);
            } catch (e) { xmlDom = null; }
        
        } else
            alert("Cannot parse xml string!");
        
        return xmlDom;
    }
}

