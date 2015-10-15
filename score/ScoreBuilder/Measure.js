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
        //implement timing verification in the future
        //Object validation successful

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
        //got to create way to not overwrite the current measure attributes when inherit, cause we may insert a middle
        //measure and would need to inherit new values then

        //create system to insert clef key and time changes in the previous measure


        //Clear variables
        this.changes = {}
        runningClef = null;
        runningKeySig = null;
        runningTimeSig = null;

        //Update running values with local or prev measure values

        if(measureClef != undefined) {  //If we got the local clef
            runningClef = measureClef;  //assing it to the running variable
            if(prevMeasure && measureClef != prevMeasure.GetClef()) {  //check if the clef is different from the previous one
                //if so, must be done a signal @ the previous measure that it will be changed
                prevMeasure.changes.clef = measureClef;
            }
        }    
        else if(prevMeasure)
            runningClef = prevMeasure.GetClef();  

        
        if(measureKeySig != undefined) {
            runningKeySig = measureKeySig;
            if(prevMeasure && measureKeySig != prevMeasure.GetKeySig()) {  //check if the KeySig is different from the previous one
                //if so, must be done a signal @ the previous measure that it will be changed
                prevMeasure.changes.keySig = measureKeySig;
            } 
        }   
        else if(prevMeasure)
            runningKeySig = prevMeasure.GetKeySig();  

        
        if(measureTimeSig != undefined) {
            runningTimeSig = measureTimeSig;
            if(prevMeasure && measureTimeSig != prevMeasure.GetTimeSig()) {  //check if the time clef is different from the previous one
                //if so, must be done a signal @ the previous measure that it will be changed
                prevMeasure.changes.timeSig = measureTimeSig;
            }
        }    
        else if(prevMeasure)
            runningTimeSig = prevMeasure.GetTimeSig();

        
        //If any of the attributes are not valid, throw exception
        if(runningClef == undefined || runningKeySig == undefined || runningTimeSig == undefined)
            throw "INVALID_MEASURE_ATTRIBUTES: " + runningClef + " " + runningKeySig + " " + runningTimeSig;   

        //Organize all the chords on this measure
        chords.ForEach(function(chord) {
            chord.Organize(runningClef);
        });
    }
}