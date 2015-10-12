//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();    

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- TAB CHORD OBJECT ---------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

ScoreBuilder.TabChord = function(numberOfStrings, numberOfFrets, tabDenominator) {
	var selfRef = this,

    	gStrings = new Array(numberOfStrings), //Array to set the notes at this chord
    	tabChordDenominator = tabDenominator;   //chord general denominator

        chordGroup = document.createElementNS(xmlns, "g"),  //general chord group to put its elements

        chordWidth = 0,  //variable to keep the current true width of the chord (discouting aux lines gaps)
        chordBackWidth = 0, //variable to keep the width before the reference (point 0,0)
        chordFrontWidth = 0,//variable to keep the width after the reference (point 0,0)

        //variable to signalize whether a note has been added or removed from this chord and it was not yet organized
        chordModified = true;   //must start as true to ensure init the curr width variable  

    //for debug, not really necessary due to group grows, but coodinates origin remains the same
    var refRect = document.createElementNS(xmlns, "rect");  //reference rectangle to be used as a fixed reference point
    refRect.setAttribute("fill", "rgba(0,255,0,.5)");
    refRect.setAttribute("height", 12); 
    refRect.setAttribute("width", 12);
    chordGroup.appendChild(refRect);

	this.Draw = function() {
		return chordGroup;
	}

	//Function to get the current width of this chord
    this.GetWidth = function() {
        //return chordWidth;
        return chordGroup.getBBox().width;
    }

    this.GetBackWidth = function() {
        //return chordBackWidth;
        return chordGroup.getBBox().width / 2;
    }

    this.GetFrontWidth = function() {
        //return chordFrontWidth;
        return chordGroup.getBBox().width / 2;
    }

    this.MoveX = function(x) {
        chordGroup.translate(x);
    }

    //Function to get the Denominator of this chord
    this.GetDenominator = function() { 
        return tabChordDenominator; 
    }

	this.Organize = function(stringOffset) {
		chordGroup.translate(5);
		console.log("Oi");
	}

    this.AddNote = function(gString, fret) {

    	if(gString < 1 || gString > numberOfStrings) 
    		return "STRING_OUT_OF_BOUNDS";

    	if(fret > numberOfFrets) 
    		return "FRET_OUT_OF_BOUNDS";

    	gString--;	//subtract one unit from g string to match array needs


    	if(gStrings[gString] && gStrings[gString].noteDraw && gStrings[gString].noteDraw.parentElement) {
    		gStrings[gString].noteDraw.parentElement.removeChild(gStrings[gString].noteDraw);
    	}

    	gStrings[gString] = { fret: fret }


    	gStrings[gString].noteDraw = DrawNumber(fret);

        chordGroup.appendChild(gStrings[gString].noteDraw);   //append the note drawing to the group

        //note.noteDraw.setAttribute("opacity", ".5");

        gStrings[gString].noteDraw.addEventListener("click", function(){
            console.log(gStrings[gString]);
        });

        chordModified = true;

        return "INSERT_SUCCESS";
    }

    this.AddNoteCollection = function(noteCollection) {
        var result = [];
        for(var i = 0; i < noteCollection.length; i++)
            result.push(selfRef.AddNote(noteCollection[i]));

        return result;
    }

    /*this.DeleteNote = function(string) {
        //if the same note object is placed
        var noteIndex = notes.indexOf(note);

        if(noteIndex == -1) { //if the note object is not found,
            //iterate thru all notes already placed to check if it is equal to the passed
            for(var i = 0; i < notes.length; i++) { //iterate thru all the notes
                if(notes[i]) {   //if the note is valid
                    //check if it is the same
                    if((note.n == notes[i].n && note.o == notes[i].o)) {
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
    }*/
}