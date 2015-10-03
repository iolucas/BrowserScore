//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();   

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- MEASURE GROUP OBJECT -----------------
//-----------------------------------------------------------
//-----------------------------------------------------------

ScoreBuilder.MeasureGroup = function() {
    var measures = [],
        //Array to organize the chords of the measures according to their duration, 
        //to sync same chords thats occurs at the same time
        chordsTimeArray = [],
        denominatorSum = 0, //variable to store the total denominators sum of this measure
        leftMargin = 0, //left margin to be used for start positioning chord at the measures
        currWidth = 0,  //variable to store the measure group current width
        fixedLength = 0,   //variable to store the fixed length of this measure group, including chords size, bars and margins
        //factor to multiply denominators to get times as integers (biggest denominator expected)
        CHORD_ARRAY_FACTOR = 128;

    this.GetWidth = function() {
        return currWidth;
    }

    this.GetFixedLength = function() {
        return fixedLength;
    }

    this.GetDenominatorSum = function() {
        return denominatorSum;
    }

    this.AddMeasure = function(measure) {
        if(measures.indexOf(measure) != -1)
            return "MEASURE_ALREADY_ADDED_TO_THE_GROUP";

        measures.push(measure);

        return "SUCESS_MEASURE_ADDED";
    }

    this.DeleteMeasure = function(measure) {
        var measureIndex = measures.indexOf(measure);
        if(measureIndex == -1)
            return "MEASURE_DOES_NOT_EXISTS";

        delete measures[measureIndex];

        return "SUCESS_MEASURE_DELETED";
    }

    this.Count = function() {
        return measures.getValidLength();
    }

    this.ForEachMeasure = function(action) {
        var measuresLength = measures.length;
        for(var i = 0; i < measuresLength; i++)
            if(measures[i])
                action(measures[i]);
    }


    //------------ BETA ----------------
    var currStartBar,
        currEndBar;

    MUST DRAW BARS @ THE SCORE GROUP, BUT MARGINS AND BARS WIDTH MUST BE ADDED HERE TO THE CURR WIDTH OF THE MEASURE GROUP

    this.GetStartBar = function() {
        return currStartBar;
    }

    this.GetEndBar = function() {
        return currEndBar;
    }

    //Function to set the chords positions of the measures within this measure group
    this.SetChordsPositions = function(denUnitLength) {

        //Start the next position variable with the left margin value
        //(Must ensure left margin is update by the Organize call)
        var nextPosition = leftMargin;

        //Iterate thru the chords time array
        for(var chordTime = 0; chordTime < chordsTimeArray.length; chordTime++) {
            if(chordsTimeArray[chordTime] == undefined) //if the current time is not valid,
                continue;   //keep going

            //iterate thru the chords @ this current time
            for(var chordInd = 0; chordInd < chordsTimeArray[chordTime].length; chordInd++)
                //Move the chord to the chord time specified position + the next position
                chordsTimeArray[chordTime][chordInd].MoveChordHead(chordsTimeArray[chordTime].backLength + nextPosition);

            //update the next position pointer
            nextPosition += denUnitLength / chordsTimeArray[chordTime].highDen + 
                chordsTimeArray[chordTime].backLength + chordsTimeArray[chordTime].frontLength; 
        }

        var endBarWidth = 0;    //variable to get the end bar size
        //iterate thru the measures and update its bar position
        /*for(var i = 0; i < measures.length; i++) {
            if(!measures[i]) //if the measure is not valid
                continue;   //keep going

            var currBarWidth = measures[i].UpdateEndBarPos(nextPosition);
            if(currBarWidth > endBarWidth)
                endBarWidth = currBarWidth;
        }*/

        //update curr length variable of this measure group with the bar length
        currWidth = nextPosition + endBarWidth;
    }

    //Generate time array for this measureGroup and other stuff
    this.Organize = function() {

        leftMargin = 0; //clear the left margin
        fixedLength = 0;    //clear the fixed length
        denominatorSum = 0; //clear the denominator sum

        currStartBar = null;    //clear curr start bar
        currEndBar = null;    //clear curr end bar

        //alloc new chord time array
        chordsTimeArray = [];
        
        if(measures.getValidLength() <= 0) //if there is no measure, return
            return;

        //iterate thru the measures of this measure group
        for(var i = 0; i < measures.length; i++) {
            if(!measures[i])    //if the current index is not valid
                continue;   //keep next iteration

            measures[i].Organize(); //ensure current measure is organized

            //if the currStartBar hasn't been set and the current measure got a valid start bar value
            if(!currStartBar && measures[i].betaStartBar)
                currStartBar = measures[i].betaStartBar;

            //if the currEndBar hasn't been set and the current measure got a valid end bar value
            if(!currEndBar && measures[i].betaEndBar)
                currEndBar = measures[i].betaEndBar;

            //set the highest left margin has the left margin
            /*var currLeftMargin = measures[i].GetLeftMargin();   
            if(currLeftMargin > leftMargin)
                leftMargin = currLeftMargin; 

            //set the highest fixed length as the fixed length
            var currFixedLength = measures[i].GetFixedLength();
            if(currFixedLength > fixedLength)    
                fixedLength = currFixedLength;*/

            //Variable to navigate thru the chords of the measure
            var currInd = 0;

            //iterate thry the current measure chords and populate the chords time array                   
            measures[i].ForEachChord(function(chord) {

                if(chordsTimeArray[currInd] == undefined)  //if the chord time array hasn't been initated
                    chordsTimeArray[currInd] = [];  //inits it
                
                chordsTimeArray[currInd].push(chord);   //push the chord to it

                //get the highest back length value
                if(chordsTimeArray[currInd].backLength == undefined || chord.GetBackLength() > chordsTimeArray[currInd].backLength)
                    chordsTimeArray[currInd].backLength = chord.GetBackLength(); 
                    
                //get the highest front length value
                if(chordsTimeArray[currInd].frontLength == undefined || chord.GetFrontLength() > chordsTimeArray[currInd].frontLength)
                    chordsTimeArray[currInd].frontLength = chord.GetFrontLength();

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