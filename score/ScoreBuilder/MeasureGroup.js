//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();   

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- MEASURE GROUP OBJECT -----------------
//-----------------------------------------------------------
//-----------------------------------------------------------

//MUST SET SYSTEM TO ONLY USE MEASURE GROUP IN CASE MORE THAN ONE MEASURE IS PRESENT
//PROBALY THERE IS A WAT MUCH MORE SIMPLER TO ORGANIZE MEASURES TIMING

ScoreBuilder.MeasureGroup = function() {
    var measures = [],
        measureGroupModified = false,
        //Array to organize the chords of the measures according to their duration, 
        //to sync same chords thats occurs at the same time
        chordsTimeArray,
        denominatorSum = 0, //variable to store the total denominators sum of this measure
        leftMargin = 0, //left margin to be used for start positioning chord at the measures
        currWidth = 0,  //variable to store the measure group current width
        fixedLength = 0;   //variable to store the fixed length of this measure group, including chords size, bars and margins

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

        measureGroupModified = true;

        return "SUCESS_MEASURE_ADDED";
    }

    this.DeleteMeasure = function(measure) {
        var measureIndex = measures.indexOf(measure);
        if(measureIndex == -1)
            return "MEASURE_DOES_NOT_EXISTS";

        delete measures[measureIndex];

        measureGroupModified = true;

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
        for(var i = 0; i < measures.length; i++) {
            if(!measures[i]) //if the measure is not valid
                continue;   //keep going

            var currBarWidth = measures[i].UpdateEndBarPos(nextPosition);
            if(currBarWidth > endBarWidth)
                endBarWidth = currBarWidth;
        }

        //update curr length variable of this measure group with the bar length
        currWidth = nextPosition + endBarWidth;
    }

    //Generate time array for this measureGroup and other stuff
    this.Organize = function() {
        //LATER WILL OPTIMIZE EVERYTHING WITH MODIFICATION VERIFICATIONS AND FLAGS, FOR NOW, PUT IT TO WORK

        leftMargin = 0; //clear the left margin
        fixedLength = 0;    //clear the fixed length

        if(measures.getValidLength() <= 0) //if there is no measure, return
            return;

        //factor to multiply denominators to get times on order (biggest denominator expected)
        var arrFactor = 128,
            measuresLength = measures.length;   //get the measures length

        //alloc new chord time array
        //(Previously used arr factor but is has nothing to do with it)
        chordsTimeArray = [];//new Array(arrFactor); 


        //iterate thru the measure of this measure group
        for(var i = 0; i < measuresLength; i++) {
            if(!measures[i])    //if the current index is not valid
                continue;   //keep next iteration

            measures[i].Organize(); //ensure measure is organized

            //set the highest left margin has the left margin
            var currLeftMargin = measures[i].GetLeftMargin();   
            if(currLeftMargin > leftMargin)
                leftMargin = currLeftMargin; 

            //set the highest fixed length as the fixed length
            var currFixedLength = measures[i].GetFixedLength();
            if(currFixedLength > fixedLength)    
                fixedLength = currFixedLength;

            var currInd = 0;

            //iterate thry the current measure chords and populate the chords time array                   
            measures[i].ForEachChord(function(chord) {

                if(chordsTimeArray[currInd] == undefined)  //if the array hasn't been initated
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
                currInd += arrFactor / chord.GetDenominator(); 
            });
        }

        //Update fixedLength and denominatorSum variable

        denominatorSum = 0;
        var timeArrayLength = chordsTimeArray.length;

        for(var j = 0; j < timeArrayLength; j++) {
            if(chordsTimeArray[j] == undefined)
                continue;

            //get the biggest elements fixed lengths to find out how much free space we have 
            fixedLength += chordsTimeArray[j].backLength + chordsTimeArray[j].frontLength;
            //get the high den of the time and accumulate it with the others
            denominatorSum += 1 / chordsTimeArray[j].highDen;
        }

        measureGroupModified = false; 
    }

    //Function to get the lower denominatir unit lenght that the measure group size remains above the min width
    this.GetMinDenUnitLength = function(minWidth) {

    }
}