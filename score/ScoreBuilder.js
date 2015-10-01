xmlns = "http://www.w3.org/2000/svg";
xlink = "http://www.w3.org/1999/xlink";  

//Pseudo Namespace to fit score objects classes
var ScoreBuilder = new function() {
    ///create notes, chords, measures and score class to manage all the score features
    ///lets begin with the note element placing at a chord

        //----------------------------------------------------------------
        //MUST IDEALIZE HOW THE INTERFACE WILL LOOK LIKE, HOW CONTENT WILL BE SPREAD
        //WHERE MOBILE FIRST FITS ON IT, IF ONLY NEWS OR INTERATIVE CONTENT TOO
        //CHORO IS COMING BACK, FOCUS ON IT
        //MUST REDRAW ALL SYMBOLS THAT HAVE "FAKE WHITE SPACES" DUE TO THESE ARE MISS PLACING THE SCORE

        //MUST GENERALIZE THE CLEFS AND LINES THEY ARE
        //CHECK WHETHER IS NEEDED TO IMPLEMENT CHORD SECTIONS AS MUSIC XML, NOTES ON THE MEASURE, WITH THE X COORD SPECIFIED

        //MUST ADD SCORE METADATA(COMPOSERS, MUSICIANS) AT THE TOP

        //MUST DETERMINE METAS AND PRIMARY OBJECTIVES
        //CHECK MUSIC XML WEAKNESS

        //USE GOOGLE COMPRESSION ALGORITHM TO STORE STUFF

        //ADOPT ALL POSIBLE NAMES FROM MUSIC XML

        //USE D3 SVG FOR THE GRAPHIC STUFF

        //MUST CREATE A FALL BACK FOR THE THROWS TO INSTEAD A CRASH, POPUP A MESSAGE OF ERROR AND TRY AGAIN


        //MUST CREATE SYSTEM TO AVOID BUG WHEN TOO MUCH REDUCE THE SCREEN
        //TRY TO IMPROVE THE WAY SCREEN WILL BE RESIZE TO SAVE PROCESSING (MAYBE USE A DELAY WHILE RESIZING)

        //MUST ENHANCE THE MEASURE ORGANIZER AND SCORE LINE ORGANIZER
        //IN A WAY THAT THE LINES GET AWAYS SMOOTH (NOT MOVING STUFF TO DECIMAL COORDINATES)

        //IMPLEMENT MODE FOR CHORD IT SELF DRAW SYMBOLS AND ITS ATTRIBUTES
        //CAUSE SOME ADJUSTS ARE DEPENDENTS TO OTHER NOTES
        //
        //CREATE METHOD TO HANDLE TO SCORES FOR G AND F CLEFS, 
        //CREATE SYSTEM TO ADD THE NOTE FINISH, DOTS, LIGATURES
        //ADD MEASURES TYPES OF BARS
        //ADD TABLATURE SYSTEM
        //ADD POINTS AND LINKS TO NOTES
        //--------------------------------------------------------------  

    var SCORE_LINE_LEFT_MARGIN = 10,
        SCORE_LINE_HEADER_MARGIN = 10,
        //SCORE_LINE_LENGTH = 1500,
        SCORE_TOP_MARGIN = 50, //min value for a top margin for the scores
        DEBUG_RECTANGLES = true;
  







    //-----------------------------------------------------------
    //-----------------------------------------------------------
    //-------------------- SCORE PART OBJECT --------------------
    //-----------------------------------------------------------
    //-----------------------------------------------------------

    //Object to store score part data
    /*this.ScorePart = function(partAttributes) {
        var selfRef = this,
            measures = new List(),    //ordered list to fit all the measures @ this score
            currLineLength = 0,
            partModified = false;

        //Function to check whether this score part has been modified or not
        //(measures are not verified because it only matter for the measures group organizer)
        this.CheckModified = function() {
            return partModified;
        }

        //There is no organizer, since this function has not to organize by its own, it is dependent to other score parts
        //Just use this function to clear the part modified flag
        this.ClearModified = function() {
            partModified = false;
        }

        this.GetClef = function() {
            return partAttributes.clef;
        }

        this.GetTimeSig = function() {
            return partAttributes.timeSig;
        }

        this.GetKeySig = function() {
            return partAttributes.keySig;
        }

        this.ForEachMeasure = function(action, index) {
            measures.ForEach(action, index);//iterate thru all the measures and apply the specified action to it
        }

        this.Find = function(measure) {
            return measures.Find(measure);
        }

        this.Count = function() {
            return measures.Count();
        }

        this.InsertMeasure = function(measure, position) {
            //if the measure object already exists at this measure, return a message
            if(measures.Find(measure) != -1) return "MEASURE_ALREADY_INSERTED"; 
            //implement timing verification in the future

            //Object validation successful

            //if the type of the position variable is different from number or the position is bigger or the size of the list
            if(typeof position != "number" || position >= measures.Count())    
                measures.Add(measure);    //insert with add method at the last position
            else //otherwise
                measures.Insert(position, measure); //insert element reference at the position to the list

            partModified = true;

            return "SUCCESS";
        }

        this.RemoveAt = function(position) {
            if(position < 0 || position >= measures.Count()) return "ERROR_POSITION_OUT_OF_BOUNDS";

            var removedMeasure = measures.GetItem(position);    //get the measure handler from the list

            if(removedMeasure.Draw().parentElement) //if this measure is appended somewhere
                removedMeasure.Draw().parentElement.removeChild(removedMeasure.Draw());  //remove it
            
            measures.RemoveAt(position);    //remove the measure from the list

            partModified = true;

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

    //-----------------------------------------------------------
    //-----------------------------------------------------------
    //-------------------- SCORE GROUP OBJECT --------------------
    //-----------------------------------------------------------
    //-----------------------------------------------------------

    this.ScoreGroup = function() {
        //Creates a new score line passing the line length and the minimum measure length to be kept in a line, otherwise it will overflow

        //KEEP WRITING THIS SCORE GROUP CLASS 
        //IT WILL ALLOCATE MEASURES TO THE LINES AN ORGANIZE AND SYNC LINES

        var selfRef = this,

            generalGroup = $G.create("g"),   //group to fit all the score part lines
            scoreParts = new List();    //list to store the score parts within this score group
            //scoreLines = new List();    //list to store the score lines visual objects

        var debRect1 = $G.create("rect");
        debRect1.setAttribute("fill", "green");
        debRect1.setAttribute("height", 15);
        debRect1.setAttribute("width", 15);
        generalGroup.appendChild(debRect1);

        this.Draw = function() {
            return generalGroup;
        }

        this.MoveTo = function(x, y) {
            generalGroup.translate(x, y);
        }

        this.InsertPart = function(scorePart, position) {
            //if the score part object already exists at this score group, return a message
            if(scoreParts.Find(scorePart) != -1) return "SCORE_PART_ALREADY_INSERTED"; 
            //implement timing verification in the future

            //Object validation successful

            //if the type of the position variable is different from number or the position is bigger or the size of the list
            if(typeof position != "number" || position >= scoreParts.Count())    
                scoreParts.Add(scorePart);    //insert with add method at the last position
            else //otherwise
                scoreParts.Insert(position, scorePart); //insert element reference at the position to the list

            return "SUCCESS";
        }

        this.RemoveAt = function(position) {
            if(position < 0 || position >= scoreParts.Count()) return "ERROR_POSITION_OUT_OF_BOUNDS";

            var removedPart = scoreParts.GetItem(position);    //get the measure handler from the list

            if(removedPart.Draw().parentElement) //if this score part is appended somewhere
                removedPart.Draw().parentElement.removeChild(removedPart.Draw());  //remove it
            
            scoreParts.RemoveAt(position);    //remove the measure from the list

            return removedPart;
        }

        this.RemovePart = function(scorePart) {
            var position = scoreParts.Find(scorePart);
            if(position == -1) 
                return "ERROR_MEASURE_NOT_FOUND";
            else 
                return selfRef.RemoveAt(position);
        }

        var measureGroups = new List();

        this.Organize = function() {
            //MUST GENERATE THE MEASURES GROUPS (PROBABLY ADD TO THEM WHEN THE SCORE PART IS JUST ADDED)
            //BE WARNED TO WHEN A MIDDLE MEASURE IS INSERTED AT THE SCORE PART (PARTMODIFIED FLAG IS NEEDED)

            var measuresQty = 0;

            //Get the max number of measures to find the size of the measure group array
            scoreParts.ForEach(function(part) {
                if(part.Count() > measuresQty)
                    measuresQty = part.Count();
            });

            //inits the measure group array
            var partsQty = scoreParts.Count(),     
                measureGroups = new Array(measuresQty);

            //Get measure groups
            scoreParts.ForEach(function(part, partInd) {    //iterate thry all parts
                part.ForEachMeasure(function(measure, measureInd) {  //iterate thru all measures
                    measure.Organize();
                    if(measureGroups[measureInd] == undefined)    //if this measure group isn't initiated
                        measureGroups[measureInd] = new MeasureGroup();  //create new measure group
                    measureGroups[measureInd].AddMeasure(measure); //put this measure at its measure
                });
            });

            //console.log(measureGroupArr);

            var measuresTimeArrays = new Array(measuresQty);

            //Iterate thru the measure groups and populate the measures time arrays
            for(var i = 0; i < measuresQty; i++)
                measuresTimeArrays[i] = getTimeArray(measureGroups[i]);

            var line_length = 1000,
                min_length = 300;

            //Now we got to generate keep putting groups together until a group length become less than the min width
            var fixedLengths = 0;


            //Get fixed lengths
            console.log(measuresTimeArrays);

        }

        function getTimeArray(mArray) {
            var arrFactor = 128,    //factor to multiply denominators to get times on order (biggest denominator expected)
                timeArr = new Array(arrFactor),
                fixedLengths = 0;

            for(var i = 0; i < mArray.length; i++) {
                fixedLengths += mArray[i].GetFixedLength(); 

                var currInd = 0;                   
                mArray[i].ForEachChord(function(chord) {
                    //chord.Organize();

                    if(timeArr[currInd] == undefined)  //if the array hasn't been initated
                        timeArr[currInd] = [];  //inits it
                    
                    timeArr[currInd].push(chord);   //push the chord to it

                    //get the highest back length value
                    if(timeArr[currInd].backLength == undefined || chord.GetBackLength() > timeArr[currInd].backLength)
                        timeArr[currInd].backLength = chord.GetBackLength(); 
                        
                    //get the highest front length value
                    if(timeArr[currInd].frontLength == undefined || chord.GetFrontLength() > timeArr[currInd].frontLength)
                        timeArr[currInd].frontLength = chord.GetFrontLength();

                    //get the highest denominator
                    if(timeArr[currInd].highDen == undefined || chord.GetDenominator() > timeArr[currInd].highDen)
                        timeArr[currInd].highDen = chord.GetDenominator();             

                    //update next chord ind
                    currInd += arrFactor / chord.GetDenominator(); 

                });
            }

            timeArr.fixedLength = fixedLengths;

            return timeArr;
        }

        function syncMeasures(mArray) {
            var arrFactor = 128,    //factor to multiply denominators to get times on order (biggest denominator expected)
                timeArr = new Array(arrFactor),
                fixedLengths = 0;

            //populate time array and get the measure fixed length
            for(var i = 0; i < mArray.length; i++) {
                fixedLengths += mArray[i].GetFixedLength();    

                var currInd = 0;                   
                mArray[i].ForEachChord(function(chord) {
                    //chord.Organize();

                    if(timeArr[currInd] == undefined)  //if the array hasn't been initated
                        timeArr[currInd] = [];  //inits it
                    
                    timeArr[currInd].push(chord);   //push the chord to it

                    //get the highest back length value
                    if(timeArr[currInd].backLength == undefined || chord.GetBackLength() > timeArr[currInd].backLength)
                        timeArr[currInd].backLength = chord.GetBackLength(); 
                        
                    //get the highest front length value
                    if(timeArr[currInd].frontLength == undefined || chord.GetFrontLength() > timeArr[currInd].frontLength)
                        timeArr[currInd].frontLength = chord.GetFrontLength();

                    //get the highest denominator
                    if(timeArr[currInd].highDen == undefined || chord.GetDenominator() > timeArr[currInd].highDen)
                        timeArr[currInd].highDen = chord.GetDenominator();             

                    //update next chord ind
                    currInd += arrFactor / chord.GetDenominator(); 

                });
            }

            //get constant total length
            var mMargin = 20;

            for(var j = 0; j < arrFactor; j++) {
                if(timeArr[j] == undefined)
                    continue;

                //get the biggest elements fixed lengths to find out how much free space we have 
                fixedLengths += timeArr[j].backLength + timeArr[j].frontLength;
            }        

            //get denominators sum
            var denSum = 0;
            for(var k = 0; k < timeArr.length; k++) {
                if(timeArr[k] == undefined)
                    continue;

                denSum += 1 / timeArr[k].highDen;
            }

            //get the unit factor
            var mLength = 1000,
                unitFactor = (mLength - fixedLengths) / denSum;

            //move chords to their positions
            var nextPosition = mMargin;

            for(var l = 0; l < timeArr.length; l++) {
                if(timeArr[l] == undefined)
                    continue;

                for(var m = 0; m < timeArr[l].length; m++)
                    timeArr[l][m].MoveChordHead(timeArr[l].backLength + nextPosition);

                nextPosition += unitFactor / timeArr[l].highDen + timeArr[l].backLength + timeArr[l].frontLength; 
            }
            
        }

    }*/





    //-----------------------------------------------------------
    //-----------------------------------------------------------
    //-------------------- SCORE LINE OBJECT --------------------
    //-----------------------------------------------------------
    //-----------------------------------------------------------

    this.ScoreLine = function(scoreLineAttr) {
        //Creates a new score line passing the line length and the minimum measure length to be kept in a line, otherwise it will overflow

        var selfRef = this,

            group = document.createElementNS(xmlns, "g"),   //group to fit all the score members
            //header = document.createElementNS(xmlns, "g"),  //create the score header group, to hold the score elements
            linesDrawing = document.createElementNS(xmlns, "path"),   //score lines path
            measures = new List(),    //ordered list to fit all the measures @ this score
            lineModified = false,
            currLineLength = 0;

        if(DEBUG_RECTANGLES) {
            //for debug, not really necessary due to group grows, but coodinates origin remains the same
            //reference rectangle to be used as a fixed reference point
            var refRect = document.createElementNS(xmlns, "rect");  
            refRect.setAttribute("fill", "yellow");
            refRect.setAttribute("height", 20); 
            refRect.setAttribute("width", 20);    
            group.appendChild(refRect); //append debug square
        }

        group.appendChild(linesDrawing);
        linesDrawing.setAttribute("stroke", "#000");

        header = drawScoreLineHeader(scoreLineAttr);
        group.appendChild(header);  //append score header
        //setScoreProperties(properties); //set the score properties

        this.Draw = function() { return group; }

        this.MoveTo = function(x, y) {
            //get decimal deviation of the this object Y
            var groupBBox = group.getBBox(),
                decimalYDev = Math.ceil(groupBBox.y) - groupBBox.y;

            //subtract the deviation to the Y movement to get a smooth look to the lines
            //SetTransform(group, { translate: [x, y - decimalYDev] });
            group.translate(x, y - decimalYDev);
        }

        //Get the current width of this score (must be appended to work)
        this.GetWidth = function() { 
            return group.getBBox().width; 
        }

        this.ForEach = function(action) {
            measures.ForEach(action);//iterate thru all the measures and apply the specified action to it
        }

        //Function to update the spaces and dimensions of the measures inside the score
        this.UpdateDimensions = function(lineLength, minLength) {
            if(currLineLength != lineLength)
                linesDrawing.setAttribute("d", GetScoreLinesPath(lineLength));

            //Get total fixed elements length
            var headerBox = header.getBBox(),
                elemTotalLength = headerBox.width + headerBox.x,    //fixed elements length
                denSum = 0; //denominators sum

            measures.ForEach(function(measure) { 
                elemTotalLength += MEASURE_LEFT_MARGIN;  //sum the measure left margin

                measure.ForEachElem(function(mElem){
                    if(mElem.objName == "chord") {
                        mElem.Organize();   //Ensure chords are organized to get their correct width
                        //PROBABLY IN THE FUTURE WILL HAVE TO VERIFY THE DENOMINATOR FOR ELEM TOTAL LENGTH FOR THE FINAL FINISH OF THE NOTES
                        denSum += 1 / mElem.GetDenominator();   //get denominator value
                        elemTotalLength += mElem.GetWidth();    //get chord length
                    }
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
                measure.MoveTo(nextPos, 0); //move the measure to the next position available (round down for smooth look)
                nextPos += measure.GetWidth();  //generate the next position
            
            //if the measure has notes ands current measure width is less than the min width,
                if(measure.Count() > 0 && measure.GetWidth() < minLength)  
                    minFlag = true; //set flag
            });

            
            return minFlag;
        }

        function drawScoreLineHeader(attr) {
            var attrGroup = document.createElementNS(xmlns, "g"),
                nextPos = SCORE_LINE_LEFT_MARGIN;

            //if a clef has been specified
            if(attr.clef) {
                var clefObj = DrawScoreClef(attr.clef["sign"]);
                attrGroup.appendChild(clefObj);
                clefObj.translate(nextPos, 0);
                //SetTransform(clefObj, { translate: [nextPos, 0] });
                nextPos += clefObj.getBBox().width + SCORE_LINE_HEADER_MARGIN;

                //if the clef key is specified
                if(attr.key && attr.key.fifths && attr.key.fifths != "0") {
                    var keyObj = DrawKeySignature(parseInt(attr.key.fifths));
                    //translate the key sig according to the clef
                    switch(attr.clef["sign"]) {
                        case 'F':
                            keyObj.translate(0, 15);
                            break;    
                    }
                    attrGroup.appendChild(keyObj);
                    keyObj.translate(nextPos, 0);
                    nextPos += keyObj.getBBox().width + SCORE_LINE_HEADER_MARGIN;
                }

                //if the clef time has been specified
                if(attr.time) {
                    var timeObj;
                    //if a time symbol has been specified, draw it
                    if(attr.time["@attributes"] && attr.time["@attributes"]["symbol"])
                        timeObj = DrawTimeSymbol(attr.time["@attributes"]["symbol"]);
                    else //otherwise, draw the time sig instead    
                        timeObj = DrawTimeSig(attr.time["beats"], attr.time["beat-type"]);     

                    attrGroup.appendChild(timeObj);
                    timeObj.translate(nextPos, 0);
                    nextPos += timeObj.getBBox().width + SCORE_LINE_HEADER_MARGIN;
                }
            }

            return attrGroup;
        }
/*
        function setScoreProperties(props) {

            var nextPos = SCORE_LINE_LEFT_MARGIN;

            if(props.clef && props.clef == 'G') {
                var clef = DrawScoreClef("G");
                header.appendChild(clef);
                SetTransform(clef, { translate: [nextPos, 0] });
                nextPos += GetBBox(clef).width + SCORE_LINE_HEADER_MARGIN;
            }
            
            if(props.timeSig && props.timeSig == 44) {
                var timeSig = DrawTimeSig("4", "4");
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
        }*/

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

            /*
            measure.Draw().onclick = function() {
                console.log(alphaScore.RemoveMeasure(measure));
                alphaScore.Organize(1500, 300);
                //MUST SET MODE TO FLAG WHEN A LINE MUST BE ORGANIZED OR NOT TO AVOID USELESS PROCESS
            };*/

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

    //-----------------------------------------------------------
    //-----------------------------------------------------------
    //-------------------- SCORE OBJECT -------------------------
    //-----------------------------------------------------------
    //-----------------------------------------------------------

    //General score that will handle multiple scores, lines and add the drawings finish and attributes
    this.Score = function(scoreAttr) {
        var selfRef = this, //self reference

            group = document.createElementNS(xmlns, "g"),   //group to keep the visual objects
            lines = new List(); //list to organize the score lines
            
        if(DEBUG_RECTANGLES) {
            var refRect = document.createElementNS(xmlns, "rect");  //reference rectangle to be used as a fixed reference point
            refRect.setAttribute("fill", "#050");
            refRect.setAttribute("height", 30); 
            refRect.setAttribute("width", 30);
            group.appendChild(refRect); //append debug square 
        }

//-------------------------------------------------------------
//----- FONT SIZES: -------------
//Title: 24 center
//Subtitle: 14 center
//Composer: 12 right
//Lyricist: 12 left
//Copyright 8   center
        /*
        var scoreHeader = $G.create("g");
        console.log(scoreAttr);
        if(composer) {
            var titleText = $G.create("text");
            titleText.textContent = composer;
            titleText.setAttribute("font-size", "24pt");
            scoreHeader.appendChild(titleText);
        }


        group.appendChild(scoreHeader);

        scoreHeader.translate(100,50);
        console.log(scoreHeader);*/

//-------------------------------------------

        //Add the first line
        createLine(scoreAttr);

        this.Draw = function() { return group; }

        this.MoveTo = function(x, y) {
            //SetTransform(group, { translate: [x, y] });
            group.translate(x, y);
        }

        function createLine(prop) {
            var newLine = new ScoreBuilder.ScoreLine(prop);   //create the line
            lines.Add(newLine); //add the line to the lines list
            group.appendChild(newLine.Draw()); //append new line to the group
            return newLine;
        }

        function deleteLine(index) {
            var currLine = lines.GetItem(index);    //get the specified line
            lines.RemoveAt(index);  //removed it from the lines list
            group.removeChild(currLine.Draw()); //remove its visual object from the group
            return "LINE_DELETATION_SUCESS";    //return sucess
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
        this.Organize = function(lineLength, minLength) {

            //iterate thru all lines and update their dimensions
            for(var i = 0; i < lines.Count(); i++) {
                var line = lines.GetItem(i),
                    overflowMeasures = [];

                //if this isn't the last line
                if(i + 1 < lines.Count()) {
                    //iterate thru the next lines
                    for(var j = i + 1; j < lines.Count(); j++) {
                        var nextLine = lines.GetItem(j),
                            exitFlag = false;

                        while(nextLine.Count() > 0) {
                            //put a measure from the below line up
                            line.InsertMeasure(nextLine.RemoveAt(0));
                            //alert("oi");
                            //check whether it is ok
                            if(line.UpdateDimensions(lineLength, minLength)) {
                                //if an overflow occurrs    
                                exitFlag = true;    //set the exit flag
                                break;  //exits this iteration
                            }
                        }

                        if(nextLine.Count() == 0) {  //if the current next line is empty
                            console.log(deleteLine(j));  //delete it
                            j--;    //reduce the list index variable
                        }

                        if(exitFlag)    //if the exit flag is set
                            break;  //exit this iteration
                    }  
                }


                //while the update dimensions min width flag keep set, 
                while(line.UpdateDimensions(lineLength, minLength)) {
                    //remove the last measure
                    overflowMeasures.push(line.RemoveAt(line.Count() -1));
                }

                //if there is removed lines, add them to the next line,
                if(overflowMeasures.length > 0) {
                    //if the current line is the last line, create a new one
                    if(lines.Count() - 1 == i)
                        createLine({ clef: scoreAttr.clef });

                    var nextLine = lines.GetItem(i + 1);  //get the next line ref

                    //iterate thru the removed measures
                    for(var j = 0; j < overflowMeasures.length; j++) {
                        nextLine.InsertMeasure(overflowMeasures[j], 0); //add them to the first position at the new line
                    }
                }            
            }

            //KEEP IMPROVING SYSTEM FOR NEW LINES CREATION AND DELETATION

            //iterate thry all the lines and organize their vertical positions
            var nextYCoord = SCORE_TOP_MARGIN;
            for(var i = 0; i < lines.Count(); i++) {
                var line = lines.GetItem(i),    //get the current line ref
                    currBBox = lines.GetItem(i).Draw().getBBox();   //get current object bbox
                //move the score line to the new coord compensing negative coordinates within it and rounding final value up
                line.MoveTo(0, nextYCoord - currBBox.y);    

                //get the next position summing the actual coordinate plus the current object height
                nextYCoord += currBBox.height + SCORE_TOP_MARGIN;
            }
        }
    }
}

/*
function ArrayLength(array) {
    var length = 0;

    for(var i = 0; i < array.length; i++)
        if(array[i] != undefined)
            length++;

    return length;
}*/

/*
function GetBBox(element) {
    var bBox;
    try {
        var bBox = element.getBBox();   //get element bBox
        if(bBox.x || bBox.y || bBox.width || bBox.height)//if any of the members are valid, 
            return bBox;    //return the gotten bbox cause it is valid
        else
            throw "bBox error";
    } catch(e) {
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
}*/

/*
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
}*/




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
