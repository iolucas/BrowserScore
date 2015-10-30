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
        chords = new List(),  //ordered list to fit all the chords @ this measure
        beamChordGroups;    //collection to store dynamic chord groups

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

    this.ForEachChordGroup = function(action) {
        for(var i = 0; i < beamChordGroups.length; i++) {
            action(beamChordGroups[i]);
        }
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

    //Var to store measure lines to be draw, such voltas, octaves or pedals
    /*this.measureSymbols = {
        dynamic: null,
        repetition: null,
        pedal: null
    }

    this.OrganizeSymbols = function(measureGroupWidth) {
        var measureBox = measureGroup.getBBox(),
            //measureWidth = measureBox.width;
            verticalPointer = measureBox.height;

        if(selfRef.measureSymbols.repetition == "prima") {
            var primaObj = DrawVolta(measureGroupWidth - 10, 1, true);
            measureGroup.appendChild(primaObj);
            primaObj.translate(0, -8);
        }
    }*/

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

        if(runningClef == undefined || runningTimeSig == undefined)
            throw "NO_CLEF_OR_NO_TIMESIG_SET_AT_THE_MEASURE. Clef: " + runningClef + " , Timesig: " + runningTimeSig; 
   
        

        //----- Now we create chords groups based on time signature to place the chords beams -----

        //Get the number of beats for each group
        var GROUP_TOTAL_BEATS = runningTimeSig.split(",");
        if(GROUP_TOTAL_BEATS.length < 2) {
            if(runningTimeSig == "common")
                GROUP_TOTAL_BEATS = 4;
            else if(runningTimeSig == "cut")
                GROUP_TOTAL_BEATS = 2;
        } else
            GROUP_TOTAL_BEATS = parseInt(GROUP_TOTAL_BEATS[1]);
        //Get the inverted value
        GROUP_TOTAL_BEATS = 1 / GROUP_TOTAL_BEATS;  

        

        //Create and populate beam purposed chords group
        beamChordGroups = []; //inits the array with and array inside
        
        var bCGIndex = -1, //current chords groups index (inits -1 to ensure correct initiation)
            chordBeatCounter = 0,   //chord beat counter 
            prevIsRest = false; //flag to keep whether the previous chord were a rest
            beatsOverflow = true; //variable to check wether the chords beats has overflowed the group values 
            //(inits overflowed to ensure first group are initiated)
                    
        //Populate the chord groups array
        chords.ForEach(function(chord) {
            while(chordBeatCounter >= GROUP_TOTAL_BEATS) {
                chordBeatCounter -= GROUP_TOTAL_BEATS;
                beatsOverflow = true;
            }

            //if the previous chord were a rest
            if(prevIsRest) {
                beatsOverflow = true;
                prevIsRest = false;
            }

            //if the chord is a rest, 
            if(chord.IsRest()) {
                beatsOverflow = true;
                prevIsRest = true;
            }

            if(chord.GetDenominator() <= 4) {
                beatsOverflow = true;        
            }

            //If overflowed, create new group
            if(beatsOverflow) {
                bCGIndex++
                //beamChordGroups[bCGIndex] = [];   
                beamChordGroups[bCGIndex] = new BeamChordGroup();  
                beatsOverflow = false;
            }

            //beamChordGroups[bCGIndex].push(chord);
            beamChordGroups[bCGIndex].Add(chord);
            chordBeatCounter += 1 / chord.GetDenominator();
        });

        //Iterate thru chords group
        for(var i = 0; i < beamChordGroups.length; i++) {
            var currBeamChordGroup = beamChordGroups[i];

            currBeamChordGroup.Organize(runningClef);
        }


        //Organize all the chords on this measure
        //chords.ForEach(function(chord) {
          //  chord.Organize(runningClef);
        //});
    }
}


function BeamChordGroup() {
    var chords = [],
        downStemFlag,     
        beamY1,
        beamY2,
        beamOrientation;


    this.Add = function(chord) {
        chords.push(chord);
    }

    this.Organize = function(clef) {
        //If the group got only one chord, 
        if(chords.length == 1) {
            //Organize it in the normal way
            chords[0].OrganizeSingle(clef);
            return;   //proceed next group    
        }

        //Variables to keep coordinates of the notes of the chord
        var lowValue = null,
            highValue = null;

        //Iterate thru the chords of this group
        for(var j = 0; j < chords.length; j++) {
            var currChord = chords[j];

            var chordLimits = currChord.GetChordLimits(clef),
                currLowValue = chordLimits[0],
                currHighValue = chordLimits[1];

            //Update chord group lowest value if needed
            if(lowValue == null || lowValue > currLowValue)
                lowValue = currLowValue;

            //Update chord group highest value if needed
            if(highValue == null || highValue < currHighValue)
                highValue = currHighValue;
        }

        //get the most far value from the middle
        var farValue = (Math.abs(lowValue - 3) < Math.abs(highValue - 3)) ? highValue : lowValue; 

        //Detect whether the stem is down or up based on the most far value
        downStemFlag = farValue <= 3;

        //Reset beam orientation to down
        beamOrientation = downStemFlag ? "up" : "down";

        var tallestCoord;

        //Iterate thru the chords of this group now to organize them with the down stem flag and get the beam positions
        for(var j = 0; j < chords.length; j++) {
            var currChord = chords[j];

            currChord.Organize2(downStemFlag, lowValue, highValue);
                
            var stemYCoord = currChord.SetStemLine(downStemFlag);


            //Beam position getter stuff

            if(j == 0) {
                tallestCoord = stemYCoord; 
                continue;
            }

            if(downStemFlag) {

                if(stemYCoord >= tallestCoord) {

                    //if the coordinate is the last
                    if((j == (chords.length - 1)) && (stemYCoord > tallestCoord))
                        beamOrientation = "down";
                    else
                        beamOrientation = "straight";

                    tallestCoord = stemYCoord;          
                }

            } else {    //Upstem case

                if(stemYCoord <= tallestCoord) {

                    //if the coordinate is the last
                    if((j == (chords.length - 1)) && (stemYCoord < tallestCoord))
                        beamOrientation = "up";
                    else
                        beamOrientation = "straight";

                    tallestCoord = stemYCoord;          
                }
            }

        }


        if(beamOrientation == "down") {
            beamY1 = tallestCoord - 7.5;
            beamY2 = tallestCoord;
        } else if(beamOrientation == "up") {
            beamY1 = tallestCoord;
            beamY2 = tallestCoord - 7.5;
        } else if(beamOrientation == "straight") {
            beamY1 = tallestCoord;
            beamY2 = tallestCoord;
        }
    }


    //Function to set the beam location, should be used after the notes got their final positions
    this.SetBeam = function(measureObj) {
        if(chords.length <= 1)
            return;

        var xOffset = downStemFlag ? -8 : 8;

        var beamX1 = chords[0].GetXCoord() + xOffset,
            beamX2 = chords[chords.length - 1].GetXCoord() + xOffset;

        var downStemFact = downStemFlag ? -1 : 1;
            
        //Get beam line function
        var aFactor = (beamY2 - beamY1) / (beamX2 - beamX1),
            bFactor = beamY1 - aFactor * beamX1;


        var beamHeight = 7.5 * downStemFact,
            beamGap = 4 * downStemFact;


        var beamPath = "M" + beamX1 + "," + beamY1 + " L" + beamX2 + "," + beamY2 + " v" + 
                beamHeight + " L" + beamX1 + "," + (beamY1 + beamHeight);

        var prevChord,
            prevBeamQty,
            prevChordStemXPos;


        //Extend chord group stem lines to the beam line and draw the beams
        for(var i = 0; i < chords.length; i++) {
            var currChord = chords[i];

            var chordStemXPos = currChord.GetXCoord() + xOffset;

            var chordStemYPos = (aFactor * chordStemXPos + bFactor);

            //Extend line to its position in the straight line (straight line equation used)
            currChord.ExtendStemLine(chordStemYPos);

            var currBeamQty = getBeamsQty(currChord.GetDenominator());

            //If there is only one beam, it has already been placed, so proceed next iteration
            if(currBeamQty == 1) {
                prevChord = currChord;
                prevBeamQty = currBeamQty;
                prevChordStemXPos = chordStemXPos;
                continue;       
            }

            //Flag to detect whether a partial forward beam line is needed
            var partialNeeded = true;

            if(prevChord) {

                //get the number of the partial beams we need to draw back
                var partialLines = (currBeamQty - prevBeamQty) < 0 ? 0 : (currBeamQty - prevBeamQty); 

                if(partialLines == 0) {
                    //If the previous measure got the same or more beam lines (diference 0), partial line is not needed
                    partialNeeded = false;
                

                } else if(i == chords.length -1) {  //if partial lines are needed and we are in the last chord of the group
                    //Drawn them

                    var currX1 = chordStemXPos; //get the current X1 for drawn beams (new variable only for semantic purposes) 
                    var currX2 = prevChordStemXPos + (currX1 - prevChordStemXPos) * 3 / 4;  //calc the currX2


                    //vertical pointer to point where the next beam start at y position
                    //get its value based on the previous number of beams
                    var beamVPointer = (beamHeight + beamGap) * prevBeamQty;//(2 * beamHeight) * prevBeamQty; 

                    //partial value for Y2 to save process
                    var partialY2 = aFactor * currX2 + bFactor;

                    for(var j = 0; j < partialLines; j++) {
                        var currY1 = chordStemYPos + beamVPointer;
                        var currY2 = partialY2 + beamVPointer;

                        beamPath += "M" + currX1 + "," + currY1 + " L" + currX2 + "," + currY2 + " v" + 
                    beamHeight + " L" + currX1 + "," + (currY1 + beamHeight);

                        //Update the beam vertical pointer
                        beamVPointer += (beamHeight + beamGap); //2 * beamHeight;  
                    }
                }
            }

            var nextChord = chords[i + 1];

            if(nextChord) {
                var nextBeamQty = getBeamsQty(nextChord.GetDenominator());  //number of beam lines of the next chord

                var nextChordStemXPos = nextChord.GetXCoord() + xOffset;    //stem x position of the next chord     
                var nextChordStemYPos = aFactor * nextChordStemXPos + bFactor;  //stem y position of the next chord

                //Get how many full beam lines will draw and how many partial
                var partialLines = (currBeamQty - nextBeamQty) < 0 ? 0 : currBeamQty - nextBeamQty;  
                var fullLines = currBeamQty - partialLines;


                var currX1 = chordStemXPos; //get the current X1 for drawn beams (only semantic need)
                var currX2 = nextChordStemXPos; //get the current X2 for drawn beam (only semantic need)

                var beamVPointer = beamHeight + beamGap;//2 * beamHeight; //vertical pointer to point where the next beam start at y position

                //Draw full lines (start 1 cause the first were already drawn)
                for(var j = 1; j < fullLines; j++) {
                    
                    var currY1 = chordStemYPos + beamVPointer;
                    var currY2 = nextChordStemYPos + beamVPointer;
                    
                    beamPath += "M" + currX1 + "," + currY1 + " L" + currX2 + "," + currY2 + " v" + 
                beamHeight + " L" + currX1 + "," + (currY1 + beamHeight);

                    //Update the beam vertical pointer
                    beamVPointer += beamHeight + beamGap;//2 * beamHeight;
                }

                //Draw partial lines if needed

                if(partialNeeded) {

                    currX2 = currX1 + (currX2 - currX1) / 4;
                    //currX2 = currX2 < 50 ? 50 : currX2;

                    //partial value for Y2 to save process
                    var partialY2 = aFactor * currX2 + bFactor;

                    for(var j = 0; j < partialLines; j++) {

                        var currY1 = chordStemYPos + beamVPointer;
                        var currY2 = partialY2 + beamVPointer;

                        beamPath += "M" + currX1 + "," + currY1 + " L" + currX2 + "," + currY2 + " v" + 
                    beamHeight + " L" + currX1 + "," + (currY1 + beamHeight);

                        //Update the beam vertical pointer
                        beamVPointer += beamHeight + beamGap; //2 * beamHeight;                  
                    }
                }
            }

            //Update previous values
            prevChord = currChord;
            prevBeamQty = currBeamQty;
            prevChordStemXPos = chordStemXPos;
        }

        var beamLine = $G.create("path");
        beamLine.setAttribute("fill", "#000");
        beamLine.setAttribute("d", beamPath);
        beamLine.setAttribute("stroke", "#000");
        measureObj.appendChild(beamLine);
    }

    function getBeamsQty(denominator) {
        var beamsQty = 0;

        if(denominator <= 4) {} //denominators less or equal to 4 don't have flags
        else if(denominator <= 8) 
            beamsQty = 1;
        else if(denominator <= 16) 
            beamsQty = 2;
        else if(denominator <= 32) 
            beamsQty = 3;
        else if(denominator <= 64) 
            beamsQty = 4;
        else if(denominator <= 128) 
            beamsQty = 5;

        return beamsQty;
    }
}


