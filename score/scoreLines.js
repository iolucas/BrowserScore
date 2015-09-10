xmlns = "http://www.w3.org/2000/svg";
xlink = "http://www.w3.org/1999/xlink";  

//Pseudo Namespace to fit score objects classes
var ScoreBeta = new function() {
    ///create notes, chords, measures and score class to manage all the score features
    ///lets begin with the note element placing at a chord

        //----------------------------------------------------------------
        //MUST IDEALIZE HOW THE INTERFACE WILL LOOKS LIKE, HOW CONTENT WILL BE SPREAD
        //WHERE MOBILE FIRST FITS ON IT, IF ONLY NEWS OR INTERATIVE CONTENT TOO
        //CHORO IS COMING BACK, FOCUS ON IT


        //IMPLEMENT MODE FOR CHORD IT SELF DRAW SYMBOLS AND ITS ATTRIBUTES
        //CAUSE SOME ADJUSTS ARE DEPENDENTS TO OTHER NOTES
        //
        //CREATE METHOD TO HANDLE TO SCORES FOR G AND F CLEFS, 
        //FINALIZE METHOD TO PUT THE ACCIDENT SYMBOLS CORRECTLY
        //CREATE SYSTEM TO ADD THE NOTE FINISH, HASTES AND BANDEIROLAS
        //ADD MEASURES TYPES OF BARS
        //ADD TABLATURE SYSTEM
        //ADD POINTS AND LINKS TO NOTES
        //--------------------------------------------------------------  

    var MEASURE_LEFT_MARGIN = 20,  //constante value for the left margin of the measure
        SCORE_LINE_LENGTH = 1500,
        SCORE_LINE_LEFT_MARGIN = 10,
        SCORE_LINE_HEADER_MARGIN = 10,
        SCORE_TOP_MARGIN = 50, //min value for a top margin for the scores
        OFFSET = 7.5;   //const offset of each note at the visual object



    //group to place the notes
    this.Chord = function(properties) {
        var selfRef = this,

            notes = [], //Array to set the notes at this chord
            LINE_UPPER_LIMIT = (-2) * OFFSET,   //min coordinate where a aux line is not necessary
            LINE_LOWER_LIMIT = 8 * OFFSET,  //max coordinate where a aux line is not necessary
            LINE_LOW_POS = -2, //* OFFSET,   //min coordinate where a aux line is not necessary
            LINE_HIGH_POS = 8, // * OFFSET,  //max coordinate where a aux line is not necessary
            denominator = properties.denominator,    //chord general denominator
            group = document.createElementNS(xmlns, "g"),
            rest = DrawRest(denominator),  //get the rest element draw
            auxLines = document.createElementNS(xmlns, "path"), //path to receive the aux lines to be draw
            stem =  document.createElementNS(xmlns, "line"),    //chord stem to be placed

        //for debug, not really necessary due to group grows, but coodinates origin remains the same
            refRect = document.createElementNS(xmlns, "rect");  //reference rectangle to be used as a fixed reference point

        refRect.setAttribute("fill", "rgba(0,0,255,.5)");
        refRect.setAttribute("height", 10); 
        refRect.setAttribute("width", 10);

        auxLines.setAttribute("stroke", "#000");    //set the aux lines color 

        stem.setAttribute("stroke", "#000");    //set the stem line color 
        stem.setAttribute("stroke-width", "2");    //set the stem line color

        group.appendChild(auxLines);
        group.appendChild(stem);
        group.appendChild(refRect);
        group.appendChild(rest);

        this.Draw = function() { return group; }

        this.MoveTo = function(x, y) {
            //compense negative values of the group with bbox due to offset adjacent notes or accidents notation
            SetTransform(group, { translate: [x - GetBBox(group).x, y] });
        }

        this.Count = function() {
            return ArrayLength(notes);
        }

        this.GetWidth = function() {
            return GetBBox(group).width;    
        }

        //Function to iterate thru all elements
        this.ForEachNote = function(action) {
            for(var i = 0; i < notes.length; i++) //iterate thru all the notes
                if(notes[i])    //if the note is valid
                    action(notes[i]);   //apply the specified action to it
        }

        this.AddNote = function(note) {
            //if the note object already exists at this chord, return message
            if(notes.indexOf(note) != -1) return "NOTE_ALREADY_ON_CHORD_SAME_OBJ";

            if(!note.note || typeof note.octave != "number") return "INVALID_NOTE";

            //iterate thru all notes already placed to check if it is not equal to some of them
            for(var i = 0; i < notes.length; i++) { //iterate thru all the notes
                if(notes[i]) {   //if the note is valid
                    if((note.note == notes[i].note && note.octave == notes[i].octave))
                        return "NOTE_ALREADY_ON_CHORD_SAME_NOTE_AND_OCTAVE";
                }
            }

            note.noteDraw = DrawNote(denominator);  //get the note draw
            group.appendChild(note.noteDraw);   //append the note drawing to the group

            if(note.accident) {   //if the note has an accident, 
                note.accidentDraw = DrawNoteAtt(note.accident); //get its draw
                group.appendChild(note.accidentDraw);   //append the accident drawing to the group if some
            }

            notes.push(note);   //add the new note object to the notes array

            organizeNotes();    //execute routine to organize the notes @ the chord

            return "INSERT_SUCCESS";
        }

        this.DeleteNote = function(note) {
            //if the same note object is placed
            var noteIndex = notes.indexOf(note);

            if(noteIndex == -1) { //if the note object is not found,
                //iterate thru all notes already placed to check if it is equal to the passed
                for(var i = 0; i < notes.length; i++) { //iterate thru all the notes
                    if(notes[i]) {   //if the note is valid
                        //check if it is the same
                        if((note.note == notes[i].note && note.octave == notes[i].octave)) {
                            noteIndex = i;    //set the note index
                            note = notes[i];    //get the valid note reference for this note values
                            break;  //exit the iteration
                        }                            
                    }
                }
            }

            //if the note ind is still -1,
            if(noteIndex == -1)
                return "ERROR_REMOVE_NOTE_NOT_FOUND"; //if not return error
          
            if(note.noteDraw.parentElement) //if the noteDraw has any parent,
                note.noteDraw.parentElement.removeChild(note.noteDraw); //remove from it

            //if there is a note.accidentDraw and a parent to it
            if(note.accidentDraw && note.accidentDraw.parentElement)
                note.accidentDraw.parentElement.removeChild(note.accidentDraw);//remove from it

            delete notes[noteIndex];    //clear the note ref at the array

            organizeNotes();    //reorganize notes

            return "REMOVE_SUCCESSFUL";
        }

        //Private function to be called when the chord is edited to rearrange its elements 
        function organizeNotes() {
            //If there is no more notes on this chord
            if(ArrayLength(notes) == 0 && !rest.parentElement) {
                group.appendChild(rest);    //show the rest element
                setAuxLines(0,0,0); //remove all the aux lines
                return;
            }

            if(rest.parentElement)  //if the rest element is attached, 
                rest.parentElement.removeChild(rest);  //detach it

            //detect the lowest position value

            var lowValue = null,   //var to store the lowest value for y position
                highValue = null;   //var to store the higher position for aux lines

            for(var i = 0; i < notes.length; i++) { //iterate thru all the notes
                if(notes[i]) {   //if the note is valid

                    //get the element y coordinate based on its values for note and octave
                    var yCoord = -((notes[i].note.charCodeAt(0) - 69) + (notes[i].octave - 5) * 7); 
                    notes[i].yCoord = yCoord;   //register the y coord at the note element

                    //if the current y position is low than the actual lowest value
                    if(lowValue == null || yCoord < lowValue)   
                        lowValue = yCoord;  //update the lowest value

                    if(highValue == null || yCoord > highValue)   
                        highValue = yCoord;  //update the lowest value
                }
            }

            //Method to detect stem pointed down
            var downStem = (Math.abs(lowValue - 3) < Math.abs(highValue - 3)) ? false : true; 

            //generate the position list
            var positionList = []; //List to keep the elements for adjacent verification 

            for(var j = 0; j < notes.length; j++) { //iterate thru all the notes
                if(notes[j]) {   //if the note is valid
                    
                    //get the current pos offseted by the lowest value to ensure positive values
                    var currPos = notes[j].yCoord - lowValue;   

                    positionList[currPos] = notes[j];    //put the element at the index with same value than y coord
                }
            }

            //flag to signalize when a right before note were valid to detect adjacent
            var prevValidNote = false;

            if(downStem) {  //if downstem, notes must be left
                for(var k = 0; k < positionList.length; k++) { //iterate thru all the position queue
                    if(!positionList[k]) {  //if position not valid
                        prevValidNote = false;  //reset the prev valid note flag
                        continue;
                    }

                    var currNote = positionList[k], //get the curr note reference
                        finalYCoord = currNote.yCoord * OFFSET,
                        finalXCoord = 0;

                    //if the immediatelly prev note were valid
                    if(prevValidNote) { 
                        //xCoord must be offseted
                        finalXCoord = denominator == 1 ? 21 : -17; //hard code note x offset for adjacent (positive for den 1 since no stem)
                        //reset the prev valid note cause it is not necessary for the next one to move since this one moved
                        prevValidNote = false;  
                    } else //otherwise
                        prevValidNote = true;   //just set the prev valid not to move the next one if it is valid


                    //move the current note to its right position
                    SetTransform(currNote.noteDraw, { translate: [finalXCoord, finalYCoord] });
                }

            } else {    //if not, notes must be right

                for(var k = positionList.length + 1; k >= 0; k--) { //iterate thru all the position queue
                    if(!positionList[k]) {  //if position not valid
                        prevValidNote = false;  //reset the prev valid note flag
                        continue;
                    }

                    var currNote = positionList[k], //get the curr note reference
                        finalYCoord = currNote.yCoord * OFFSET,
                        finalXCoord = 0;

                    //if the immediatelly prev note were valid
                    if(prevValidNote) { 
                        //xCoord must be offseted
                        finalXCoord = denominator == 1 ? 21 : 17; //hard code note x offset for adjacent
                        //reset the prev valid note cause it is not necessary for the next one to move since this one moved
                        prevValidNote = false;  
                    } else //otherwise
                        prevValidNote = true;   //just set the prev valid not to move the next one if it is valid


                    //move the current note to its right position
                    SetTransform(currNote.noteDraw, { translate: [finalXCoord, finalYCoord] });
                }
            }

            //set aux lines if needed
            setAuxLines(-5, lowValue, highValue);
        }

        //function to set the aux lines for the chords
        function setAuxLines(xCoord, lowValue, highValue) {
                
            var dAtt = "";  //path trail for the aux lines objects
        
            //if the coordinate overflow the score lines limits, got to draw auxiliar lines
            if(lowValue < LINE_LOW_POS) {  //if the score over flow thru the upper part
                var singleLine = denominator == 1 ? "l0,0,35,0" : "l0,0,28,0";

                for(var lineYCoord = LINE_LOW_POS; lineYCoord > lowValue; lineYCoord -= 2)
                    dAtt += "M" + xCoord + ", " + lineYCoord * OFFSET + singleLine;
            } 

            if(highValue > LINE_HIGH_POS) {  //if the score over flow thru the lower part

                var singleLine = denominator == 1 ? "l0,0,35,0" : "l0,0,28,0";

                for(var lineYCoord = LINE_HIGH_POS + 2; lineYCoord <= highValue + 1; lineYCoord += 2)      
                    dAtt += "M" + xCoord + ", " + lineYCoord * OFFSET + singleLine;
            }

            auxLines.setAttribute("d", dAtt);   //set the path trail attribute (d) to the auxlines path
        }

        this.ChangeDenominator = function(denominator) {


        }

        this.SetStem = function(x, yStart, yEnd) {
            if(x == undefined || x == null) {   //if no X is passed, hide the stem and return
                stem.setAttribute("x1", 0);
                stem.setAttribute("x2", 0);
                stem.setAttribute("y1", 0);
                stem.setAttribute("y2", 0);
                return;
            }

            //otherwise, set its high and position

            stem.setAttribute("x1", x);
            stem.setAttribute("x2", x);
            stem.setAttribute("y1", yStart);
            stem.setAttribute("y2", yEnd);
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

        this.ForEachChord = function(action) {
            chords.ForEach(action);//iterate thru all the chords and apply the specified action to it
        }

        //Function to update the spaces of the measure and organize chords
        this.UpdateGaps = function(spaceUnitLength) {
            //the start position for the first chord
            var nextPos = MEASURE_LEFT_MARGIN;  //the measure left margin 
            chords.ForEach(function(chord) {
                //round the nextPos down for smooth look
                chord.MoveTo(Math.floor(nextPos), 0);  //move the chord X pos to current nextposition keeping the Y value
                nextPos += chord.GetWidth() + spaceUnitLength / chord.GetDenominator();    //get the gap value and add it to the next position
            });

            //put the end bar at the end of the measure
            SetTransform(measureEndBar, { translate: [nextPos, 0] });

            //Draw the stem lines to the notes
            chords.ForEach(function(chord) {
                if(chord.GetDenominator() < 2 || chord.Count() <= 0)  //if the chord den is less than 2,
                    return; //do not and proceed the next chord (return)

                var xCoord,
                    highCoord = null ,   //highest of the chord
                    lowCoord = null,    //lowest of the chord
                    downStem,   //flag to signelize whether we will draw a down stem or up stem
                    startStemCoord, //value of the final coord of the stem line
                    finalStemCoord; //value of the final coord of the stem line
                
                //get the lower and higher coordinates
                chord.ForEachNote(function(note) {
                    if(lowCoord == null || note.yCoord < lowCoord)
                        lowCoord = note.yCoord;
                    if(highCoord == null || note.yCoord > highCoord)
                        highCoord = note.yCoord;
                });

                //set the down stem flag based on data gathered
                if(lowCoord == highCoord)   //if there is only one note
                    downStem = lowCoord <= 3;   //choose stem orientation based on note place
                else //if not
                    //choose from the far way note from the middle
                    //(the only way for the if the high coord abs is bigger than low abs, it must be in the lower half)
                    downStem = (Math.abs(lowCoord - 3) < Math.abs(highCoord - 3)) ? false : true;   

                if(downStem) {  //if the stem starts from the lowest coord
                    //get the final coord for stem based on the high coordinate
                    finalStemCoord = (highCoord + 7) * OFFSET + 8;
                    //Check if the end coord pass the middle line of the score, if not, extend it to the middle line
                    finalStemCoord = (finalStemCoord < 4 * OFFSET) ? 4 * OFFSET : finalStemCoord;
                    //start coord for stem, offseted the note drawing to fit
                    startStemCoord = lowCoord * 7.5 + 10;  
                    //x coord for down stem
                    xCoord = 1; 
                } else {
                    //x coord for up stem
                    xCoord = 17;
                    //get the final coord for stem based on the high coordinate
                    finalStemCoord = (lowCoord - 7) * OFFSET + 7;
                    //Check if the end coord pass the middle line of the score, if not, extend it to the middle line
                    finalStemCoord = (finalStemCoord > 4 * OFFSET) ? 4 * OFFSET : finalStemCoord;
                    //start coord for stem, offseted the note drawing to fit
                    startStemCoord = highCoord * 7.5 + 5;
                }
                //set the chord stem
                chord.SetStem(xCoord, startStemCoord, finalStemCoord);
            });
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
                chords.Insert(position, chord); //insert element reference at the position to the list

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
                elemTotalLength += MEASURE_LEFT_MARGIN;  //sum the measure left margin   
                measure.ForEachChord(function(chord){
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
                measure.MoveTo(Math.floor(nextPos), 0); //move the measure to the next position available (round down for smooth look)
                nextPos += measure.GetWidth();  //generate the next position
            
            //if the measure has notes ands current measure width is less than the min width,
                if(measure.Count() > 0 && measure.GetWidth() < minLength)  
                    minFlag = true; //set flag
            });

            
            return minFlag;
        }

        function setScoreProperties(props) {

            var nextPos = SCORE_LINE_LEFT_MARGIN;

            if(props.GClef) {
                var clef = DrawScoreLinesElement(ScoreElement.GClef);
                header.appendChild(clef);
                SetTransform(clef, { translate: [22 + nextPos, 13] });
                nextPos += GetBBox(clef).width + SCORE_LINE_HEADER_MARGIN;
            }
            
            if(props.TimeSig44) {
                var timeSig = DrawScoreLinesElement(ScoreElement.TimeSig44);
                header.appendChild(timeSig);
                SetTransform(timeSig, { translate: [nextPos, 0] });
                nextPos += GetBBox(timeSig).width + SCORE_LINE_HEADER_MARGIN;
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
            var newLine = new ScoreBeta.ScoreLine(SCORE_LINE_LENGTH, prop);   //create the line
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
            var nextYCoord = SCORE_TOP_MARGIN;
            for(var i = 0; i < lines.Count(); i++) {
                var line = lines.GetItem(i),    //get the current line ref
                    currBBox = GetBBox(lines.GetItem(i).Draw());   //get current object bbox

                //move the score line to the new coord compensing negative coordinates within it and rounding final value up
                line.MoveTo(0, Math.ceil(nextYCoord - currBBox.y));    

                //get the next position summing the actual coordinate plus the current object height
                nextYCoord += currBBox.height + SCORE_TOP_MARGIN;
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
