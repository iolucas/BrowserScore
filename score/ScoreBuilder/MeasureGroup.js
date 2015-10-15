//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();   

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- MEASURE GROUP OBJECT -----------------
//-----------------------------------------------------------
//-----------------------------------------------------------

/*

-------> DO IT!

CREATE SYSTEM THAT WILL LOOK THE NEXT MEASURE TO CHECK CLEFS, TIME SIGS AND KEY CHANGES

WE WILL USE THE MEASURE GROUP LAYOUT TO PLACE A CLEF, TIME AND KEY CHANGE SYSTEM

WILL STORE CLEF, TIME AND KEY INFO @ THE MEASURE <--WILL DO THIS FIRST AND THEM DO THE REST

SYSTEM THAT WILL CHECK THE NEXT MEASURE GROUP TO LOOK FOR CHANGES

HOW WILL STORE CLEF CHANGES @ MEASURE GROUP, SINCE THEY DO NOT CHANGE FOR ALL? SAME FOR KEYS WHEN USING TABS
FOR TIME ITS OK CAUSE TABS FOLLOW THE SAME TIME SIGNATURES


CHECK NOTE BOOK FOR MORE INSTRUCTIONS HOW SCORE HEADER DATA WILL BE PASSED FROM THE MEASURE TO SCORE*/

ScoreBuilder.MeasureGroup = function() {
    var measures = [],
        //Array to organize the chords of the measures according to their duration, 
        //to sync same chords thats occurs at the same time
        chordsTimeArray,
        denominatorSum = 0, //variable to store the total denominators sum of this measure
        
        currWidth = 0,  //variable to store the measure group current width
        fixedLength = 0,   //variable to store the fixed length of this measure group, including chords size, bars and margins
        
        //factor to multiply denominators to get times as integers (biggest denominator expected)
        CHORD_ARRAY_FACTOR = 128,
        MEASURE_LEFT_MARGIN = 20;  //constante value for the left margin of the measure

    //Valid after SetChord position call
    this.GetWidth = function() { return currWidth; }

    //Valid after Organize call
    this.GetFixedLength = function() { return fixedLength; }

    //Valid after organize call
    this.GetDenominatorSum = function() { return denominatorSum; }


    var _startBar;    
    this.GetStartBar = function() { return _startBar; }

    var _endBar; 
    this.GetEndBar = function() { return _endBar; }

    var _clefChangeArr;
    this.GetClefChangeArr = function() { return _clefChangeArr; }

    var _keySigChangeArr;
    this.GetKeySigChangeArr = function() { return _keySigChangeArr; }
    
    var _timeSigChangeArr;
    this.GetTimeSigChangeArr = function() { return _timeSigChangeArr; }


    this.AddMeasure = function(measure) {
        if(measures.indexOf(measure) != -1)
            return "MEASURE_ALREADY_ADDED_TO_THE_GROUP";

        measures.push(measure);

        return "SUCESS_MEASURE_ADDED";
    }

    /*this.DeleteMeasure = function(measure) {
        var measureIndex = measures.indexOf(measure);
        if(measureIndex == -1)
            return "MEASURE_DOES_NOT_EXISTS";

        delete measures[measureIndex];

        return "SUCESS_MEASURE_DELETED";
    }*/

    this.Count = function() {
        return measures.getValidLength();
    }

    this.ForEachMeasure = function(action) {
        var measuresLength = measures.length;
        for(var i = 0; i < measuresLength; i++)
            if(measures[i])
                action(measures[i], i);
    }

    //Function to set the chords positions of the measures within this measure group
    this.SetChordsPositions = function(denUnitLength) {

        //Start the next position variable with the left margin value
        var nextPosition = MEASURE_LEFT_MARGIN;

        //Iterate thru the chords time array
        for(var chordTime = 0; chordTime < chordsTimeArray.length; chordTime++) {
            if(chordsTimeArray[chordTime] == undefined) //if the current time is not valid,
                continue;   //keep going

            //iterate thru the chords @ this current time
            for(var chordInd = 0; chordInd < chordsTimeArray[chordTime].length; chordInd++)
                //Move the chord to the chord time specified position + the next position
                chordsTimeArray[chordTime][chordInd].MoveX(chordsTimeArray[chordTime].backLength + nextPosition);

            //update the next position pointer
            nextPosition += denUnitLength / chordsTimeArray[chordTime].highDen + 
                chordsTimeArray[chordTime].backLength + chordsTimeArray[chordTime].frontLength; 
        }

        //update curr length variable of this measure group with the end bar length
        currWidth = nextPosition;
    }

    this.Organize = function() {

        fixedLength = MEASURE_LEFT_MARGIN;  //reset the fixed length

        denominatorSum = 0; //clear the denominator sum

        _startBar = null;    //clear curr start bar
        _endBar = null;    //clear curr end bar

        _clefChangeArr = [];    //Resets the array to store the clefs that will be put later    
        _clefChangeArr._width = 0;   //var to get the largest clef draw

        _keySigChangeArr = [];
        _keySigChangeArr._width = 0;
    
        _timeSigChangeArr = [];
        _timeSigChangeArr._width = 0;


        //alloc new chord time array
        chordsTimeArray = [];
        
        if(measures.getValidLength() <= 0) //if there is no measure, return
            return;

        //iterate thru the measures of this measure group
        for(var i = 0; i < measures.length; i++) {
            if(measures[i] == undefined)    //if the current index is not valid
                continue;   //keep next iteration

            //if the currStartBar hasn't been set and the current measure got a valid start bar value
            if(!_startBar && measures[i].GetStartBar())
                _startBar = measures[i].GetStartBar();    //set the current start bar variable

            //if the currEndBar hasn't been set and the current measure got a valid end bar value
            if(!_endBar && measures[i].GetEndBar())
                _endBar = measures[i].GetEndBar();

            //If the measure got to place the clef change of the next measure
            if(measures[i].changes.clef) {
                var clefObj = DrawScoreClef(measures[i].changes.clef),    //Get the clef obj
                    clefWidth = clefObj.getBBox().width;

                _clefChangeArr.push(clefObj);   //push the clef change obj to the clef change array   

                if(clefWidth > _clefChangeArr._width)    //if it is larger than the previous one
                    _clefChangeArr._width = clefWidth;   //update it
            }

            //Got to populate keysig change array with the first measure change
            if(measures[i].changes.keySig && _keySigChangeArr.length == 0) {
                var keySigObj = DrawKeySignature(measures[i].changes.keySig),
                    keySigWidth = keySigObj.getBBox().width;

                _keySigChangeArr.push(keySigObj);  
                
                if(keySigWidth > _keySigChangeArr._width)
                    _keySigChangeArr._width = keySigWidth;
            }

            //Got to populate timesig change array with the first measure change
            if(measures[i].changes.timeSig && _timeSigChangeArr.length == 0) {
                var timeSigObj = DrawTimeSignature(measures[i].changes.timeSig),
                    timeSigWidth = timeSigObj.getBBox().width;

                _timeSigChangeArr.push(timeSigObj);  
                
                if(timeSigWidth > _timeSigChangeArr._width)
                    _timeSigChangeArr._width = timeSigWidth;  
            }


            //Variable to navigate thru the chords of the measure
            var currInd = 0;

            //iterate thry the current measure chords and populate the chords time array                   
            measures[i].ForEachChord(function(chord) {

                if(chordsTimeArray[currInd] == undefined)  //if the chord time array hasn't been initated
                    chordsTimeArray[currInd] = [];  //inits it
                
                chordsTimeArray[currInd].push(chord);   //push the chord to it

                //get the highest back length value
                if(chordsTimeArray[currInd].backLength == undefined || chord.GetBackWidth() > chordsTimeArray[currInd].backLength)
                    chordsTimeArray[currInd].backLength = chord.GetBackWidth(); 
                    
                //get the highest front length value
                if(chordsTimeArray[currInd].frontLength == undefined || chord.GetFrontWidth() > chordsTimeArray[currInd].frontLength)
                    chordsTimeArray[currInd].frontLength = chord.GetFrontWidth();

                //get the highest denominator
                if(chordsTimeArray[currInd].highDen == undefined || chord.GetDenominator() > chordsTimeArray[currInd].highDen)
                    chordsTimeArray[currInd].highDen = chord.GetDenominator();             

                //update next chord ind
                currInd += CHORD_ARRAY_FACTOR / chord.GetDenominator();

                //if invalid denominator is set, throw error
                if(currInd.getDecimalValue() != 0)
                    throw "INVALID_DENOMINATOR: " + chord.GetDenominator();
            });
        }

        //Add clef change margin to the fixed length
        if(_clefChangeArr._width > 0) {    //if it different from 0
            _clefChangeArr._width += 5;    //Add an additional gap
            fixedLength += _clefChangeArr._width;   //add it plus a gap 
        }

        //Add time sig change margin to the fixed length
        if(_timeSigChangeArr._width > 0) {    //if it different from 0
            _timeSigChangeArr._width;    //Add an additional gap
            fixedLength += _timeSigChangeArr._width + 10;   //add it plus a gap 
        }

        //Add key sig change margin to the fixed length
        if(_keySigChangeArr._width > 0) {    //if it different from 0
            _keySigChangeArr._width;    //Add an additional gap
            fixedLength += _keySigChangeArr._width + 5;   //add it plus a gap 
        }        

        //Update fixedLength and denominatorSum variable
        for(var j = 0; j < chordsTimeArray.length; j++) {
            if(chordsTimeArray[j] == undefined)
                continue;

            //get the biggest elements fixed lengths to find out how much free space we have 
            fixedLength += chordsTimeArray[j].backLength + chordsTimeArray[j].frontLength;
            //get the high den of the time and accumulate it with the others
            denominatorSum += 1 / chordsTimeArray[j].highDen;
        }
    }

    //Function to get the lower denominatir unit lenght that the measure group size remains above the min width
    this.GetMinDenUnitLength = function(minWidth) {
        return (minWidth - fixedLength) / denominatorSum;
    }
}