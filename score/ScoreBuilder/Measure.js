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


    //---------------- Visual Object Methods ----------------
    this.Draw = function() { return measureGroup; }
    this.MoveX = function(x) { measureGroup.translate(x); }

    //---------------- Chord List Methods -------------------
    this.Count = function() { return chords.Count(); }
    this.ForEachChord = function(action, index) {
        //iterate thru all the chords and apply the specified action to it
        chords.ForEach(action, index);
    }

    //Local attribute object of this measure
    var _attr = {}  
    Object.defineProperty(this, "attr", { value: _attr });  //Attach a public reference for this local attribute object


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

    this.OrganizeChords = function(scoreAttr) {
        //Get values and update attribute pointer

        if(_attr.clef != undefined)   //if there is a clef on this measure
            scoreAttr.clef = _attr.clef;    //update the one at attribute pointer
        else //if not, get the clef from the attribute pointer
            _attr.clef = scoreAttr.clef;

        if(_attr.timeSig != undefined)   //if there is a time sig on this measure
            scoreAttr.timeSig = _attr.timeSig;    //update the one at attribute pointer
        else //if not, get the time sig from the attribute pointer
            _attr.timeSig = scoreAttr.timeSig;

        if(_attr.keySig != undefined)   //if there is a key sig on this measure
            scoreAttr.keySig = _attr.keySig;    //update the one at attribute pointer
        else //if not, get the key sig from the attribute pointer
            _attr.keySig = scoreAttr.keySig;

        //If any of the attributes are not valid, throw exception
        if(_attr.clef == undefined || _attr.keySig == undefined || _attr.timeSig == undefined)
            throw "INVALID_MEASURE_ATTRIBUTES: " + _attr.clef + " " + _attr.keySig + " " + _attr.timeSig;
        
        //Organize all the chords on this measure
        chords.ForEach(function(chord) {
            chord.Organize(_attr.clef);
        });
    }
}