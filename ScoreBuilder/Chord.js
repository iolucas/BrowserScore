//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();    

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- CHORD OBJECT -------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

ScoreBuilder.Chord = function(chordDen, dots) {

    var selfRef = this,
        chordDots = dots ? dots : 0,    //chord number of dots to rise the chord tempo
        chordDenominator;   //chord general denominator

    //Get the final chord denominator
    if(chordDots == 0)
        chordDenominator = chordDen;
    else if(chordDots == 1)
        chordDenominator = 1/(1/chordDen + 1/(chordDen*2));
    else if(chordDots == 2)
        chordDenominator = 1/(1/chordDen + 1/(chordDen*2) + 1/(chordDen*4));
    else
        throw "INVALID_DOTS_VALUE";

    var notes = [], //Array to set the notes at this chord

        chordGroup = document.createElementNS(xmlns, "g"),  //general chord group to put its elements
        noteGroup = document.createElementNS(xmlns, "g"),   //group to add note related elements
        accidentGroup = document.createElementNS(xmlns, "g"),   //accident group to place accident related elements
        auxLinesGroup = document.createElementNS(xmlns, "g"),   //aux lines group to place the necessary aux lines up and down
        //chordNameText = $G.createText("", 22, "times"),
        dotsGroup = $G.create("g"), //dots group to be used to set the notes dot that increase their times
        rest = DrawRest(chordDenominator),  //get the rest element draw
        flag = DrawNoteFlag(chordDenominator),   //get the note flag 
        auxLines = document.createElementNS(xmlns, "path"), //path to receive the aux lines to be draw
        stem =  document.createElementNS(xmlns, "line"),    //chord stem to be placed

        POS0_NOTE,  //variable to store the position 0 (first space from up) note for correct positioning
        POS0_OCTAVE,  //variable to store the position 0 (first space from up) octave for correct positioning

        LINE_LOW_POS = -2, //* OFFSET,   //min coordinate where a aux line is not necessary
        LINE_HIGH_POS = 8, // * OFFSET,  //max coordinate where a aux line is not necessary

        LINE_OFFSET = 7.5,   //const offset of each note at the visual object

        chordWidth = 0,  //variable to keep the current true width of the chord (discouting aux lines gaps)
        chordBackWidth = 0, //variable to keep the width before the reference (point 0,0)
        chordFrontWidth = 0,//variable to keep the width after the reference (point 0,0)

        lastClef = "",  //variable to hold the last clef used to detect clef change to avoid unnecessary organize chords

        //variable to signalize whether a note has been added or removed from this chord and it was not yet organized
        chordModified = true;   //must start as true to ensure init the curr width variable  

    //for debug, not really necessary due to group grows, but coodinates origin remains the same
    var refRect = document.createElementNS(xmlns, "rect");  //reference rectangle to be used as a fixed reference point
    refRect.setAttribute("fill", "rgba(0,0,255,.5)");
    refRect.setAttribute("height", 12); 
    refRect.setAttribute("width", 12);
    chordGroup.appendChild(refRect);

    
    /*var accRect = document.createElementNS(xmlns, "rect");
    accRect.setAttribute("fill", "orange");
    accRect.setAttribute("height", 10); 
    accRect.setAttribute("width", 10);
    accRect.translate(-10);
    accidentGroup.appendChild(accRect);*/


    auxLines.setAttribute("stroke", "#000");    //set the aux lines color 

    stem.setAttribute("stroke", "#000");    //set the stem line color 
    stem.setAttribute("stroke-width", "2");    //set the stem line color

    //append note group and accident group to the main chord group  
    chordGroup.appendChild(auxLinesGroup);     
    chordGroup.appendChild(accidentGroup);
    chordGroup.appendChild(noteGroup);
    chordGroup.appendChild(dotsGroup);
    //chordGroup.appendChild(chordNameText);  

    //append aux lines to the aux lines group
    auxLinesGroup.appendChild(auxLines);

    //Append necessary chord visual objects to the chord group   
    noteGroup.appendChild(stem);
    noteGroup.appendChild(rest);


    //NoteGroup debug rect
    /*var noteRect = $G.create("rect");
    noteRect.setAttribute("width", 5);
    noteRect.setAttribute("height", 5);
    noteRect.setAttribute("fill", "yellow");
    noteGroup.appendChild(noteRect);*/


    //--------------------------------------------------------------------------------
    //----------------------- PUBLIC METHODS -----------------------------------------
    //--------------------------------------------------------------------------------

    //Prop to hold this object name for measure objects use (TO BE ADDED IN THE FUTURE WHEN MEASURE ACCEPTS ELEMENTS)
    //this.objName = "chord";

    //Function to return the appendble object of this chord
    this.Draw = function() { 
        return chordGroup; 
    }

    //Function to get the current number of notes on this chord
    /*this.CountNotes = function() {
        return ArrayLength(notes);
    }*/

    //Function to get the current width of this chord
    this.GetWidth = function() {
        return chordWidth;
    }

    this.GetBackWidth = function() {
        return chordBackWidth;
    }

    this.GetFrontWidth = function() {
        return chordFrontWidth;
    }

    var _chordXCoord = 0;
    this.MoveX = function(xCoord) {
        chordGroup.translate(xCoord);
        _chordXCoord = xCoord;
    }

    this.GetXCoord = function() {
        return _chordXCoord;
    }

    this.IsRest = function() {
        return notes.getValidLength() == 0;
    }

    //Function to get the Denominator of this chord
    this.GetDenominator = function() { 
        return chordDenominator; 
    }

    //Function to set a new denominator. TO BE IMPLEMENTED
    this.SetDenominator = function(newChordDen) {
        throw "SetDenominator function still to be implemented.";
    }

    //Function to set the chord notation (free text)
    var _chordName = "";
    this.SetChordName = function(value) {
        _chordName = value;
        //chordNameText.SetText(chordName);
    }
    this.GetChordName = function() {
        return _chordName;
    }

    //Function to iterate thru all notes obj on this chord
    /*this.ForEachNote = function(action) {
        for(var i = 0; i < notes.length; i++) //iterate thru all the notes
            if(notes[i])    //if the note is valid
                action(notes[i]);   //apply the specified action to it
    }*/

    this.AddNote = function(note) {

        //if the note object already exists at this chord, return message
        if(notes.indexOf(note) != -1) return "NOTE_ALREADY_ON_CHORD_SAME_OBJ";

        if(!note.step || typeof note.octave != "number") return "INVALID_NOTE";

        if(note.step.charCodeAt(0) < 65 || note.step.charCodeAt(0) > 71)
            return "INVALID_NOTE_LETTER";                    

        //iterate thru all notes already placed to check if it is not equal to some of them
        for(var i = 0; i < notes.length; i++) { //iterate thru all the notes
            if(notes[i] == undefined) //if the note is not valid
                continue;   //proceed next            
            
            if((note.step == notes[i].step && note.octave == notes[i].octave))
                return "NOTE_ALREADY_ON_CHORD_SAME_NOTE_AND_OCTAVE";
        }

        note.noteDraw = DrawNote(chordDenominator);  //get the note draw
        noteGroup.appendChild(note.noteDraw);   //append the note drawing to the group

        //note.noteDraw.setAttribute("opacity", ".5");

        if(note.accidental) {   //if the note has an accident, 
            note.accidentDraw = DrawNoteAtt(note.accidental); //get its draw
            accidentGroup.appendChild(note.accidentDraw);   //append the accident drawing to the group if some
        }

        /*note.noteDraw.addEventListener("click", function(){
            console.log(note);
        });*/

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
                if(notes[i] == undefined)   //if the note is not valid
                    continue;   //proceed next one

                //check if it is the same
                if((note.step == notes[i].step && note.octave == notes[i].octave)) {
                    noteIndex = i;    //set the note index
                    note = notes[i];    //get the valid note reference for this note values
                    break;  //exit the iteration
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

    //Function to be called when you want to update the chord object positions of a chord that do not belong to a group
    this.OrganizeSingle = function(clef) {
        if(!chordModified && clef == lastClef)  //if the chord hasn't be modified and the clef is the same last time
            return; //do nothing and return

        //If there is no more notes on this chord
        if(notes.getValidLength() == 0) {
            rest.setAttribute("opacity", 1);    //show the rest element
            setStemLine();  //clear chord stem line
            setChordFlag(); //clear chord flag
            setAuxLines(); //remove all the aux lines
            setDots();  //set necessary dots
            setChordPositions();    //organize chord elements positions
            return; //do nothing else and return
        }

        //DEBUG PURPOSES
        /*if(!clef)
            clef = "G2";*/

        if(clef)    //if a clef has been specified 
            lastClef = clef;    //updates the last clef variable
        else if(lastClef)//if not, if we already got a last clef
            clef = lastClef;    //set the last as the current
        else //if none of them
            throw "NO_CLEF_HAS_BEEN_SET";  //crash with an error            

        rest.setAttribute("opacity", 0);    //hide the rest element

        //Set POS0_NOTE and POS0_OCTAVE according to the clef
        switch(clef) {

            case "G2":
                POS0_NOTE = 'E'.charCodeAt(0);
                POS0_OCTAVE = 5; 
                break;

            case "G2_OCT":
                POS0_NOTE = 'E'.charCodeAt(0);
                POS0_OCTAVE = 6; 
                break;

            case "F4":
                POS0_NOTE = 'G'.charCodeAt(0);
                POS0_OCTAVE = 3; 
                break;

            case "C3":
                POS0_NOTE = 'F'.charCodeAt(0);
                POS0_OCTAVE = 3; 
                break;

            case "C4":
                throw "C4_CLEF_TO_BE_IMPLEMENTED";
                break;

            default:
                throw "INVALID_CHORD_CLEF_SET: " + clef;
        }
        
        //DETECT THE LOWEST AND THE HIGHEST NOTES COORDINATES FOR THIS CHORD
        var lowValue = null,   //var to store the lowest value for y position
            highValue = null,   //var to store the higher position for aux lines
            farValue = null,    //var to store the most far value from the middle, between lowest and highest
            downStemFlag;   //flag to whether the stem is down or not. If false, this chord has a up stem

        for(var i = 0; i < notes.length; i++) { //iterate thru all the notes
            if(notes[i]) {   //if the note is valid

                //get the element y coordinate based on its values for note and octave
                var yCoord,
                    matchValue = 0;

                //If the note is A or B, must add 1 to the octave to match the piano standard of notes and octaves
                if(notes[i].step == "A" || notes[i].step == "B")
                    matchValue = 1;

                yCoord = -((notes[i].step.charCodeAt(0) - POS0_NOTE) + (notes[i].octave + matchValue - POS0_OCTAVE) * 7);

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

        //set the dots symbols position
        setDots();

        //set chord elements (accident group and notes group) correct places
        setChordPositions(downStemFlag); 

        chordModified = false;  //clear the chord modified flag
    }





    var limitsLowValue, 
        limitsHighValue;

    this.Organize2 = function(downStemFlag, lowValue, highValue) {     
        //This function can't be called if there is no note on the chord
        //This verification belongs to the context which called it

        lowValue = limitsLowValue;
        highValue = limitsHighValue;

        rest.setAttribute("opacity", 0);    //hide the rest element
        
        //put all the notes on their right positions
        var adjCoord = setNotesPositions(downStemFlag, lowValue); 

        //Must set the chord stem with the extreme coordinates
        //var finalStemCoord = setStemLine(downStemFlag, lowValue, highValue);

        //set aux lines if needed
        setAuxLines(downStemFlag, lowValue, highValue, adjCoord[0], adjCoord[1]);

        //set the accident symbols places (need the low value to generate the ordered list)
        setAccidentPositions(lowValue);

        //set the dots symbols position
        setDots();

        //set chord elements (accident group and notes group) correct places
        setChordPositions(downStemFlag); 
    }

    /*this.SetChordFlag = function(downStemFlag, finalStemCoord) {
        setChordFlag(downStemFlag, finalStemCoord);
    }*/

    this.SetStemLine = function(downStemFlag) {
        return setStemLine(downStemFlag, limitsLowValue, limitsHighValue);
    }

    this.ExtendStemLine = function(newEndY) {
        stem.setAttribute("y2", newEndY);    
    }

    this.GetChordLimits = function(clef) {
    
        if(clef)    //if a clef has been specified 
            lastClef = clef;    //updates the last clef variable
        else if(lastClef)//if not, if we already got a last clef
            clef = lastClef;    //set the last as the current
        else //if none of them
            throw "NO_CLEF_HAS_BEEN_SET";  //crash with an error            

        rest.setAttribute("opacity", 0);    //hide the rest element

        //Set POS0_NOTE and POS0_OCTAVE according to the clef
        switch(clef) {

            case "G2":
                POS0_NOTE = 'E'.charCodeAt(0);
                POS0_OCTAVE = 5; 
                break;

            case "G2_OCT":
                POS0_NOTE = 'E'.charCodeAt(0);
                POS0_OCTAVE = 6; 
                break;

            case "F4":
                POS0_NOTE = 'G'.charCodeAt(0);
                POS0_OCTAVE = 3; 
                break;

            case "C3":
                POS0_NOTE = 'F'.charCodeAt(0);
                POS0_OCTAVE = 3; 
                break;

            case "C4":
                throw "CLEF_TO_BE_IMPLEMENTED";
                break;

            default:
                throw "INVALID_CHORD_CLEF_SET: " + clef;
        }
        
        //DETECT THE LOWEST AND THE HIGHEST NOTES COORDINATES FOR THIS CHORD
        var lowValue = null,   //var to store the lowest value for y position
            highValue = null;   //var to store the higher position for aux lines

        for(var i = 0; i < notes.length; i++) { //iterate thru all the notes
            if(notes[i] == undefined)   //if the note is not valid
                continue;   //proceed next note

            //get the element y coordinate based on its values for note and octave
            var yCoord,
                matchValue = 0;

            //If the note is A or B, must add 1 to the octave to match the piano standard of notes and octaves
            if(notes[i].step == "A" || notes[i].step == "B")
                matchValue = 1;

            yCoord = -((notes[i].step.charCodeAt(0) - POS0_NOTE) + (notes[i].octave + matchValue - POS0_OCTAVE) * 7);

            notes[i].yCoord = yCoord;   //register the y coord at the note element for note placement later

            //if the current y position is low than the actual lowest value
            if(lowValue == null || yCoord < lowValue)   
                lowValue = yCoord;  //update the lowest value

            if(highValue == null || yCoord > highValue)   
                highValue = yCoord;  //update the lowest value
        }

        limitsLowValue = lowValue;
        limitsHighValue = highValue;

        return [lowValue, highValue];
    }

    //--------------------------------------------------------------------------------
    //----------------------- PRIVATE METHODS ----------------------------------------
    //--------------------------------------------------------------------------------

    function setChordPositions(downStem) {
        //gets chord elements bboxes
        var noteWidth = 0,  //single note width valu
            noteHalfWidth = 0,  //single note half width value
            noteGroupWidth = 0, //complete note group width value
            accidentWidth = accidentGroup.getBBox().width,  //accident box width
            dotWidth = dotsGroup.getBBox().width,   //dot box width

            ACC_NOTES_GAP = 5,  //GAP BETWEEN NOTES AND ACCIDENT SYMBOLS
            DOT_NOTES_GAP = 5;  //GAP BETWEEN NOTES AND DOT SYMBOLS

        //Reset width variables
        chordWidth = 0;
        chordBackWidth = 0;
        //chordFrontWidth = 0; //update at the end

        chordGroup.addEventListener("click", function(){
            console.log("FrontWidth: " + chordFrontWidth);
            console.log("BackWidth: " + chordBackWidth);
        });

        //Get note group width
        noteGroupWidth = noteGroup.getBBox().width;

        //Get the note width (this is necessary due to in case double adjacent notes does not result the single note width
        if(notes.getValidLength() == 0) //if there is no note, only rest, we can take the bbox width
            noteWidth = noteGroupWidth;
        else if(chordDenominator <= 1) {   //if the denominator is less or equal than 1, get its constant value
            noteWidth = 24;
            noteGroupWidth -= 5; //correct note group width due to fake white spaces @ svg  
        } else { //if any other denominator, get its constant value
            noteWidth = 18;
            noteGroupWidth -= 2; //correct note group width due to fake white spaces @ svg
        }

        //get note half width
        noteHalfWidth = noteWidth / 2;

        //place noteGroup Coord at the reference middle, since its from the middle that everything is referenced
        noteGroup.translate(-noteHalfWidth);
        chordWidth += noteGroupWidth;    //update the chord width

        if(downStem)
            chordBackWidth += noteGroupWidth - noteHalfWidth; //update the back width
        else
            chordBackWidth += noteHalfWidth; //update the back width

        //place the aux lines group coord
        auxLinesGroup.translate(-noteHalfWidth);

        if(accidentWidth > 0) { //if there is accidents
            //place accident group right before the note group, plus the accident-note gap
            accidentGroup.translate(noteGroup.getBBox().x - noteHalfWidth - ACC_NOTES_GAP);
            chordWidth += accidentWidth + ACC_NOTES_GAP;
            chordBackWidth += accidentWidth + ACC_NOTES_GAP;
        }

        if(dotWidth > 0) {  //if there is dots
            //place the dots group position right after the note group, plus the dot-note gap
            dotsGroup.translate(noteGroup.getBBox().x - noteHalfWidth + noteGroupWidth + DOT_NOTES_GAP); 
            chordWidth += dotWidth + DOT_NOTES_GAP;
        }

        //Update the front width
        chordFrontWidth = chordWidth - chordBackWidth; 

        //if(chordNameText.innerHTML == "")
            //return;

        //Put chord text over the chord
        //chordNameText.style.display = "none";   //hide the chord name
        //var chordNameYPos = chordGroup.getBBox().y - 5;


        //chordNameText.translate(-5, chordNameYPos);   
        //chordNameText.style.display = "";   //show the chord name 
    }

    function setAccidentPositions(lowValue) {
        //generate ordere list of the notes
        var positionList = []; //List to keep the elements for adjacent verification 
        for(var j = 0; j < notes.length; j++) { //iterate thru all the notes
            if(notes[j] && notes[j].accidentDraw) {   //if the note is valid and has an accident 
                //get the current pos offseted by the lowest value to ensure positive values
                var currPos = notes[j].yCoord - lowValue;   
                positionList[currPos] = notes[j];    //put the element at the index with same value than y coord offseted
            }
        }

        if(positionList.length <= 0)    //if the position list is empty, means no accident on this chord
            return; //do nothing else and return

        var currNote,
            accidentBox, 
            placeColumns = []; 

        //iterate thru the position list to populate the place columns data
        for(var k = 0; k < positionList.length; k++) {
            currNote = positionList[k];    

            //if the current item is invalid or this note has no accident
            if(currNote == undefined || !currNote.accidentDraw)    
                continue;   //proceed next iterations

            //get the accident symbol bbox
            accidentBox = currNote.accidentDraw.getBBox();
            
            var accYCoord = currNote.yCoord * LINE_OFFSET,  //get the y coord
                accTopCoord = accidentBox.y + accYCoord,   //get this accid obj top coord
                accColumnSet = false;   //flag to signalize whether a column has been set to the current note

            //iterate thru the placeColumns to find the one the accident symbol fits
            for(var columnIndex = 0; columnIndex < placeColumns.length; columnIndex++) {
                //if the current top coord is less or equal than the column bottom coord
                if(accTopCoord <= placeColumns[columnIndex].bottom) 
                    continue;   //proceed the next iteration

                accColumnSet = true;

                //if the symbol fits the current column
                currNote.accColumn = columnIndex;   

                //if the symbol width is greater than the current column index
                if(accidentBox.width > placeColumns[columnIndex].width)
                    placeColumns[columnIndex].width = accidentBox.width;

                //update this column bottom value 
                placeColumns[columnIndex].bottom = accidentBox.y + accidentBox.height + accYCoord;

                break;  //exit the iteration
            }

            //if the symbol doesn't fit anywhere
            if(!accColumnSet) {
                //create a new column
                placeColumns.push({
                    bottom: accidentBox.y + accidentBox.height + accYCoord,
                    width: accidentBox.width
                });
                //set the new column index to the current note
                currNote.accColumn = placeColumns.length - 1;   
            }
        }

        //iterate thru the place column to set the X position coordinates for each column
        var currXCoord = 0; //current X coordinate to place the symbols
        for(var i = 0; i < placeColumns.length; i++) {
            placeColumns[i].xCoord = currXCoord;    //set the x coord for this column
            currXCoord -= placeColumns[i].width + 3;    //generate the next column x position with the gap
        }

        //iterate again the position list, now to place the accident on their places        
        for(var k = 0; k < positionList.length; k++) {
            currNote = positionList[k];    

            //if the current item is invalid or this note has no accident
            if(currNote == undefined || !currNote.accidentDraw)    
                continue;   //proceed next iterations

            var accYCoord = currNote.yCoord * LINE_OFFSET,  //get the y coord
                accXCoord = placeColumns[currNote.accColumn].xCoord,
                accBox = currNote.accidentDraw.getBBox();

            //SetTransform(currNote.accidentDraw, { translate: [accXCoord - accBox.width, accYCoord] });
            currNote.accidentDraw.translate(accXCoord - accBox.width, accYCoord);
            //THIS LINE BELOW WAS COMMENTED BEFORE CHANGE FOR TRANSLATE @ GQUERY
            //SetTransform(debRect(accBox), { translate: [accXCoord - accBox.width, accYCoord] });
        }
    }

    /*function debRect(bbox) {
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
    }*/

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
                finalXCoord = chordDenominator <= 1 ? 21 : 17;
                //We must do this little hack since stem order chooses whether offset will be right or left
                finalXCoord *= -posListIncValue;    //and the iteration inc has the inverted logic for this
                //reset the prev valid note cause it is not necessary for the next one to move since this one moved
                prevValidNote = false;  
            } else //otherwise
                prevValidNote = true;   //just set the prev valid not to move the next one if it is valid

            //move the current note to its right position
            currNote.noteDraw.translate(finalXCoord, finalYCoord);
        }

        return [lowAdjValue, highAdjValue]; 
    }

    function setStemLine(downStemFlag, lowValue, highValue) {
        if(downStemFlag == undefined || chordDenominator <= 1 || notes.getValidLength() == 0) {  //if the chord den is less than 2,
            setStemLineObj();   //void call to clear any stem line
            return; //do nothing and return
        }

        var xCoord,
            startStemCoord, //value of the final coord of the stem line
            finalStemCoord, //value of the final coord of the stem line
            additionalStemLength = 0;    //variable to add the additional length to the stem when more than two flags is needed
        
        //if we got more than 2 flags at the note/chord (denominator > 16)    
        if(chordDenominator > 16) {
            additionalStemLength = 2;    //aditional length receives 2
            for(var i = 64 ;; i *= 2) { //increase aux var to verify how much additional space to add
                if(chordDenominator < i || i > 1000) //safety condition
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
        //if no arguments are supplied, or denominator greater than 4, clear the flag and return
        if(downStemFlag == undefined || chordDenominator <= 4) { 
            if(flag.parentElement)  //if the flag element is appended
                flag.parentElement.removeChild(flag);   //remove it
                return; //do nothing else and return
        }   

        noteGroup.appendChild(flag);

        if(downStemFlag) {
            flag.translate(1, finalStemCoord + 1);
            flag.scale(1, -1);
            //SetTransform(flag, { translate: [1, finalStemCoord + 1], scale: [1, -1]});
        } else {
            flag.translate(17, finalStemCoord - 1);
            //SetTransform(flag, { translate: [17, finalStemCoord - 1] });
        }
    }

    //function to set the dots of the chord
    function setDots() {
        //Remove dot elements currently appended to the dots group
        var dotsGroupChildren = dotsGroup.children; //get array of members
        while(dotsGroupChildren.length > 0)
            dotsGroup.removeChild(dotsGroupChildren[0]);

        //Check the chord denominator to detect whether it got dots or not
        if(chordDots == 0)
            return;

        //If no start line has been passed, set the dot for the rest element
        if(notes.getValidLength() == 0) {
            var restDot = DrawDot(chordDots);
            restDot.translate(0, 3 * LINE_OFFSET);
            dotsGroup.appendChild(restDot);
            return;
        }

        var dotsTable = [];
        //iterate thru notes array to populate the dots table
        for(var i = 0; i < notes.length; i++) {
            if(!notes[i]) continue; //if the current note is note valid, proceed next iteration

            var currYCoord = notes[i].yCoord;   //get the y coordinate value of the note
            if(currYCoord.isEven())    //if the value is even 
                currYCoord++;   //subtract one unit
            
            //if the current coordinate is not @ the dots table
            if(dotsTable.indexOf(currYCoord) == -1)
                dotsTable.push(currYCoord); //add it 
        }

        //iterate thru the dots table
        for(var j = 0; j < dotsTable.length; j++) {
            var noteDot = DrawDot(chordDots);   //get the dot draw
            dotsGroup.appendChild(noteDot); //append it to the dots group
            noteDot.translate(3, dotsTable[j] * LINE_OFFSET);   //translate to its position (xcoord 3 to put it @ 0,0)
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
                        lineStartCoord = chordDenominator <= 1 ? -25 : -21;
                        lineEndCoord = chordDenominator <= 1 ? 53 : 43;
                    } else {
                        lineStartCoord = chordDenominator <= 1 ? -4 : -4;
                        lineEndCoord = chordDenominator <= 1 ? 32 : 26;
                    }
                    dAtt += "M" + lineStartCoord + ", " + lineYCoord * LINE_OFFSET + "l0,0," + lineEndCoord + ",0";
                }
            } 
            if(highValue > LINE_HIGH_POS) {  //if the score over flow thru the lower part
                for(var lineYCoord = LINE_HIGH_POS + 2; lineYCoord <= highValue + 1; lineYCoord += 2) {
                    if(highAdjValue + 1 >= lineYCoord) {
                        lineStartCoord = chordDenominator <= 1 ? -25 : -21;
                        lineEndCoord = chordDenominator <= 1 ? 53 : 43;
                    } else {
                        lineStartCoord = chordDenominator <= 1 ? -4 : -4;
                        lineEndCoord = chordDenominator <= 1 ? 32 : 26;
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
                        lineEndCoord = chordDenominator <= 1 ? 53 : 43;
                    else
                        lineEndCoord = chordDenominator <= 1 ? 32 : 26;
                    dAtt += "M" + lineStartCoord + ", " + lineYCoord * LINE_OFFSET + "l0,0," + lineEndCoord + ",0";
                }
            } 
            if(highValue > LINE_HIGH_POS) {  //if the score over flow thru the lower part                     
                for(var lineYCoord = LINE_HIGH_POS + 2; lineYCoord <= highValue + 1; lineYCoord += 2) {
                    if(highAdjValue + 1 >= lineYCoord)
                        lineEndCoord = chordDenominator <= 1 ? 54 : 43;
                    else
                        lineEndCoord = chordDenominator <= 1 ? 33 : 26;
                    dAtt += "M" + lineStartCoord + ", " + lineYCoord * LINE_OFFSET + "l0,0," + lineEndCoord + ",0";
                }
            }  
        }
        auxLines.setAttribute("d", dAtt);   //set the path trail attribute (d) to the auxlines path
    }
}