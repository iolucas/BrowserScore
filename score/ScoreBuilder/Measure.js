//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();   

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- MEASURE OBJECT -----------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

ScoreBuilder.Measure = function() {

    var selfRef = this,
        measureGroup = document.createElementNS(xmlns, "g"),   //group to fit all the measure members
        chords = new List();   //ordered list to fit all the chords @ this measure

    //for debug, not really necessary due to group grows, but coodinates origin remains the same
    //reference rectangle to be used as a fixed reference point
    var refRect = document.createElementNS(xmlns, "rect");
    refRect.setAttribute("fill", "red");
    refRect.setAttribute("height", 18); 
    refRect.setAttribute("width", 18);    
    measureGroup.appendChild(refRect); //append debug square


    //-------------------------------------------------------
    //---------------- PUBLIC METHODS -----------------------
    //-------------------------------------------------------

    //Property to be used when dealing with tabs to determine the height limit for bars, brackets etc
    //Object.defineProperty(this, "linesHeight", { value: 60 });

    //---------------- Visual Object Methods ----------------
    this.Draw = function() { return measureGroup; }
    this.MoveX = function(x) { measureGroup.translate(x); }

    //---------------- Chord List Methods -------------------
    this.Count = function() { return chords.Count(); }
    this.ForEachChord = function(action, index) {
        //iterate thru all the chords and apply the specified action to it
        chords.ForEach(action, index);
    }


    this.changes;

    //Static measure values, that will be change every time a set is called
    var measureClef = null,
        measureKeySig = null,
        measureTimeSig = null;

    this.SetClef = function(value) { measureClef = value; }
    this.SetKeySig = function(value) { measureKeySig = value; }
    this.SetTimeSig = function(value) { measureTimeSig = value; }

    //Dynamic running values, that will be updated everytime organized is called
    var runningClef = null,
        runningKeySig = null,
        runningTimeSig = null;

    this.GetClef = function() { return runningClef; }
    this.GetKeySig = function() { return runningKeySig; }
    this.GetTimeSig = function() { return runningTimeSig; }

    var measureEndBar = null;
    this.GetEndBar = function() { return measureEndBar; }
    this.SetEndBar = function(value) { measureEndBar = value; }

    var measureStartBar = null;
    this.GetStartBar = function() { return measureStartBar; }
    this.SetStartBar = function(value) { measureStartBar = value; }


    this.InsertChord = function(chord, position) {
        //if the chord object already exists at this measure, return a message
        if(chords.Find(chord) != -1) return "CHORD_ALREADY_ON_MEASURE"; 

        //if the type of the position variable is different from number or the position is bigger or the size of the list
        if(typeof position != "number" || position >= chords.Count())    
            chords.Add(chord);    //insert with add method at the last position
        else //otherwise
            chords.Insert(position, chord); //insert element reference at the position to the list

        //append the object to the group
        measureGroup.appendChild(chord.Draw());

        return "SUCCESS";
    }

    this.AddChordCollection = function(chordCollection) {
        var result = [];
        for(var i = 0; i < chordCollection.length; i++)
            result.push(selfRef.InsertChord(chordCollection[i]));

        return result;
    }

    this.RemoveAt = function(position) {
        if(position < 0 || position >= chords.Count()) return "ERROR_POSITION_OUT_OF_BOUNDS";

        var removedChord = chords.GetItem(position);    //get the chord handler from the list
        measureGroup.removeChild(removedChord.Draw());  //remove it from the line
        chords.RemoveAt(position);    //remove the chord from the list

        return removedChord;
    }

    this.RemoveChord = function(chord) {
        var position = chords.Find(chord);
        if(position == -1) 
            return "ERROR_CHORD_NOT_FOUND";
        else 
            return selfRef.RemoveAt(position);
    }

    this.OrganizeChords = function(prevMeasure) {

        //Reset variables
        selfRef.changes = {}

        runningClef = measureClef;  //set running clef
        runningKeySig = measureKeySig;  //set running key sig
        runningTimeSig = measureTimeSig;    //set running time sig

        //If there is a previous measure
        if(prevMeasure != undefined) {
            //If some running attribute is not valid, get the previous one
            
            if(runningClef == undefined)    //If the running clef is not valid
                runningClef = prevMeasure.GetClef();    //get the previous one
            else if(runningClef != prevMeasure.GetClef()) { //if it valid and different from the previous one
                prevMeasure.changes.clef = measureClef; //Signalize the previous clef the next one is different
                selfRef.changes.clefChanged = true;  //Flag this clef that it is different from the previous
            }

            //(Analog the same for other attributes)

            if(runningKeySig == undefined)
                runningKeySig = prevMeasure.GetKeySig();
            else if(runningKeySig != prevMeasure.GetKeySig()) {
                prevMeasure.changes.keySig = measureKeySig;
                selfRef.changes.keySigChanged = true;
            }

            if(runningTimeSig == undefined)
                runningTimeSig = prevMeasure.GetTimeSig();
            else if(runningTimeSig != prevMeasure.GetTimeSig()) {
                prevMeasure.changes.timeSig = measureTimeSig;
                selfRef.changes.timeSigChanged = true;
            }

        }  else {   //If the previous is not valid, 
            selfRef.changes.clefChanged = true;  //Flag to signalize this measure has different clef as the previous (null)  
            selfRef.changes.keySigChanged = true;  //Flag to signalize this measure has different key sig as the previous (null)
            selfRef.changes.timeSigChanged = true;  //Flag to signalize this measure has different time sig as the previous (null) 
        }   
        
        //If any of the attributes are not valid, throw exception
        //if(runningClef == undefined || runningKeySig == undefined || runningTimeSig == undefined)
            //throw "INVALID_MEASURE_ATTRIBUTES: " + runningClef + " " + runningKeySig + " " + runningTimeSig;

        if(runningClef == undefined)
            throw "NO_CLEF_SET_AT_THE_MEASURE";      

        //Organize all the chords on this measure
        chords.ForEach(function(chord) {
            chord.Organize(runningClef);
        });
    }
}