xmlns = "http://www.w3.org/2000/svg";
xlink = "http://www.w3.org/1999/xlink";  

//Pseudo Namespace to fit score objects classes
var ScoreBeta = new function() {
    ///create notes, chords, measures and score class to manage all the score features
    ///lets begin with the note element placing at a chord

    this.Note = function(properties) {
        var selfRef = this,

            note = properties.note, //current note of the note object (A, B, C, D, E, F, G)
            octave = properties.octave,
            accident = properties.accident ? properties.accident : "none",  //current accident of the note (none (default), flat, sharp, cancel)
            denominator = properties.denominator,   //get the denominator of the note
            aria,   // aria element to place the note current visual object
            noteGroup;


        //----------------------------------------------------------------
        //IMPLEMENT MODE FOR CHORD IT SELF DRAW SYMBOLS AND ITS ATTRIBUTES
        //CAUSE SOME ADJUSTS ARE DEPENDENTS TO OTHER NOTES
        //--------------------------------------------------------------     

        aria = DrawNote(denominator);        

        this.GetProperties = function() { 
            return { 
                note: note,
                octave: octave,
                accident: accident,
                denominator: denominator
            }
        }

        //this.Transpose = function() {}  //function to be implemented for transpose the note determined number of steps

        this.MoveTo = function(x, y) { 
            SetTransform(aria, { translate: [x, y] }); 
        }

        this.Draw = function() { return aria; }
    }

    //group to fit moer than one note
    this.Chord = function(properties) {
        var selfRef = this,

            notes = [], //Array to set the notes at this chord
            offset = 7.5,   //offset of each note at the visual object
            denominator = properties.denominator,    //chord general denominator
            group = document.createElementNS(xmlns, "g"),
            rest = DrawRest(denominator),  //get the rest element draw

        //for debug, not really necessary due to group grows, but coodinates origin remains the same
            refRect = document.createElementNS(xmlns, "rect");  //reference rectangle to be used as a fixed reference point

        refRect.setAttribute("fill", "blue");
        refRect.setAttribute("height", 10); 
        refRect.setAttribute("width", 10);    

        group.appendChild(refRect);
        group.appendChild(rest);

        this.Draw = function() { return group; }

        this.MoveTo = function(x, y) {
            SetTransform(group, { translate: [x, y] });
        }

        this.GetWidth = function() {
            return GetBBox(group).width;    
        }

        //Function to iterate thru all elements
        this.ForEach = function(action) {
            for(var i = 0; i < notes.length; i++) //iterate thru all the notes
                if(notes[i])    //if the note is valid
                    action(notes[i]);   //apply the specified action to it
        }

        this.AddNote = function(note) {
            
            if(notes.indexOf(note) != -1) return "NOTE_ALREADY_ON_CHORD"; //if the note object already exists at this chord, return message

            var noteProp = note.GetProperties();    //get the note properties values

            if(denominator != noteProp.denominator) //if the note denominator is different from chord denominator
                return "NOTE_WITH_DIFFERENT_DENOMINATOR: " + denominator + " " + noteProp.denominator;

            for(var i = 0; i < notes.length; i++) { //iterate thru all the notes
                if(notes[i]) {   //if the note is valid
                    var currProp = notes[i].GetProperties();

                    if((currProp.note == noteProp.note && currProp.octave == noteProp.octave))
                        return "SAME_NOTE_AND_OCTAVE";
                }
            }

            //Object validation successful

            if(!denominator) //if denominator not defined, set it
                denominator = noteProp.denominator;

            if(rest.parentElement)  //if the rest element is attached, 
                rest.parentElement.removeChild(rest);  //detach it

            notes.push(note);   //add the new note object to the notes array

            //append the object to the group
            group.appendChild(note.Draw());

            //put it in the desired place, 
            //Note E octave 5 must be 0,0
            //E letter code is 69
            //negative offset due to notes grow up but coodinates grow down

            var yCoord = -offset * ((noteProp.note.charCodeAt(0) - 69) + (noteProp.octave - 5) * 7);

            note.MoveTo(0, yCoord);

            return "SUCCESS";
        }

        this.RemoveNote = function(note) {

            var noteIndex = notes.indexOf(note);
            if(noteIndex == -1)   //IF THE NOTE OBJECT WERE NOT FOUND
                return "ERROR_NOTE_OBJECT_NOT_VALID"; //if not return error

            delete notes[noteIndex];    //clear the note ref at the array
            group.removeChild(note.Draw()); //remove the note from the visual object

            //if the length of the notes array is 0 and the rest element is not appended,
            if(ArrayLength(notes) == 0 && !rest.parentElement)
                group.appendChild(rest);    //show the rest element

            return note;    //return the removed not
        }

        this.GetDenominator = function() { return denominator; }
    }

    this.Measure = function() {

        var selfRef = this,

            group = document.createElementNS(xmlns, "g"),   //group to fit all the measure members
            
            //for debug, not really necessary due to group grows, but coodinates origin remains the same
            refRect = document.createElementNS(xmlns, "rect"),  //reference rectangle to be used as a fixed reference point
            //measureEndBar = $Aria.Parse(DrawMeasureElement(MeasureElement.SimpleBar)),
            measureEndBar = DrawMeasureElement("SIMPLE_BAR"),
            chords = new List();    //ordered list to fit all the chords @ this measure

        refRect.setAttribute("fill", "red");
        refRect.setAttribute("height", 15); 
        refRect.setAttribute("width", 15);    

        group.appendChild(refRect); //append debug square

        group.appendChild(measureEndBar); //append measure end bar   

        this.Draw = function() { return group; }

        this.MoveTo = function(x, y) {
            SetTransform(group, { translate: [x, y] });
        }

        this.GetWidth = function() {
            return GetBBox(group).width;    
        }

        this.Count = function() {
            return chords.Count();
        }

        //function to get the fixed elements total length
        this.GetElemLength = function() {
            var length = 0;
            chords.ForEach(function(chord) {
                length += chord.GetWidth();
            });
        }

        this.ForEach = function(action) {
            chords.ForEach(action);//iterate thru all the chords and apply the specified action to it
        }

        //Function to update the spaces of the measure and organize chords
        this.UpdateGaps = function(spaceUnitLength) {
            //the start position for the first chord
            var nextPos = 20;       //20 for the measure left margin 
            chords.ForEach(function(chord) {
                chord.MoveTo(nextPos, 0);  //move the chord X pos to current nextposition keeping the Y value
                nextPos += chord.GetWidth() + spaceUnitLength / chord.GetDenominator();    //get the gap value and add it to the next position
            });

            //put the end bar at the end of the measure
            SetTransform(measureEndBar, { translate: [nextPos, 0] });
        }

        this.InsertChord = function(chord, position) {
            //if the chord object already exists at this measure, return a message
            if(chords.Find(chord) != -1) return "CHORD_ALREADY_ON_MEASURE"; 
            //implement timing verification in the future
            //Object validation successful

            //if the type of the position variable is different from number or the position is bigger or the size of the list
            if(typeof position != "number" || position >= chords.Count())    
                chords.Add(chord);    //insert with add method at the last position
            else //otherwise
                childs.Insert(position, chord); //insert element reference at the position to the list

            //append the object to the group
            group.appendChild(chord.Draw());

            return "SUCCESS";
        }

        this.RemoveAt = function(position) {
            if(position < 0 || position >= chords.Count()) return "ERROR_POSITION_OUT_OF_BOUNDS";

            var removedChord = chords.GetItem(position);    //get the chord handler from the list
            group.removeChild(removedChord.Draw());  //remove it from the line
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
    }

    this.ScoreLine = function(lineLength, properties) {
        //Creates a new score line passing the line length and the minimum measure length to be kept in a line, otherwise it will overflow

        var selfRef = this,

            group = document.createElementNS(xmlns, "g"),   //group to fit all the score members

            //for debug, not really necessary due to group grows, but coodinates origin remains the same
            refRect = document.createElementNS(xmlns, "rect"),  //reference rectangle to be used as a fixed reference point
            header = document.createElementNS(xmlns, "g"),  //create the score header group, to hold the score elements
            linesDrawing = DrawScoreLines(lineLength),   //score lines draw
            measures = new List();    //ordered list to fit all the measures @ this score

        refRect.setAttribute("fill", "yellow");
        refRect.setAttribute("height", 20); 
        refRect.setAttribute("width", 20);    

        group.appendChild(refRect); //append debug square

        group.appendChild(linesDrawing);

        group.appendChild(header);  //append score header
        setScoreProperties(properties); //set the score properties

        this.Draw = function() { return group; }

        this.MoveTo = function(x, y) {
            SetTransform(group, { translate: [x, y] });
        }

        //Get the current width of this score (must be appended to work)
        this.GetWidth = function() { 
            return group.getBBox().width; 
        }

        this.ForEach = function(action) {
            measures.ForEach(action);//iterate thru all the measures and apply the specified action to it
        }

        //Function to update the spaces and dimensions of the measures inside the score
        this.UpdateDimensions = function(minLength) {
            //Get total fixed elements length
            var headerBox = GetBBox(header),
                elemTotalLength = headerBox.width + headerBox.x,    //fixed elements length
                denSum = 0; //denominators sum

            measures.ForEach(function(measure) { 
                elemTotalLength += 20;  //sum the measure left margin   
                measure.ForEach(function(chord){
                    //PROBABLY IN THE FUTURE WILL HAVE TO VERIFY THE DENOMINATOR FOR ELEM TOTAL LENGTH FOR THE FINAL FINISH OF THE NOTES
                    denSum += 1 / chord.GetDenominator();   //get denominator value
                    elemTotalLength += chord.GetWidth();    //get chord length
                });
            });

            //set measures denominators unit size
            var unitSize = (lineLength - elemTotalLength) / denSum,
            //update measure positions
                nextPos = headerBox.width + headerBox.x,

                minFlag = false;    

            //update the denominator unit size for every measure
            measures.ForEach(function(measure) {   
                measure.UpdateGaps(unitSize);   //update the gaps of the chords at the measure
                measure.MoveTo(nextPos, 0); //move the measure to the next position available
                nextPos += measure.GetWidth();  //generate the next position
            
            //if the measure has notes ands current measure width is less than the min width,
                if(measure.Count() > 0 && measure.GetWidth() < minLength)  
                    minFlag = true; //set flag
            });

            
            return minFlag;
        }

        function setScoreProperties(props) {
            var nextPos = 10;

            if(props.GClef) {
                var clef = DrawScoreLinesElement(ScoreElement.GClef);
                header.appendChild(clef);
                SetTransform(clef, { translate: [22 + nextPos, 13] });
                nextPos += GetBBox(clef).width + 10;
            }
            
            if(props.TimeSig44) {
                var timeSig = DrawScoreLinesElement(ScoreElement.TimeSig44);
                header.appendChild(timeSig);
                SetTransform(timeSig, { translate: [nextPos, 0] });
                nextPos += GetBBox(timeSig).width + 10;
            }

            //DEBUG RECT MARK
            //var finalMargin = document.createElementNS(xmlns, "rect");
            //finalMargin.setAttribute("fill", "#333");
            //finalMargin.setAttribute("height", 10); 
            //finalMargin.setAttribute("width", 10);
            //header.appendChild(finalMargin);
            //SetTransform(finalMargin, { translate: [nextPos, 0] });    
        }

        this.Find = function(measure) {
            return measures.Find(measure);
        }

        this.Count = function() {
            return measures.Count();
        }

        this.InsertMeasure = function(measure, position) {
            //if the measure object already exists at this measure, return a message
            if(measures.Find(measure) != -1) return "MEASURE_ALREADY_ON_LINE"; 
            //implement timing verification in the future

            //Object validation successful

            //if the type of the position variable is different from number or the position is bigger or the size of the list
            if(typeof position != "number" || position >= measures.Count())    
                measures.Add(measure);    //insert with add method at the last position
            else //otherwise
                measures.Insert(position, measure); //insert element reference at the position to the list

            //append the object to the group
            group.appendChild(measure.Draw());

            return "SUCCESS";
        }

        this.RemoveAt = function(position) {
            if(position < 0 || position >= measures.Count()) return "ERROR_POSITION_OUT_OF_BOUNDS";

            var removedMeasure = measures.GetItem(position);    //get the measure handler from the list
            group.removeChild(removedMeasure.Draw());  //remove it from the line
            measures.RemoveAt(position);    //remove the measure from the list

            return removedMeasure;
        }

        this.RemoveMeasure = function(measure) {
            var position = measures.Find(measure);
            if(position == -1) 
                return "ERROR_MEASURE_NOT_FOUND";
            else 
                return selfRef.RemoveAt(position);
        }
    }


    //General score that will handle multiple scores, lines and add the drawings finish and attributes
    this.Score = function(lineLength, minLength, properties) {
        var selfRef = this, //self reference

            group = document.createElementNS(xmlns, "g"),   //group to keep the visual objects
            lines = new List(), //list to organize the score lines
            refRect = document.createElementNS(xmlns, "rect");  //reference rectangle to be used as a fixed reference point

        refRect.setAttribute("fill", "#050");
        refRect.setAttribute("height", 30); 
        refRect.setAttribute("width", 30);

        group.appendChild(refRect); //append debug square  

        //Add the first line
        createLine({ GClef: true, TimeSig44: true});


        this.Draw = function() { return group; }

        this.MoveTo = function(x, y) {
            SetTransform(group, { translate: [x, y] });
        }

        function createLine(prop) {
            var newLine = new ScoreBeta.ScoreLine(1500, prop);   //create the line
            lines.Add(newLine); //add the line to the lines list
            group.appendChild(newLine.Draw()); //append new line to the group
            return newLine;
        }


        this.InsertMeasure = function(measure, position) {
            
            //VERIFY WHETHER THIS MEASURE IS AT SOME SCORE LINE
            lines.ForEach(function(line) {
                if(line.Find(measure) != -1)
                    return "ERROR_MEASURE_ALREADY_ON_SCORE";
            });

            //if the type of the position variable is different from number(invalid), add it at the end of the score
            if(typeof position != "number") {
                //add it to the last line
                return lines.GetItem(lines.Count() -1).InsertMeasure(measure);    
            } else {//otherwise
                //find which line the specified position is

                var posSum = 0, 
                    linesCount = lines.Count();

                for(var i = 0; i < linesCount; i++) {
                    var line = lines.GetItem(i);    //get the current line object

                    var measuresCount = line.Count(); //get the number of measures at this line
                    
                    //Covers the bug in case measures count is 0 and the position specified is 0 too
                    if(measuresCount == 0 && position == 0)
                        return line.InsertMeasure(measure); //insert it

                    if(posSum + measuresCount - 1 >= position) {    //if the posSum minus 1 is greater or equal than position, we found the line
                        var linePos = position - posSum;    //get the line position
                        return line.InsertMeasure(measure, linePos);   //insert the measure at the current line
                    }//if not

                    posSum += measuresCount;    //sum the current line size to the position sum
                }

                return "ERROR_SCOREPOS_OUT_OF_BOUNDS";
            }
        } 

        this.RemoveAt = function(position) {
            //get measures qty @ the score
            var measuresQty = 0;
            lines.ForEach(function(line) {
                measuresQty += line.Count();
            });

            if(position >= measuresQty)
                return "ERROR_REM_SCOREPOS_OUT_OF_BOUNDS";

            //if the position is valid, find which line it is at

            var posSum = 0, 
                linesCount = lines.Count();

            for(var i = 0; i < linesCount; i++) {
                var line = lines.GetItem(i);    //get the current line object

                var measuresCount = line.Count(); //get the number of measures at this line
                    
                //if the position is greater than the absolute position of the last member of this line
                if(position >= posSum + measuresCount) {    
                    posSum += measuresCount;    //increase the absolute pointer (posSum) with the line length
                    continue;   //proceed next iteration
                }

                var removedMeasure = line.RemoveAt(position - posSum);    //remove the measure from the list
                return removedMeasure;
            }
        }

        this.RemoveMeasure = function(measure) {
            //find the measure
            var linesCount = lines.Count(),
                pos, 
                line;

            for(var i = 0; i < linesCount; i++) {
                line = lines.GetItem(i);

                pos = line.Find(measure);

                if(pos != -1)
                    return line.RemoveAt(pos);
            }

            return "ERROR_MEASURE_NOT_FOUND";
        }

        //function to organize the score elements sizes, creation of new lines, etc
        this.Organize = function() {
            var MIN_TOP_MARGIN = 10; //min value for a top margin for the scores

            //iterate thru all lines and update their dimensions
            for(var i = 0; i < lines.Count(); i++) {
                var line = lines.GetItem(i),
                    lastMeasures = [];

                //while the update dimensions min width flag keep set, 
                while(line.UpdateDimensions(300)) {
                    //remove the last measure
                    lastMeasures.push(line.RemoveAt(line.Count() -1));
                    //console.log(lastMeasures);
                }

                //if there is removed lines, add them to the next line,
                if(lastMeasures.length > 0) {
                    //if the current line is the last line, create a new one
                    if(lines.Count() - 1 == i)
                        createLine({ GClef: true });

                    var nextLine = lines.GetItem(i + 1);  //get the next line ref

                    //iterate thru the removed measures
                    for(var j = 0; j < lastMeasures.length; j++) {
                        nextLine.InsertMeasure(lastMeasures[j], 0); //add them to the first position at the new line
                    }
                }
                
            }

            //KEEP IMPROVING SYSTEM FOR NEW LINES CREATION AND DELETATION

            //iterate thry all the lines and organize their vertical positions
            var nextYCoord = MIN_TOP_MARGIN;
            for(var i = 0; i < lines.Count(); i++) {
                var line = lines.GetItem(i),    //get the current line ref
                    currBBox = GetBBox(lines.GetItem(i).Draw());   //get current object bbox

                //move the score line to the new coord compensing negative coordinates within it and rounding final value up
                line.MoveTo(0, Math.ceil(nextYCoord - currBBox.y));    

                //get the next position summing the actual coordinate plus the current object height
                nextYCoord += currBBox.height + MIN_TOP_MARGIN;
            }
        }
    }
}

function ArrayLength(array) {
    var length = 0;

    for(var i = 0; i < array.length; i++)
        if(array[i] != undefined)
            length++;

    return length;
}

function GetBBox(element) {
    var bBox = element.getBBox();   //get element bBox
    if(bBox.x || bBox.y || bBox.width || bBox.height) { //if any of the members are valid, 
        return bBox;    //return the gotten bbox cause it is valid
    }
        
    //if it is not valid,
    var elementParent = element.parentElement;   //got the element parent if any
    document.documentElement.appendChild(element);  //append element to a valid aux parent to be able to get its bbox
    bBox = element.getBBox();   //get element bBox
    if(elementParent) //if the element had a parent
        elementParent.appendChild(element);    //put the element back to its parent
    else //if not, 
        document.documentElement.removeChild(element);  //remove element from its aux parent          
        
    return bBox;
}








function createScoreLineHeader(properties){
    var lineHeaderContainer = $Aria.CreateContainer({ height: lineHeight });    //header container  
    lineHeaderContainer.SetBackgroundColor("rgba(0,128,0,.2)");
    
    if(properties.GClef) {
        lineHeaderContainer.AddElement(createSpace(10));    //header margin
        var clef = $Aria.Parse(DrawScoreLinesElement(ScoreElement.GClef));
        lineHeaderContainer.AddElement(clef);
        clef.MoveTo(null, clef.GetY() + 4);
    }

    if(properties.TimeSig44) {
        lineHeaderContainer.AddElement(createSpace(10));
        lineHeaderContainer.AddElement($Aria.Parse(DrawScoreLinesElement(ScoreElement.TimeSig44)));
    }

    lineHeaderContainer.AddElement(createSpace(30));

    lineHeaderContainer.toString = function() { return "LineHeaderContainer"; }

    return lineHeaderContainer;
}




function Create2SymbolsSpace() {
    var symbolsGroup = document.createElementNS(xmlns, "g");

    var space = document.createElementNS(xmlns, "rect");  //create new line
    space.setAttribute("width", 30);
    space.setAttribute("height", 300);
    space.setAttribute("stroke", "#000");
    space.setAttribute("fill", "rgba(0,0,0,.2)");
    //space.setAttribute("fill", "none");
    space.setAttribute("stroke-width", 1);
    symbolsGroup.appendChild(space);

    var mark1 = mark2();
    symbolsGroup.appendChild(mark1);


    //for (var i = 0; i < 19; i++) {
        //symbolsGroup.appendChild(mark(i*15 + 19.5));
    //}

    //for (var j = 0; j < 40; j++)
      //  symbolsGroup.appendChild(line(j * 7.5 + 3.75));
    
    symbolsGroup.addEventListener("mousemove", function (e) {
        for (var i = 0; i < e.path.length; i++) {
            if (e.path[i].scoreY) {
                var position = e.y - e.path[i].scoreY;
                var pos = getPosition(300, 7.5, 3.75, position);
                //console.log("Pos: " + pos);
                mark1.setAttribute("cy", pos);
                break;
            }
        }

    }, true);  //false to act first in target than the parent

    symbolsGroup.addEventListener("mouseover", function (e) {
        mark1.style.display = "block";
    }, true);  //false to act first in target than the parent

    symbolsGroup.addEventListener("mouseout", function (e) {
        mark1.style.display = "none";

    }, true);  //false to act first in target than the parent



    return symbolsGroup;
}

function getPosition(height, step, offset, value) {
    //Experimental calc to get the center of the area where the mouse is over
    //height is the height of the total are to be explored
    //step is the size of each area
    //offset is where to begin collect values
    //value is the actual position inside the area of the mouse
    //log("Value: " + value);
    var i;
    for (i = offset + step; i < height - step; i += step)
        if (value < i)
            break;

    return i - step/2;
}

function line(y) {
    var line = document.createElementNS(xmlns, "line");
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    line.setAttribute("x1", 0);
    line.setAttribute("x2", 30);
    line.setAttribute("stroke", "blue");
    return line;
}

function mark(y) {
    var mark = document.createElementNS(xmlns, "rect");
    mark.setAttribute("transform", "translate(0 " + (y-7.5) + ")");
    mark.setAttribute("height", 6);
    mark.setAttribute("width", 30);
    mark.setAttribute("opacity", .5);
    mark.setAttribute("fill", "#000");
    return mark;
}

function mark2() {
    var mark = document.createElementNS(xmlns, "circle");
    //mark.setAttribute("transform", "translate(0 " + (y - 7.5) + ")");
    //mark.setAttribute("height", 6);
    //mark.setAttribute("width", 30);
    mark.setAttribute("opacity", .5);
    mark.setAttribute("fill", "#000");
    mark.setAttribute("r", "7.5");
    mark.setAttribute("cy", "7.5");
    mark.setAttribute("cx", "15");

    return mark;
}

//function to create spaces to be used 
function createSpace(length) {
    return $Aria.CreateRectangle(length, 10, "none");
}


/*function ScoreLine(lineLength, x, y) {
    var lineFull = false,   //flag to sinalize when this line is full  
        scoreLine = document.createElementNS(xmlns, "g"),
        clef,
        sig;
        
    scoreLine.setAttribute("transform","translate(" + x + " " + y +")");
    scoreLine.appendChild(DrawScoreLines(lineLength));
    
    this.SetClef = function(scoreClef) {
        switch(scoreClef) {
            case ScoreClef.G:
                clef = DrawScoreLinesElement(ScoreElement.GClef);
                clef.setAttribute("transform","translate(31 13)");
                scoreLine.appendChild(clef);
                break;
        }
    };
    
    this.SetSig = function(sigValue) {
        switch(44) {
            case sigValue:
                sig = DrawScoreLinesElement(ScoreElement.TimeSig44);
                sig.setAttribute("transform","translate(70 0)");
                scoreLine.appendChild(sig);
                break;
        }
    };
    

    
    this.AddElement = function() {
        
        
    }
    
    //Function to return the full line object created
    this.GetObj = function() { return scoreLine; }
    
    //function to update line elements whenever it is need
    function updateLine (){
        
        
        
    }
}*/
