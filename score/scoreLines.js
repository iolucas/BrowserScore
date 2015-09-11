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
        SCORE_TOP_MARGIN = 50; //min value for a top margin for the scores
  
    //group to place the notes
    this.Chord = function(properties) {
        var selfRef = this,

            notes = [], //Array to set the notes at this chord

            denominator = properties.denominator,    //chord general denominator
            clef = properties.clef, //of this chord for note position stuff
            chordGroup = document.createElementNS(xmlns, "g"),  //general chord group to put its elements
            noteGroup = document.createElementNS(xmlns, "g"),   //group to add note related elements
            accidentGroup = document.createElementNS(xmlns, "g"),   //accident group to place accident related elements
            rest = DrawRest(denominator),  //get the rest element draw
            flag = DrawNoteFlag(denominator),   //get the note flag 
            auxLines = document.createElementNS(xmlns, "path"), //path to receive the aux lines to be draw
            stem =  document.createElementNS(xmlns, "line"),    //chord stem to be placed

        //for debug, not really necessary due to group grows, but coodinates origin remains the same
            refRect = document.createElementNS(xmlns, "rect"),  //reference rectangle to be used as a fixed reference point

            POS0_NOTE,  //variable to store the position 0 (first space from up) note for correct positioning
            POS0_OCTAVE,  //variable to store the position 0 (first space from up) octave for correct positioning

            LINE_LOW_POS = -2, //* OFFSET,   //min coordinate where a aux line is not necessary
            LINE_HIGH_POS = 8, // * OFFSET,  //max coordinate where a aux line is not necessary

            LINE_OFFSET = 7.5,   //const offset of each note at the visual object

            //variable to signalize whether a note has been added or removed from this chord and it was not yet organized
            chordModified = false;   

        refRect.setAttribute("fill", "rgba(0,0,255,.5)");
        refRect.setAttribute("height", 10); 
        refRect.setAttribute("width", 10);

        auxLines.setAttribute("stroke", "#000");    //set the aux lines color 

        stem.setAttribute("stroke", "#000");    //set the stem line color 
        stem.setAttribute("stroke-width", "2");    //set the stem line color

        //append note group and accident group to the main chord group
        chordGroup.appendChild(refRect);
        chordGroup.appendChild(accidentGroup);
        chordGroup.appendChild(noteGroup);

        //Append necessary chord visual objects to the chord group
        noteGroup.appendChild(auxLines);
        noteGroup.appendChild(stem);
        noteGroup.appendChild(rest);

        //DEBUG PURPOSES
        if(!clef)
            clef = 'G';

        //Set POS0_NOTE and POS0_OCTAVE according to the clef
        switch(clef) {

            case 'G':
                POS0_NOTE = 'E'.charCodeAt(0);
                POS0_OCTAVE = 5; 
                break;

            /*case 'F':

                break;*/

            default:
                throw "INVALID_CHORD_CLEF_SET: " + clef;
        }

        //--------------------------------------------------------------------------------
        //----------------------- PUBLIC METHODS -----------------------------------------
        //--------------------------------------------------------------------------------

        //Function to return the appendble object of this chord
        this.Draw = function() { 
            return chordGroup; 
        }

        //Function to move this chord object with absolute positions
        this.MoveTo = function(x, y) {
            //compense negative values of the group with bbox due to offset adjacent notes or accidents notation
            SetTransform(chordGroup, { translate: [x - GetBBox(chordGroup).x, y] });
        }

        //Function to get the current number of notes on this chord
        this.CountNotes = function() {
            return ArrayLength(notes);
        }

        //Function to get the Denominator of this chord
        this.GetDenominator = function() { 
            return denominator; 
        }

        //Function to set a new denominator. TO BE IMPLEMENTED
        this.SetDenominator = function(denominator) {
            throw "SetDenominator function still to be implemented.";
        }

        //Function to get the current width of this chord
        this.GetWidth = function() {
            return GetBBox(chordGroup).width;    
        }

        //Function to iterate thru all notes obj on this chord
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
            noteGroup.appendChild(note.noteDraw);   //append the note drawing to the group

            //note.noteDraw.setAttribute("opacity", ".5");

            if(note.accident) {   //if the note has an accident, 
                note.accidentDraw = DrawNoteAtt(note.accident); //get its draw
                accidentGroup.appendChild(note.accidentDraw);   //append the accident drawing to the group if some
            }

            notes.push(note);   //add the new note object to the notes array

            chordModified = true;

            return "INSERT_SUCCESS";
        }

        this.AddNoteCollection = function(noteCollection) {
            var result = [];
            for(var i = 0; i < noteCollection.length; i++)
                result.push(selfRef.AddNote(noteCollection[i]));

            return result;
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

            chordModified = true;

            return "REMOVE_SUCCESSFUL";
        }        

        //Function to be called when you want to update the chord object positions 
        this.Organize = function() {
            if(!chordModified)  //if the chord hasn't be modified
                return; //do nothing and return

            //If there is no more notes on this chord
            if(ArrayLength(notes) == 0) {
                chordGroup.appendChild(rest);    //show the rest element
                setStemLine();  //clear chord stem line
                setChordFlag();
                setAuxLines(); //remove all the aux lines
                setChordPositions();    //organize chord elements positions
                return; //do nothing else and return
            }

            if(rest.parentElement)  //if the rest element is attached, 
                rest.parentElement.removeChild(rest);  //detach it

            
            //DETECT THE LOWEST AND THE HIGHEST NOTES COORDINATES FOR THIS CHORD
            var lowValue = null,   //var to store the lowest value for y position
                highValue = null,   //var to store the higher position for aux lines
                farValue = null,    //var to store the most far value from the middle, between lowest and highest
                downStemFlag;   //flag to whether the stem is down or not. If false, this chord has a up stem

            for(var i = 0; i < notes.length; i++) { //iterate thru all the notes
                if(notes[i]) {   //if the note is valid

                    //get the element y coordinate based on its values for note and octave
                    var yCoord = -((notes[i].note.charCodeAt(0) - POS0_NOTE) + (notes[i].octave - POS0_OCTAVE) * 7); 
                    notes[i].yCoord = yCoord;   //register the y coord at the note element for note placement later

                    //if the current y position is low than the actual lowest value
                    if(lowValue == null || yCoord < lowValue)   
                        lowValue = yCoord;  //update the lowest value

                    if(highValue == null || yCoord > highValue)   
                        highValue = yCoord;  //update the lowest value
                }
            }

            //get the most far value from the middle
            farValue = (Math.abs(lowValue - 3) < Math.abs(highValue - 3)) ? highValue : lowValue;

            //Detect whether the stem is down or up based on the most far value
            downStemFlag = farValue <= 3;
            
            //put all the notes on their right positions
            var adjCoord = setNotesPositions(downStemFlag, lowValue); 

            //Must set the chord stem with the extreme coordinates
            var finalStemCoord = setStemLine(downStemFlag, lowValue, highValue);

            //set chord flag based on its denominator
            setChordFlag(downStemFlag, finalStemCoord);

            //set aux lines if needed
            setAuxLines(downStemFlag, lowValue, highValue, adjCoord[0], adjCoord[1]);

            //set the accident symbols places (need the low value to generate the ordered list)
            setAccidentPositions(lowValue);

            //set chord elements (accident group and notes group) correct places
            setChordPositions(); 

            chordModified = false;  //clear the chord modified flag  
        }

        //--------------------------------------------------------------------------------
        //----------------------- PRIVATE METHODS ----------------------------------------
        //--------------------------------------------------------------------------------

        function setChordPositions() {
            //gets chord elements bboxes
            var accidentBox = GetBBox(accidentGroup),
                noteBox = GetBBox(noteGroup);

            //place accident group at 0,0 abs pos
            SetTransform(accidentGroup, { translate: [-accidentBox.x, 0] });

            //place note imediatelly after the accident group
            var noteGroupXCoord = accidentBox.width > 0 ? accidentBox.width - noteBox.x + 1 : 0;
            SetTransform(noteGroup, { translate: [noteGroupXCoord, 0] });
        }

        function setAccidentPositions(lowValue) {
            var positionList = []; //List to keep the elements for adjacent verification 

            for(var j = 0; j < notes.length; j++) { //iterate thru all the notes
                if(notes[j]) {   //if the note is valid  
                    //get the current pos offseted by the lowest value to ensure positive values
                    var currPos = notes[j].yCoord - lowValue;   
                    positionList[currPos] = notes[j];    //put the element at the index with same value than y coord offseted
                }
            }

            var currNote,
                nextX = 0,
                lowerCoord = null,
                accidentBox,
                placeColumns = [],
                lastWidth = 0,
                currColX = 0;

            for(var k = 0; k < positionList.length; k++) {
                currNote = positionList[k];    

                //if the current item is invalid or this note has no accident
                if(currNote == undefined || !currNote.accidentDraw)    
                    continue;   //proceed next iterations

                //get the accident symbol bbox
                accidentBox = GetBBox(currNote.accidentDraw);
                
                var accYCoord = currNote.yCoord * LINE_OFFSET,  //get the y coord
                    accTopCoord = accidentBox.y + accYCoord,    //get this accid obj top coord

                    //get the x coord
                    accXCoord = null;

                for(var columnIndex = 0; columnIndex < placeColumns.length; columnIndex++) {
                    //if the current top coord is less than the column bottom coord
                    if(accTopCoord < placeColumns[columnIndex].bottom) 
                        continue;   //proceed the next iteration

                    /*console.log(columnIndex);
                    console.log(placeColumns[columnIndex].x);
                    console.log(placeColumns);*/

                    //set the x coordinate as the column x
                    accXCoord = placeColumns[columnIndex].x;

                    //update this column bottom value 
                    placeColumns[columnIndex].bottom = accidentBox.y + accidentBox.height + accYCoord;
                    
                    console.log(placeColumns[columnIndex].x);
                    console.log(accXCoord);
                    console.log("-------------------------------------------------------");
                    


                    break;  //exit the iteration
                }

                //if no place where found
                if(accXCoord == null) {
                    placeColumns.push({
                        bottom: accidentBox.y + accidentBox.height + accYCoord,
                        x: currColX
                    });

                    accXCoord = currColX;

                    currColX -= accidentBox.width + 2;
                }


                //console.log(currNote.yCoord * LINE_OFFSET);
                //console.log(accidentBox.y + accidentBox.width);
                //console.log(accidentBox.y + accidentBox.width + currNote.yCoord * LINE_OFFSET);
/*
                if(lowerCoord == null || accidentBox.y + currNote.yCoord * LINE_OFFSET > lowerCoord) {
                    lowerCoord = accidentBox.y + accidentBox.width + currNote.yCoord * LINE_OFFSET;
                    nextX = 0;
                }*/

                //console.log("bottom before: " + lowerCoord);
                //console.log("top current: " + (accidentBox.y + currNote.yCoord * LINE_OFFSET));

                SetTransform(currNote.accidentDraw, { translate: [accXCoord, accYCoord] });
                //SetTransform(debRect(accidentBox), { translate: [accXCoord, accYCoord] });

                //lowerCoord = accidentBox.y + accidentBox.height + currNote.yCoord * LINE_OFFSET;

                //nextX -= accidentBox.width + 1;
            }
        }

        function debRect(bbox) {
            var debRect = document.createElementNS(xmlns, "rect");
            debRect.setAttribute("stroke", "blue");
            debRect.setAttribute("stroke-width", 1); 
            debRect.setAttribute("x", bbox.x);     
            debRect.setAttribute("y", bbox.y);
            debRect.setAttribute("fill", "none"); 
            debRect.setAttribute("width", bbox.width); 
            debRect.setAttribute("height", bbox.height); 
            accidentGroup.appendChild(debRect);

            return debRect;
        }

        //Function to place the notes positions, detecting adjacent notes colision
        function setNotesPositions(downStemFlag, lowValue) {
            //ADJACENT NOTES DETECTION
            
            //Must put the notes in an ordered array by its coordinates to detect adjacent notes
            var positionList = []; //List to keep the elements for adjacent verification 

            for(var j = 0; j < notes.length; j++) { //iterate thru all the notes
                if(notes[j]) {   //if the note is valid  
                    //get the current pos offseted by the lowest value to ensure positive values
                    var currPos = notes[j].yCoord - lowValue;   
                    positionList[currPos] = notes[j];    //put the element at the index with same value than y coord offseted
                }
            }

            //Since stem up and down influence in adjacent notes offset, iteration values must be set thru the flag value
            //flag to signalize when a right before note were valid to detect adjacent
            var prevValidNote = false,
                posListInitValue = downStemFlag ? 0 : positionList.length + 1, //value to init the iteration of the position list
                posListFinalValue = downStemFlag ? positionList.length : -1,    //value to stop and exit the iteration of the position list
                posListIncValue = downStemFlag ? 1 : -1,    //value to increase the list on each iteration

                lowAdjValue = null, //var to store the lowest adjacent note coordinate value
                highAdjValue = null;    //var to store the highest adjacent note coordinate value


            for(var listIndex = posListInitValue ;; listIndex += posListIncValue) {
                if(listIndex == posListFinalValue)  //if the l value has reched the final value
                    break;  //stop and exit the iteration

                if(!positionList[listIndex]) {  //if position not valid
                    prevValidNote = false;  //reset the prev valid note flag
                    continue;   //proceed the next iteration
                }

                var currNote = positionList[listIndex], //get the curr note reference
                    finalYCoord = currNote.yCoord * LINE_OFFSET,    //set the note Y position based on its coord and general offset factor
                    finalXCoord = 0;    //set standard X pos as 0

                //if the immediatelly prev note were valid, means adjacent note
                if(prevValidNote) {

                    if(!lowAdjValue || currNote.yCoord < lowAdjValue)
                        lowAdjValue = currNote.yCoord;

                    if(!highAdjValue || currNote.yCoord > highAdjValue)
                        highAdjValue = currNote.yCoord;

                    //xCoord must be offseted
                    //hard code note x offset for adjacent
                    finalXCoord = denominator == 1 ? 21 : 17;
                    //We must do this little hack since stem order chooses whether offset will be right or left
                    finalXCoord *= -posListIncValue;    //and the iteration inc has the inverted logic for this
                    //reset the prev valid note cause it is not necessary for the next one to move since this one moved
                    prevValidNote = false;  
                } else //otherwise
                    prevValidNote = true;   //just set the prev valid not to move the next one if it is valid

                //move the current note to its right position
                SetTransform(currNote.noteDraw, { translate: [finalXCoord, finalYCoord] });
            }

            return [lowAdjValue, highAdjValue]; 
        }

        function setStemLine(downStemFlag, lowValue, highValue) {
            if(downStemFlag == undefined || denominator < 2 || ArrayLength(notes) == 0) {  //if the chord den is less than 2,
                setStemLineObj();   //void call to clear any stem line
                return; //do not and proceed the next chord (return)
            }

            var xCoord,
                startStemCoord, //value of the final coord of the stem line
                finalStemCoord, //value of the final coord of the stem line
                additionalStemLength = 0;    //variable to add the additional length to the stem when more than two flags is needed
            
            //if we got more than 2 flags at the note/chord (denominator >= 32)    
            if(denominator >= 32) {
                additionalStemLength = 2;    //aditional length receives 2
                for(var i = 64 ;; i *= 2) { //increase aux var to verify how much additional space to add
                    if(denominator < i || i > 1000) //safety condition
                        break;

                    additionalStemLength += 2;
                }
            }   

            if(downStemFlag) {  //if the stem starts from the lowest coord
                //x coord for down stem
                xCoord = 1; 
                //start coord for stem, offseted the note drawing to fit
                startStemCoord = lowValue * 7.5 + 10;  
                //get the final coord for stem based on the high coordinate
                finalStemCoord = (highValue + 7) * LINE_OFFSET + 8;
                //Check if the end coord pass the middle line of the score, if not, extend it to the middle line
                finalStemCoord = (finalStemCoord < (4 * LINE_OFFSET)) ? 4 * LINE_OFFSET : finalStemCoord;
                //add aditional length for up to two flags
                finalStemCoord += additionalStemLength * LINE_OFFSET;
            } else {
                //x coord for up stem
                xCoord = 17;
                //start coord for stem, offseted the note drawing to fit
                startStemCoord = highValue * 7.5 + 5;
                //get the final coord for stem based on the high coordinate
                finalStemCoord = (lowValue - 7) * LINE_OFFSET + 7;
                //Check if the end coord pass the middle line of the score, if not, extend it to the middle line
                finalStemCoord = (finalStemCoord > (4 * LINE_OFFSET)) ? 4 * LINE_OFFSET : finalStemCoord;
                //add aditional length for up to two flags
                finalStemCoord -= additionalStemLength * LINE_OFFSET;
            }
            //set the chord stem
            setStemLineObj(xCoord, startStemCoord, finalStemCoord);

            return finalStemCoord;  //return the final stem coord to be used for place the note flag
        }

        function setStemLineObj(x, yStart, yEnd) {
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

        function setChordFlag(downStemFlag, finalStemCoord) {
            //if no arguments are supplied, or denominator greater than 8, clear the flag and return
            if(downStemFlag == undefined || denominator < 8) { 
                if(flag.parentElement)  //if the flag element is appended
                    flag.parentElement.removeChild(flag);   //remove it
                    return; //do nothing else and return
            }   

            noteGroup.appendChild(flag);

            if(downStemFlag) {
                SetTransform(flag, { translate: [1, finalStemCoord + 1], scale: [1, -1]});
            } else {
                SetTransform(flag, { translate: [17, finalStemCoord - 1] });
            }
        }

        //function to set the aux lines for the chords
        function setAuxLines(downStemFlag, lowValue, highValue, lowAdjValue, highAdjValue) {
            if(downStemFlag == undefined) { //if the first attribute is not passed
                auxLines.removeAttribute("d");   //clear all aux lines
                return; //do nothing else and return
            }

            var dAtt = "",  //path trail for the aux lines objects
                lineStartCoord,
                lineEndCoord;

            if(!lowAdjValue)    //if the low adj value is not valid
                lowAdjValue = 0;    //put it as 0

            if(!highAdjValue)   //if the high adj value is not valid
                highAdjValue = 0;   //put it as 0

            if(downStemFlag) {  //if adj notes are on the left

                //if the coordinate overflow the score lines limits, got to draw auxiliar lines

                if(lowValue < LINE_LOW_POS) {  //if the score over flow thru the upper part                                     

                    for(var lineYCoord = LINE_LOW_POS; lineYCoord > lowValue; lineYCoord -= 2) {
                        if(lowAdjValue < lineYCoord) {
                            lineStartCoord = denominator == 1 ? -25 : -21;
                            lineEndCoord = denominator == 1 ? 53 : 43;
                        } else {
                            lineStartCoord = denominator == 1 ? -4 : -4;
                            lineEndCoord = denominator == 1 ? 32 : 26;
                        }

                        dAtt += "M" + lineStartCoord + ", " + lineYCoord * LINE_OFFSET + "l0,0," + lineEndCoord + ",0";
                    }
                } 

                if(highValue > LINE_HIGH_POS) {  //if the score over flow thru the lower part

                    for(var lineYCoord = LINE_HIGH_POS + 2; lineYCoord <= highValue + 1; lineYCoord += 2) {
                        if(highAdjValue + 1 >= lineYCoord) {
                            lineStartCoord = denominator == 1 ? -25 : -21;
                            lineEndCoord = denominator == 1 ? 53 : 43;
                        } else {
                            lineStartCoord = denominator == 1 ? -4 : -4;
                            lineEndCoord = denominator == 1 ? 32 : 26;
                        }

                        dAtt += "M" + lineStartCoord + ", " + lineYCoord * LINE_OFFSET + "l0,0," + lineEndCoord + ",0";
                    }
                }            

            } else {    //if they are on the right

                //if the coordinate overflow the score lines limits, got to draw auxiliar lines

                lineStartCoord = -4;    //on this cause, this coordinate is aways fixed
                
                if(lowValue < LINE_LOW_POS) {  //if the score over flow thru the upper part                                     

                    for(var lineYCoord = LINE_LOW_POS; lineYCoord > lowValue; lineYCoord -= 2) {
                        if(lowAdjValue < lineYCoord)
                            lineEndCoord = denominator == 1 ? 53 : 43;
                        else
                            lineEndCoord = denominator == 1 ? 32 : 26;

                        dAtt += "M" + lineStartCoord + ", " + lineYCoord * LINE_OFFSET + "l0,0," + lineEndCoord + ",0";
                    }
                } 

                if(highValue > LINE_HIGH_POS) {  //if the score over flow thru the lower part
                                            
                    for(var lineYCoord = LINE_HIGH_POS + 2; lineYCoord <= highValue + 1; lineYCoord += 2) {
                        
                        if(highAdjValue + 1 >= lineYCoord)
                            lineEndCoord = denominator == 1 ? 54 : 43;
                        else
                            lineEndCoord = denominator == 1 ? 33 : 26;

                        dAtt += "M" + lineStartCoord + ", " + lineYCoord * LINE_OFFSET + "l0,0," + lineEndCoord + ",0";
                    }
                }  
            }

            auxLines.setAttribute("d", dAtt);   //set the path trail attribute (d) to the auxlines path
        }

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

                //Execute function to organize chord members
                chord.Organize();   

                //round the nextPos down for smooth look
                chord.MoveTo(Math.floor(nextPos), 0);  //move the chord X pos to current nextposition keeping the Y value
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
                chords.Insert(position, chord); //insert element reference at the position to the list

            //append the object to the group
            group.appendChild(chord.Draw());

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
