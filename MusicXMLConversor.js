function parseScorePartwise(scorePartwise) {

    var newPartwise = { parts: [] };

    //Iterate thru scorePartwise childs
    for(var i = 0; i < scorePartwise.children.length; i++) {
        var currChild = scorePartwise.children[i];
        
        switch(currChild.nodeName) {

            case "movement-title":
                //If the title has already been set, put the setted as subtitle
                if(newPartwise.title != undefined)
                    newPartwise.subtitle = newPartwise.textContent; 
                
                newPartwise.title = currChild.textContent;
                break;

            case "work":
                //iterate thru the work children
                for(var j = 0; j < currChild.children.length; j++) {
                    var workChild = currChild.children[j];

                    switch(workChild.nodeName) {
                        case "work-title":
                            if(newPartwise.title == undefined) 
                                newPartwise.title = workChild.textContent;
                            else
                                newPartwise.subtitle = workChild.textContent;
                            break;
                    }
                }
                break;

            case "identification":
                //Iterate thry the identification children
                for(var j = 0; j < currChild.children.length; j++) {
                    var identChild = currChild.children[j];

                    switch(identChild.nodeName) {
                        case "creator":
                            var creatorAttr = getNodeAttributes(identChild);
                            if(creatorAttr.type != undefined)
                                newPartwise[creatorAttr.type] = identChild.textContent;     

                            break;
                    }
                }
                break;

            case "part":
                //Get the parts of the score
                var partsColl = parseScorePart(currChild);

                //Push all the parts to the new partwise parts array
                for(var j = 0; j < partsColl.length; j++)
                    newPartwise.parts.push(partsColl[j]);

                break;
        }

    }

    return newPartwise;
}

function parseScorePart(scorePart) {

    //var newPart = { measures: [] }

    var partsCollection = [];

    //if(scorePart.id != undefined)
        //newPart.id = scorePart.id;

    //Iterate thru scorePart childs
    for(var i = 0; i < scorePart.children.length; i++) {
        var currChild = scorePart.children[i];

        switch(currChild.nodeName) {
            case "measure":
                var measuresCollection = parseScoreMeasure2(currChild); 

                for(var j = 0; j < measuresCollection.length; j++) {
                    //create the part object if doesn't exists
                    if(partsCollection[j] == undefined)
                        partsCollection[j] = { measures: [] }

                    partsCollection[j].measures.push(measuresCollection[j]);    

                }
                    //newPartwise.parts.push(partsColl[j]);


                //newPart.measures.push(parseScoreMeasure(currChild));
                //parseScoreMeasure2(currChild);   
                break;
        }
    }

    //return newPart;
    return partsCollection
}

function parseScoreMeasure2(scoreMeasure) {

    function createMeasure() {
        return { chords: [] , chordPointer: -1, endBar: "light" } 
    }

    var measuresCollection = [],
        measuresMetadata = {}

    //Iterate thru scoreMeasure childs
    for(var i = 0; i < scoreMeasure.children.length; i++) {
        var currChild = scoreMeasure.children[i];

        switch(currChild.nodeName) {
            case "attributes":
                //iterate thru the attributes children
                for(var j = 0; j < currChild.children.length; j++) {
                    var attrChild = currChild.children[j];

                    switch(attrChild.nodeName) {
                        case "clef":
                            var clefObj = parseClef(attrChild);

                            if(clefObj == null) //If the clef obj is not found,
                                break;  //exit

                            var clefAttr = getNodeAttributes(attrChild),
                                partInd = clefAttr.number == undefined ? 0 : clefAttr.number - 1;

                            //Check if the measure specified by the clef has already been created, if not create it
                            if(measuresCollection[partInd] == undefined)
                                measuresCollection[partInd] = createMeasure();

                            measuresCollection[partInd].clef = clefObj;       
                            
                            break;

                        case "key":
                            var keySigObj = parseKeySig(attrChild);
                            if(keySigObj != null)
                                measuresMetadata.keySig = keySigObj; 
                            break;

                        case "time":
                            var timeSigObj = parseTimeSig(attrChild);
                            if(timeSigObj != null)
                                measuresMetadata.timeSig = timeSigObj;
                            break;
                    }
                }
                break;

            case "direction": //measure tempo will be found here
                var tempoObj = parseTempo(currChild);
                if(tempoObj != null)
                    measuresMetadata.tempo = tempoObj;
                break;

            case "barline":
                var barObj = parseBar(currChild);
                if(barObj != undefined && barObj.name != undefined) {
                    if(barObj.place == "start")
                        measuresMetadata.startBar = barObj.name;    
                    else if(barObj.place == "end")
                        measuresMetadata.endBar = barObj.name;   
                }
                break;

            case "note":

                var noteObj = parseScoreNote(currChild);

                //get the part index of the note
                var partInd = noteObj.partInd;
                delete noteObj.partInd; //delete part index member from the note obj

                if(measuresCollection[partInd] == undefined)
                    measuresCollection[partInd] = createMeasure();

                //Get the note measure reference
                var measureRef = measuresCollection[partInd];

                if(noteObj.chordFlag == undefined || measureRef.chordPointer == -1) { 
                    measureRef.chordPointer++; //increase chord pointer 
                    measureRef.chords[measureRef.chordPointer] = { notes:[] , denominator: 1}  //inits the new chord object
                } else {
                    delete noteObj.chordFlag;   //if it is a chord, only delete this member
                }

                var currChord = measureRef.chords[measureRef.chordPointer];

                if(noteObj.dot != undefined) {
                    currChord.dot = noteObj.dot;
                    delete noteObj.dot;
                }

                if(noteObj.denominator != undefined) {
                    currChord.denominator = noteObj.denominator;
                    delete noteObj.denominator;
                }

                if(noteObj.step != undefined && noteObj.octave != undefined)
                    currChord.notes.push(noteObj);

                break;
        }
    }

    //Add metadata to the measures and remove unecessary members
    for(var i = 0; i < measuresCollection.length; i++) {
        var currMeasure = measuresCollection[i];
        
        delete currMeasure.chordPointer;  

        //Copy all properties of the measure metadata to the measures on the measure collection
        for(prop in measuresMetadata)
            currMeasure[prop] = measuresMetadata[prop];    
    }

    return measuresCollection;
}

function parseScoreMeasure(scoreMeasure) {

    var newMeasure = { chords: [] , endBar: "light" }   //declare new measure object, with standard light bar

    var chordPointer = -1;   //variable to point to the current chord (start -1 for correct initiation)

    //Iterate thru scoreMeasure childs
    for(var i = 0; i < scoreMeasure.children.length; i++) {
        var currChild = scoreMeasure.children[i];

        switch(currChild.nodeName) {
            case "attributes":
                //iterate thru the attributes children
                for(var j = 0; j < currChild.children.length; j++) {
                    var attrChild = currChild.children[j];

                    switch(attrChild.nodeName) {
                        case "clef":
                            var clefObj = parseClef(attrChild);
                            if(clefObj != null)
                                newMeasure.clef = clefObj;  
                            break;

                        case "key":
                            var keySigObj = parseKeySig(attrChild);
                            if(keySigObj != null)
                                newMeasure.keySig = keySigObj; 
                            break;

                        case "time":
                            var timeSigObj = parseTimeSig(attrChild);
                            if(timeSigObj != null)
                                newMeasure.timeSig = timeSigObj;
                            break;
                    }
                }
                break;

            case "direction": //measure tempo will be found here
                var tempoObj = parseTempo(currChild);
                if(tempoObj != null)
                    newMeasure.tempo = tempoObj;
                break;

            case "barline":
                var barObj = parseBar(currChild);
                if(barObj != undefined && barObj.name != undefined) {
                    if(barObj.place == "start")
                        newMeasure.startBar = barObj.name;    
                    else if(barObj.place == "end")
                        newMeasure.endBar = barObj.name;   
                }
                break;

            case "note":
                var noteObj = parseScoreNote(currChild);

                if(noteObj == null || noteObj.chordFlag == undefined || chordPointer == -1) { 
                    chordPointer++; //increase chord pointer 
                    newMeasure.chords[chordPointer] = { notes:[] , denominator: 1}  //inits the new chord object
                } else {
                    delete noteObj.chordFlag;   //if it is a chord, only delete this member
                }

                var currChord = newMeasure.chords[chordPointer]

                if(noteObj.dot != undefined) {
                    currChord.dot = noteObj.dot;
                    delete noteObj.dot;
                }

                if(noteObj.denominator != undefined) {
                    currChord.denominator = noteObj.denominator;
                    delete noteObj.denominator;
                }

                if(noteObj.step != undefined && noteObj.octave != undefined)
                    currChord.notes.push(noteObj);

                break;
        }
    }


    return newMeasure;
}

function parseScoreNote(scoreNote) {
    
    var noteObj = { partInd: 0 }    //note object to store note information with the part index of the note

    for(var i = 0; i < scoreNote.children.length; i++) {
        var noteChild = scoreNote.children[i];

        switch(noteChild.nodeName) {

            //Get note denominator
            case "type":
                noteObj.denominator = getNoteDen(noteChild.textContent);
                break;

            case "pitch":

                for(var j = 0; j < noteChild.children.length; j++) {
                    var pitchChild = noteChild.children[j];

                    switch(pitchChild.nodeName) {

                        case "step":
                            noteObj.step = pitchChild.textContent;
                            break;

                        case "octave":
                            var noteOctave = parseInt(pitchChild.textContent);
                            noteObj.octave = isNaN(noteOctave) ? null : noteOctave;
                            break;
                    }
                }
                break;

            case "accidental":
                noteObj.accidental = noteChild.textContent; 
                break;

            case "dot":
                //if the dot stuff hasn't been defined yet, define it as one,
                if(noteObj.dot == undefined)
                    noteObj.dot = 1;
                else //if it has already been defined, update to 2
                    noteObj.dot = 2;
                break;

            case "chord":
                noteObj.chordFlag = true;
                break;

            case "voice":
                var noteVoice = parseInt(noteChild.textContent);                    

                //If the note voice is a valid number, get the part index from it
                if(!isNaN(noteVoice))
                    noteObj.partInd = (noteVoice - 1) / 4; 

                break;
        }
    }

    return noteObj;
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

function parseBar(scoreBar) {

    var barObj = {}

    var scoreBarAttr = getNodeAttributes(scoreBar);

    if(scoreBarAttr.location == undefined)
        return null;

    switch(scoreBarAttr.location) {
        case "right":
            barObj.place = "end";
            break;

        case "left":
            barObj.place = "start";
            break;
    }

    for(var i = 0; i < scoreBar.children.length; i++) {
        var scoreBarChild = scoreBar.children[i];

        switch(scoreBarChild.nodeName) {

            case "repeat": //Repeat bars have priority, so we dont check if the bar name has already been set
                var repeatAttr = getNodeAttributes(scoreBarChild);

                if(repeatAttr.direction == undefined)
                    break;

                barObj.name = repeatAttr.direction;
                break;

            case "bar-style":
                if(barObj.name == undefined)    
                    barObj.name = scoreBarChild.textContent;
                break;
        }
    }

    return barObj;
}

function parseTempo(scoreTempo) {

    var tempoObj = {};

    for(var i = 0; i < scoreTempo.children.length; i++) {
        var scoreTempoChild = scoreTempo.children[i];

        switch(scoreTempoChild.nodeName) {

            case "direction-type":
                for(var j = 0; j < scoreTempoChild.children.length; j++) {
                    var directionTypeChild = scoreTempoChild.children[j];

                    switch(directionTypeChild.nodeName) {

                        case "metronome":
                            for(var l = 0; l < directionTypeChild.children.length; l++) {
                                var metronomeChild = directionTypeChild.children[l];

                                switch(metronomeChild.nodeName) {

                                    case "beat-unit":

                                        switch(metronomeChild.textContent) {
                                            case "eighth":
                                                tempoObj.denominator = 8;
                                                break;

                                            case "quarter":
                                                tempoObj.denominator = 4;
                                                break;

                                            case "half":
                                                tempoObj.denominator = 2;
                                                break;
                                        }

                                        break;

                                    case "per-minute":
                                        tempoObj.value = metronomeChild.textContent;
                                        break;
                                }
                            }
                            break;
                    }
                }
                break;
        }
    }

    if(tempoObj.value == undefined || tempoObj.denominator == undefined)
        return null;

    return tempoObj;
}


//Function to get the time sig object based on its music xml key tag
function parseTimeSig(scoreTime) {
    
    //Check if the score got a symbol on its attributes
    var scoreTimeAttr = getNodeAttributes(scoreTime);

    //if so, return this symbol as the time sig object
    if(scoreTimeAttr.symbol != undefined)
        return scoreTimeAttr.symbol;

    //If not, proceed

    //If it got less than 2 children, means invalid time sig, return null
    if(scoreTime.children.length < 2)
        return null;

    var timeSigObj = {}

    //Iterate thry time childs
    for(var i = 0; i < scoreTime.children.length; i++) {
        var timeChild = scoreTime.children[i];

        switch(timeChild.nodeName) {
            case "beats":
                timeSigObj.beats = timeChild.textContent;
                break;

            case "beat-type":
                timeSigObj.beatType = timeChild.textContent;
                break;
        }
    }

    //If some of the members are not defined, return null
    if(timeSigObj.beats == undefined || timeSigObj.beatType == undefined)
        return null;

    return timeSigObj.beats + "," + timeSigObj.beatType; 

}

//Function to get the key sig object based on its music xml key tag
function parseKeySig(scoreKey) {
    //If it got less than 2 children, means invalid key, return null
    if(scoreKey.children.length < 1)
        return null;

    var keySigValue = null;

    //Iterate thry key childs
    for(var i = 0; i < scoreKey.children.length; i++) {
        var keyChild = scoreKey.children[i];

        switch(keyChild.nodeName) {
            case "fifths":
                keySigValue = parseInt(keyChild.textContent);
                break;
        }
    }

    //if the key sig value is not valid, return null, other wise, return itself
    if(isNaN(keySigValue))
        return null;

    return keySigValue;
}

//Function to get the clef object based on its music xml clef tag
function parseClef(scoreClef) {

    //If it got less than 2 children, means invalid clef, return null
    if(scoreClef.children.length < 2)
        return null;

    var clefObj = {}

    //Iterate thry clefs child
    for(var i = 0; i < scoreClef.children.length; i++) {
        var clefChild = scoreClef.children[i];

        switch(clefChild.nodeName) {
            case "sign":
                clefObj.sign = clefChild.textContent;
                break;

            case "line":
                clefObj.line = clefChild.textContent;
                break;
        }
    }

    //If some of the members are not defined, return null
    if(clefObj.sign == undefined || clefObj.line == undefined)
        return null;

    return clefObj.sign + clefObj.line;
}


function getNodeAttributes(targetNode) {
    if(targetNode.attributes == undefined)
        return {};

    if(targetNode.attributes.length == 0)
        return {};

    var nodeAttributtes = {}

    for(var i = 0; i < targetNode.attributes.length; i++) {
        var currAttr = targetNode.attributes[i];

        nodeAttributtes[currAttr.nodeName] = currAttr.nodeValue;
    }

    return nodeAttributtes;
}