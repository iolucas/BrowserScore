//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();   

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- MEASURE OBJECT -----------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

/*MUST CHECK WHETHER THIS IS THE BEST WAY TO ORGANIZE MEASURES
R: PROBABLY IS THIS ONE CAUSE WE HAVE TO HAVE A MEASURE GROUP OBJECT TO STORE MEASURES BEFORE MOVE THEM


CREATING A POSITION ARRAY WITH DENOMINATOR VALUES WITH THE VALUE CURRENT POSITION
CHECK HOW WILL POSITION THE MEASURE
THEN CREATE SYSTEM THAT WILL LOOK THE NEXT MEASURE TO CHECK CLEFS, TIME SIGS AND KEY CHANGES

-------> DO IT!

WE WILL USE THE MEASURE GROUP LAYOUT TO PLACE A CLEF, TIME AND KEY CHANGE SYSTEM

WILL STORE CLEF, TIME AND KEY INFO @ THE MEASURE <--WILL DO THIS FIRST AND THEM DO THE REST

SYSTEM THAT WILL CHECK THE NEXT MEASURE GROUP TO LOOK FOR CHANGES

HOW WILL STORE CLEF CHANGES @ MEASURE GROUP, SINCE THEY DO NOT CHANGE FOR ALL? SAME FOR KEYS WHEN USING TABS
FOR TIME ITS OK CAUSE TABS FOLLOW THE SAME TIME SIGNATURES

WILL HAVE TO IMPROVE THE COORDINATES SYSTEM THAT PLACE THE BARS AND DOTS STUFF @ THE SCORE FINISH CAUSE
THEY ARE USING THE 60 PIXEL HARD CODED SSCORE LINES SIZE

CHECK NOTE BOOK FOR MORE INSTRUCTIIONS HOW SCORE HEADER DATA WILL BE PASSED FROM THE MEASURE TO SCORE*/

ScoreBuilder.Measure = function() {

    var selfRef = this,
        measureGroup = document.createElementNS(xmlns, "g"),   //group to fit all the measure members
        startBar,
        endBar,
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

    this.Draw = function() { 
        return measureGroup; 
    }

    this.MoveTo = function(x, y) {
        measureGroup.translate(x, y);
    }

    this.Count = function() {
        return chords.Count();
    }

    this.ForEachChord = function(action, index) {
        chords.ForEach(action, index);//iterate thru all the chords and apply the specified action to it
    }

    var _attr = {}  //Local attribute object of this measure
    Object.defineProperty(this, "attr", { value: _attr });  //Attach a public reference for this attribute object

    /*var _clef = null;
    this.SetClef = function(clef) { _clef = clef; }
    this.GetClef = function() { return _clef; }

    var _timeSig = null;
    this.SetTimeSig = function(timeSig) { _timeSig = timeSig; }
    this.GetTimeSig = function() { return _timeSig; }

    var _keySig = null;
    this.SetKeySig = function(keySig) { _keySig = keySig; }
    this.GetKeySig = function() { return _keySig; }

    //mustn't be bar stuff, must be attribute such repeat forward, repeat backward

    var _startBar = "";
    this.SetStartBar = function(startBar) { _startBar = startBar; }
    this.GetStartBar = function() { return _startBar; }  

    var _endBar = "simple";
    this.SetEndBar = function(endBar) { _endBar = endBar; }
    this.GetEndBar = function() { return _endBar; }*/ 

         

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

    this.Organize123 = function(attrPointer) {
        //Get values and update attribute pointer

        if(_attr.clef != undefined)   //if there is a clef on this measure
            attrPointer["clef"] = _attr.clef;    //update the one at attribute pointer
        else //if not, get the clef from the attribute pointer
            _attr.clef = attrPointer["clef"];

        if(_attr.timeSig != undefined)   //if there is a time sig on this measure
            attrPointer["timeSig"] = _attr.timeSig;    //update the one at attribute pointer
        else //if not, get the time sig from the attribute pointer
            _attr.timeSig = attrPointer["timeSig"];

        if(_attr.keySig != undefined)   //if there is a key sig on this measure
            attrPointer["keySig"] = _attr.keySig;    //update the one at attribute pointer
        else //if not, get the key sig from the attribute pointer
            _attr.keySig = attrPointer["keySig"];

        //If any of the attributes are not valid, throw exception
        if(_attr.clef == undefined || _attr.keySig == undefined || _attr.timeSig == undefined)
            throw "INVALID_MEASURE_ATTRIBUTES: " + _attr.clef + " " + _attr.keySig + " " + _attr.timeSig;
        
        //Organize all the chords on this measure
        chords.ForEach(function(chord) {
            chord.Organize(_attr.clef);
        });
    }

    /*this.Organize2 = function(positionArray) {

        var denominatorPointer = 0;
        chords.ForEach(function(chord) {
            var chordPos = positionArray[denominatorPointer];   //get the chord position 
            
            if(chordPos == undefined)   //check if the chord position is valid
                throw "SOMETHING_WENT_WRONG_POSITIONING_CHORDS_=(";

            chord.MoveX(chordPos);  //Put the chord on its position

            denominatorPointer += chord.GetDenominator();   //increase the denominator pointer
        });
    }*/
}