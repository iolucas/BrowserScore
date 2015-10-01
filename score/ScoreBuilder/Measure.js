//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();   

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- MEASURE OBJECT -----------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

//System that will check measure elements order to implement them, such in case middle changes of clef or time sig
//IN THE FUTURE WILL GENERALIZE METHOD TO ADD CHORDS, TO A METHOD TO ADD MEASURE, TO ENSURE POSITIONING OF 
//CLEF, TIME AND KEY SIG CHANGES

ScoreBuilder.Measure = function() {

    var selfRef = this,

        measureGroup = document.createElementNS(xmlns, "g"),   //group to fit all the measure members
        MEASURE_LEFT_MARGIN = 20,  //constante value for the left margin of the measure
        //measureEndBar = $Aria.Parse(DrawMeasureElement(MeasureElement.SimpleBar)),
        //measureEndBar = DrawMeasureElement("SIMPLE_BAR"),
        startBar,
        endBar,
        //currWidth = 0,  //var to store the current width of the measure
        chords = new List(),   //ordered list to fit all the chords @ this measure
        //mElements = new List(), //ordered list to place measure elements on this measure           
        measureBarModified = false, //variable to signalize whether a start or end bar has been modified
        //measureChordModified = false,//variable to signalize whether a note has been added or removed from this chord
        //lastUnitLengthValue = 0,
        currFixedLength = MEASURE_LEFT_MARGIN,
        currLeftMargin = MEASURE_LEFT_MARGIN; 

    //measureGroup.appendChild(measureEndBar); //append measure end bar 

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

    /*this.GetWidth = function() {
        return currWidth; 
    }*/

    this.GetFixedLength = function() {
        return currFixedLength;
    }

    this.GetLeftMargin = function() {
        return currLeftMargin;

        /*if(startBar)
            return startBar.barLength + MEASURE_LEFT_MARGIN;

        return MEASURE_LEFT_MARGIN;*/
    }

    this.Count = function() {
        return chords.Count();
    }

    this.ForEachChord = function(action, index) {
        chords.ForEach(action, index);//iterate thru all the chords and apply the specified action to it
    }

    /*this.ForEachElem = function(action) {
        mElements.ForEach(action);//iterate thru all the measure elements and apply the specified action to it
    }*/

    /*this.CheckModified = function() {
        if(measureBarModified || measureChordModified)
            return true;

        var chordsLength = chords.Count();
        for(var i = 0; i < chordsLength; i++)
            if(chords.GetItem(i).CheckModified())
                return true;

        return false;
    }*/

    //Function to organize elements position and values within the measure
    this.Organize = function() {

        if(measureBarModified) {
            currFixedLength = MEASURE_LEFT_MARGIN;
            currLeftMargin = MEASURE_LEFT_MARGIN;

            if(startBar) {
                currFixedLength += startBar.barLength;
                currLeftMargin += startBar.barLength;
            } 

            if(endBar)
                currFixedLength += endBar.barLength;

            measureBarModified = false;    //clear the measure bar modified flag
        }

        chords.ForEach(function(chord) {
            chord.Organize();   //ensure chord is organized
        });

        //measureChordModified = false;    //clear the measure chord modified flag
    }

    //Function to put the end bar at the end of the measure
    this.UpdateEndBarPos = function(pos) {
        if(endBar) {
            endBar.translate(pos);
            return endBar.barLength;    //return bar length
        }
        return 0;   //if no bar, return 0
    }

    //Function to update the spaces of the measure and organize chords
    /*this.UpdateGaps = function(spaceUnitLength) {

        //if the measure hasn't been modified and the space unit is the same of the last time
        if(!measureModified && lastUnitLengthValue == spaceUnitLength)
            return; //do nothing and return

        //the start position for the first chord
        var nextPos = MEASURE_LEFT_MARGIN;  //the measure left margin 
        if(startBar)    //if a start bar has been set
            nextPos += startBar.getBBox().width;

        chords.ForEach(function(chord) {

            //Execute function to organize chord members
            chord.Organize();   

            //round the nextPos down for smooth look
            chord.MoveTo(nextPos, 0);  //move the chord X pos to current nextposition keeping the Y value
            nextPos += chord.GetWidth() + spaceUnitLength / chord.GetDenominator();    //get the gap value and add it to the next position

        });

        //set the next position vector as the current measure width
        currWidth = nextPos;    

        //put the end bar at the end of the measure
        //SetTransform(measureEndBar, { translate: [nextPos, 0] });
        //measureEndBar.translate(nextPos, 0);

        if(endBar)  //if a end bar has been set
            endBar.translate(nextPos - endBar.getBBox().width + 0); //put the end bar at the end of the measure

        measureModified = false;    //clear the modified flag
        lastUnitLengthValue = spaceUnitLength;
    }*/

    //Function to set the start bar of the measure
    this.SetStartBar = function(bar) {
        if(bar) {  //if the bar variable has been passed
            //if a start bar has already been set
            if(startBar) {
                if(startBar.barType == bar) //if the bar passed is equal to the current one,
                    return; //do nothing an return

                //if it is not equal
                measureGroup.removeChild(startBar);    //remove the current start bar
            }

            startBar = DrawBar(bar);    //get the bar visual obj
            measureGroup.appendChild(startBar); //append the start bar visual obj to the measure group
            startBar.barType = bar; //store the bar type at the bar visual objects
            startBar.barLength = startBar.getBBox().width; //store the bar visual obj width
            measureBarModified = true; //set the measure bar modified flag

        } else {    //if no bar variable has been passed
            if(startBar) {  //if the start bar has been set
                measureGroup.removeChild(startBar);    //remove it from the measure group
                delete startBar;    //clear the startBar obj
                measureBarModified = true; //set the measure bar modified flag
            }
        }    
    }

    //Function to set the end bar of the measure
    this.SetEndBar = function(bar) {
        if(bar) {  //if the bar variable has been passed
            //if a end bar has already been set
            if(endBar) {
                if(endBar.barType == bar) //if the bar passed is equal to the current one,
                    return; //do nothing an return

                //if it is not equal
                measureGroup.removeChild(endBar);    //remove the current end bar
            }

            endBar = DrawBar(bar);    //get the bar visual obj
            measureGroup.appendChild(endBar); //append the end bar visual obj to the measure group
            endBar.barType = bar; //store the bar type at the bar visual objects
            endBar.barLength = endBar.getBBox().width; //store the bar visual obj width
            measureBarModified = true; //set the measure bar modified flag
            
        } else {    //if no bar variable has been passed
            if(endBar) {  //if the end bar has been set
                measureGroup.removeChild(endBar);    //remove it from the measure group
                delete endBar;    //clear the endBar obj
                measureBarModified = true; //set the measure bar modified flag
            }
        }   
    }


    //Function to insert all the sorts of elements at the measure: 
    //chords, starts and ending bars, clef, time or key sig change etc
    /*this.InsertElem = function(mElem, position) {
        //KEEP ADAPTING THE MEASURE SYSTEM TO THE NEW REQUIREMENTS
        //REMOVE THE SCORE LINE SYSTEM, KEEPS ONLY A SCORE WHICH WILL HAVE AN ARRAY FOR LINES TO PUT THE MEASURES
        
        //measure will ignore all time sig 
        //if the clef, time or key change is the same as before, notting will happen


        //must have a mElem list that in the time of organizing
        //will navigate thru it determing furter actions to other elements
        //must know what happen when a clef, time or key change reaches the end of the line
        //Clefs can be change any time in the measure
        //time sigs are change only one per measure and is added to the previous measure to be shown

        //measure organizer will have a variable called first measure of the line, to add the necessary clefs and stuff to it

        //start bars must be @ the beginning and when find an end bar, stop the iteration thru elements
        //if no end bar is found, add a simple bar


//----------------------------------

        //if the measure element object already exists at this measure, return a message
        if(mElements.Find(mElem) != -1) return "MEASURE_ELEMENT_ALREADY_ON_PLACED"; 
        //(check the need to implement timing verification in the future to avoid a measure is overflowed with note symbols))
        
        //Object validation successful

        //if the type of the position variable is different from number or the position is bigger or the size of the list
        if(typeof position != "number" || position >= mElements.Count())    
            mElements.Add(mElem);    //insert with add method at the last position
        else //otherwise
            mElements.Insert(position, mElem); //insert element reference at the position to the list

        //append the visual object to the group
        measureGroup.appendChild(mElem.Draw());

        measureModified = true; //set the flag that the chord has been modified

        return "MEASURE_ELEMENT_INSERTED_SUCCESSFULLY";
    }*/

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

        //measureChordModified = true; //set the flag that the chord has been modified 

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

        //measureChordModified = true; //set the flag that the chord has been modified

        return removedChord;
    }

    this.RemoveChord = function(chord) {
        var position = chords.Find(chord);
        if(position == -1) 
            return "ERROR_CHORD_NOT_FOUND";
        else 
            return selfRef.RemoveAt(position);
    }
/*
    this.GetChordsInfo = function() {
        var infoArray = [];
        mElements.ForEach(function(chord) {
            infoArray.push({ den: chord.GetDenominator(), width: chord.GetWidth() });
        });
        return infoArray;
    }*/
}