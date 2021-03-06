//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();   

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- SCORE GROUP OBJECT -------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

var SCORE_LINE_LEFT_MARGIN = 10,
    SCORE_LINE_HEADER_MARGIN = 10,
    //SCORE_LINE_LENGTH = 1500,
    SCORE_TOP_MARGIN = 50, //min value for a top margin for the scores
    LINE_WIDTH = 1500,  //constant value to be used to set the score line size
    MIN_MEASURE_WIDTH = 300;//constante value to be used to set measure min width

ScoreBuilder.ScoreGroup = function() {

    var selfRef = this,

        generalGroup = $G.create("g"),   //group to fit all the score part lines
        scoreParts = new List(),   //list to store the score parts within this score group

        measureGroups;  //measure group array to store measure groups

    var debRect1 = $G.create("rect");
    debRect1.setAttribute("fill", "green");
    debRect1.setAttribute("height", 15);
    debRect1.setAttribute("width", 15);
    //generalGroup.appendChild(debRect1);

    this.Draw = function() {
        return generalGroup;
    }

    this.MoveTo = function(x, y) {
        generalGroup.translate(x, y);
    }

    var _tempoCoord = 0;
    this.GetTempoCoord = function() {

    }

    this.InsertPart = function(scorePart, position) {
        //if the score part object already exists at this score group, return a message
        if(scoreParts.Find(scorePart) != -1) return "SCORE_PART_ALREADY_INSERTED"; 

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

    this.Organize = function() {

        //If there is no score parts
        if(scoreParts.Count() <= 0)
            return; //do nothing and return

        var moreThanOnePartFlag = scoreParts.Count() > 1;   //flag signalizing whehter we got more than one part on this score group

        //Clear measure group array         
        measureGroups = [];

        //Iterate thru all score parts and populate the measure groups array
        scoreParts.ForEach(function(part) {
            //Ensure every part, measure and chord are organized
            part.Organize();

            //iterate thru the measures of the current part
            part.ForEachMeasure(function(measure, index) {
                //if the measure index is not created at the measure group index,
                if(!measureGroups[index])
                    measureGroups[index] = new ScoreBuilder.MeasureGroup(); //create it 

                //add the current measure to its correspondent index @ the measure group
                measureGroups[index].AddMeasure(measure);
            });
        });
       
        //if no measure groups, return
        if(measureGroups.length == 0)
            return;
        
        //NOW WE DETERMINE WHICH LINE EACH MEASURE WILL BE PLACED ON

        var measureGroupLines = [];
            lineIndex = 0;   //current group line index pointer
     
        //INITS THE FIRST LINE
        //Ensure the current measure group is organized
        measureGroups[0].Organize();    
        //Creates the first measure group line obj
        measureGroupLines[0] = new MeasureGroupLine(measureGroups[0]); 

        //Iterate thru the rest of the measure groups, populating and creating measure group lines
        for(var a = 1; a < measureGroups.length; a++) {

            cMeasureGroup = measureGroups[a];   //Get the current m group ref

            cMeasureGroup.Organize();    //ensure the current measure is organized

            //Gets the result whether this measure group fits the current line
            var fitResult = measureGroupLines[lineIndex].CheckFit(cMeasureGroup);

            if(fitResult) { //If so,
                //Add it
                measureGroupLines[lineIndex].Add(cMeasureGroup);
            } else {    //if not
                //Increase index and create a new line for it
                lineIndex++;
                measureGroupLines[lineIndex] = new MeasureGroupLine(cMeasureGroup);
            } 
        }


        //Remove all elements currently appended to the general group
        var groupChildren = generalGroup.children;
        while(groupChildren.length > 0)
            generalGroup.removeChild(groupChildren[0]);

        //append debug rect again
        //generalGroup.appendChild(debRect1);

        //Organize lines groups vertically
        for(var i = 0, nextVPos = 0; i < measureGroupLines.length; i++) {
            var currLineGroup = measureGroupLines[i].GetLinesGroup();    //get the line group reference
            generalGroup.appendChild(currLineGroup);    //append the line group to the general group
            var nextPosCeil = Math.ceil(nextVPos - currLineGroup.getBBox().y);    //round up every coordinate value
            currLineGroup.translate(12, nextPosCeil);    //translate the line group to its positions
            nextVPos += currLineGroup.getBBox().height + 20;    //increase the next v pos variable
        }
    }
}

function MeasureGroupLine(firstMeasureGroup) {

    var measureGroups = [],
        lineFixedLength = 0,
        lineDenominatorSum = 0,
        highestDenValue = 0,    //variable to store the highest denominator 
        headerMargin = 0,
        groupLines = [];    //Array to store the lines of this measure group line

    //-------------------- PUBLIC METHODS -----------------

    this.GetHeaderMargin = function() { return headerMargin; }
    this.GetDenUnitValue = function() { return (LINE_WIDTH - lineFixedLength) / lineDenominatorSum; }


    this.ForEachMeasureGroup = function(action) {
        var groupLength = measureGroups.length;
        for(var i = 0; i < groupLength; i++) {
            if(measureGroups[i] == undefined)
                continue;
            action(measureGroups[i], i);
        }
    }

    this.Add = function(measureGroup) {
        measureGroups.push(measureGroup);

        //Only update start bar length in case the start bar is forward
        if(measureGroup.GetStartBar() == "forward") {
            //If it is the first measure
            if(measureGroups.length == 1) { //just add it
                lineFixedLength += DrawBar("forward", [0, 1]).getBBox().width;
            } else {    //if not, get the previous one

                var previousBar = measureGroups[measureGroups.length - 2].GetEndBar();

                //Remove its length
                lineFixedLength -= DrawBar(previousBar, [0, 1]).getBBox().width;
                
                //If the previous measure group end bar is backward
                if(previousBar == "backward")
                    lineFixedLength += DrawBar("repeat_bf", [0, 1]).getBBox().width; //add the repeat b and f length
                else //if it is not the backward, just add the start bar length
                    lineFixedLength += DrawBar("forward", [0, 1]).getBBox().width;  
            }
        }

        if(measureGroup.GetEndBar())
            lineFixedLength += DrawBar(measureGroup.GetEndBar(), [0, 1]).getBBox().width;

        lineFixedLength += measureGroup.GetFixedLength();
        lineDenominatorSum += measureGroup.GetDenominatorSum();

        //Add the measures of this measure group to the correpondent lines
        measureGroup.ForEachMeasure(function(measure, index) {
            var measureHighDen = measure.GetHighDenominator();
            if(measureHighDen > highestDenValue)
                highestDenValue = measureHighDen;

            groupLines[index].appendChild(measure.Draw());
        });
    }

    this.CheckFit = function(measureGroup) {
        //Check whether these values fits inside this line without crossing the max and min values

        //Values for checking purposes
        var checkFixedLength = lineFixedLength + measureGroup.GetFixedLength(),
            checkDenSum = lineDenominatorSum + measureGroup.GetDenominatorSum(),
            checkDenUnitValue,
            checkHighDenominator = highestDenValue;

        //Iterate thru the measure of the measure group and update the check high denominator
        measureGroup.ForEachMeasure(function(measure) {
            var measureHighDen = measure.GetHighDenominator();
            if(measureHighDen > checkHighDenominator)
                checkHighDenominator = measureHighDen;
        });    


        //THIS BAR CHECK IS NOT COUNTING WHETHER THERE IS A BAR MIX, BUT ITS OK BECAUSE ITS COUTING MORE
        //NO OVERLAPS WILL OCCURR

        //Add bars length
        if(measureGroup.GetStartBar())
            checkFixedLength += DrawBar(measureGroup.GetStartBar(), [0, 1]).getBBox().width;

        if(measureGroup.GetEndBar())
            checkFixedLength += DrawBar(measureGroup.GetEndBar(), [0, 1]).getBBox().width;

        checkDenUnitValue = (LINE_WIDTH - checkFixedLength) / checkDenSum;

        //If the minimal space (highest denominator space) is less than the specified value, means not fit (return false)
        if((checkDenUnitValue / checkHighDenominator) <= 10)
            return false;

        //Check whether this den unit value is not ok for the testing measureGroup
        if(checkDenUnitValue < measureGroup.GetMinDenUnitLength(MIN_MEASURE_WIDTH))
            return false; //If not, return false (not fit)
        else //if for the current measure group its ok, check for the already placed measure groups
            for(var b = 0; b < measureGroups.length; b++) //iterate thru all the groups of this lines
                //if the curr den value is not ok for the current measure group of the line
                if(checkDenUnitValue < measureGroups[b].GetMinDenUnitLength(MIN_MEASURE_WIDTH))
                    return false;   //return false (not fit)
                 
        //If we got here, so it does fit, return true
        return true;
    }


    //Function to organize measure group lines and return their visual objects a another object
    this.GetLinesGroup = function() {

        var linesGroup = $G.create("g");

        //create an array to store the lines coordinates to be used for score bars positioning
        var linesCoords = new Array(groupLines.length); 
            
        //Organize lines vertically
        var vPosPointer = 0;    //vertical position pointer
        for(var i = 0; i < groupLines.length; i++) {
            var currGroup = groupLines[i],
                currGroupBox = currGroup.getBBox(),
                nextVPosCeil = Math.ceil(vPosPointer - currGroupBox.y);    //round up every vertical coordinate

            linesCoords[i] = nextVPosCeil;   //Add position to the line coords array  

            linesGroup.appendChild(currGroup);

            currGroup.translate(0, nextVPosCeil);
            vPosPointer += currGroupBox.height + 30;
        }

        //To be fixed when dealing with tabs, for now hard push the score line height to the line coords
        linesCoords.push(linesCoords[linesCoords.length - 1] + 60);

        //Draw lines junction bar and bracket if more than one part
        if(groupLines.length > 1) {
            var linesJunctionBar = DrawBar("light", linesCoords);
            linesJunctionBar.translate(0, linesCoords[0]);
            linesGroup.appendChild(linesJunctionBar);

            var bracketObj = DrawBracket(linesCoords);
            bracketObj.translate(-12, linesCoords[0]);
            linesGroup.appendChild(bracketObj);
        }

        //Organize measure groups positions (chords, bars and measures)
        var hPosPointer = headerMargin, //horizontal position pointer
            denUnitValue = (LINE_WIDTH - lineFixedLength) / lineDenominatorSum;
        
        //Collection to store chords that has to be made ligatures
        var ligatureChordsColl = [],
            measuresXCoords = [];

        for(var i = 0; i < measureGroups.length; i++) {
            var currMeasureGroup = measureGroups[i],
                nextMeasureGroup = i + 1 < measureGroups.length ? measureGroups[i+1] : null;

            //Organize chords and get the relation of chords that has to be made ligatures
            var ligatureChords = currMeasureGroup.SetChordsPositions(denUnitValue);
            ligatureChordsColl.push(ligatureChords);

            //Only put start bar in case of first measure of the line
            if(currMeasureGroup.GetStartBar() == "forward" && i == 0) {
                var startBar = DrawBar(currMeasureGroup.GetStartBar(), linesCoords),
                    startBarBox = startBar.getBBox();
                linesGroup.appendChild(startBar);
                startBar.translate(hPosPointer - startBarBox.x, linesCoords[0]);
                hPosPointer += startBarBox.width;
            }

            var measureGroupWidth = currMeasureGroup.GetWidth();
            currMeasureGroup.ForEachMeasure(function(measure) {
                measure.MoveX(hPosPointer);
            });

            measuresXCoords.push(hPosPointer);

            hPosPointer += currMeasureGroup.GetWidth();

            //If there is any clef change
            var clefChangeArr = currMeasureGroup.GetClefChangeArr();
            if(clefChangeArr.getValidLength() > 0) {

                for(var clefInd = 0; clefInd < clefChangeArr.length; clefInd++) {
                    if(clefChangeArr[clefInd] == undefined)
                        continue;

                    var clefObj = clefChangeArr[clefInd];
                    linesGroup.appendChild(clefObj);
                    clefObj.translate(hPosPointer, linesCoords[clefInd]);
                }

                //Increase horizontal pointer with the clef changes biggest width
                hPosPointer += clefChangeArr._width;
            }

            //Check if this got a end bar, or the next got a start bar
            if(currMeasureGroup.GetEndBar() || (nextMeasureGroup && nextMeasureGroup.GetStartBar())) {
                var endBar;

                if(nextMeasureGroup && nextMeasureGroup.GetStartBar() == "forward") {
                    if(currMeasureGroup.GetEndBar() == "backward") {
                        endBar = DrawBar("repeat_bf", linesCoords);
                    } else {
                        endBar = DrawBar("forward", linesCoords);
                    }
                } else if(currMeasureGroup.GetEndBar()) {
                    endBar = DrawBar(currMeasureGroup.GetEndBar(), linesCoords);                    
                }

                //var endBar = DrawBar(currMeasureGroup.GetEndBar(), linesCoords),
                
                var endBarBox = endBar.getBBox();
                linesGroup.appendChild(endBar);
                endBar.translate(hPosPointer - endBarBox.x, linesCoords[0]);
                hPosPointer += endBarBox.width;
            }

            var keySigChangeArr = currMeasureGroup.GetKeySigChangeArr(); 
            if(keySigChangeArr.getValidLength() > 0) {

                hPosPointer += 5;

                for(var keySigInd = 0; keySigInd < keySigChangeArr.length; keySigInd++) {
                    if(keySigChangeArr[keySigInd] == undefined)
                        continue;

                    var keySigIndObj = keySigChangeArr[keySigInd];
                    linesGroup.appendChild(keySigIndObj);
                    keySigIndObj.translate(hPosPointer, linesCoords[keySigInd] + keySigIndObj.yCoord);
                }

                //Increase horizontal pointer with the clef changes biggest width
                hPosPointer += keySigChangeArr._width;
            }  

            var timeSigChangeArr = currMeasureGroup.GetTimeSigChangeArr(); 
            if(timeSigChangeArr.getValidLength() > 0) {

                hPosPointer += 10;
                
                for(var timeSigInd = 0; timeSigInd < timeSigChangeArr.length; timeSigInd++) {
                    if(timeSigChangeArr[timeSigInd] == undefined)
                        continue;

                    var timeSigIndObj = timeSigChangeArr[timeSigInd];
                    linesGroup.appendChild(timeSigIndObj);
                    timeSigIndObj.translate(hPosPointer, linesCoords[timeSigInd]);
                }

                //Increase horizontal pointer with the clef changes biggest width
                hPosPointer += timeSigChangeArr._width;
            }  
        }

        //---- Create and place ligatures -----

        //Populate ligatureLines objects
        var ligatureLines = [],
            ligatureLinesIndex = 0;

        var lineGroupWidth = linesGroup.getBBox().width;

        //Store how much score parts is on the score
        var partQty = groupLines.length;

        for(var partLine = 0; partLine < partQty; partLine++) {
            for(var measureInd = 0; measureInd < ligatureChordsColl.length; measureInd++) {
                var ligMeasure = ligatureChordsColl[measureInd][partLine],
                    ligatureValue,
                    ligatureXOffset = measuresXCoords[measureInd]; 
                
                if(ligMeasure == undefined)
                    continue;

                for(var k = 0; k < ligMeasure.length; k++) {
                    var ligChord = ligMeasure[k];

                    if(ligChord.slur != undefined)
                        ligatureValue = ligChord.slur;
                    else if(ligChord.tied != undefined)
                        ligatureValue = ligChord.tied;
                    else
                        continue;

                    if(ligatureLines[ligatureLinesIndex] == undefined)
                        ligatureLines[ligatureLinesIndex] = { 
                            start: headerMargin,
                            stop: lineGroupWidth - 12,
                            lineInd: partLine 
                        }

                    if(ligatureValue == "start") { 
                        ligatureLines[ligatureLinesIndex].start = ligChord.GetXCoord() + ligatureXOffset;
                    } else if(ligatureValue == "stop") {
                        ligatureLines[ligatureLinesIndex].stop = ligChord.GetXCoord() + ligatureXOffset;
                        ligatureLinesIndex++; 
                    }

                }

            }
        }


        //Iterate thru the lig lines and draw the ligatures
        for(var i = 0; i < ligatureLines.length; i++) {
            var ligLine = ligatureLines[i];


            var slurObj = DrawSlur(0, 0, -10, ligLine.stop - ligLine.start, 0);

            groupLines[ligLine.lineInd].appendChild(slurObj);

            slurObj.translate(ligLine.start, 0);     
        }

        
        return linesGroup;
    }

    //--------------------OBJECT CONSTRUCTION ROUTINES-----------------

    //Draw all the headers to check the highest one
    firstMeasureGroup.ForEachMeasure(function(measure, index) {

        //Verify whether this measure time sig must be shown or not
        //It should be shown if it has been changed from the last one
        var measureTimeSig = measure.changes.timeSigChanged ? measure.GetTimeSig() : null;

        //Get lines header obj
        var partHeaderObj = DrawScoreLineHeader(measure.GetClef(), measure.GetKeySig(), measureTimeSig), 
            partObjBox = partHeaderObj.getBBox(),
            partObjWidth = partObjBox.width + partObjBox.x, //get current part header total width
            lineGroup = $G.create("g"),
            lineObj = DrawParalelLines(5, LINE_WIDTH, 15); //create the score lines obj

        groupLines[index] = lineGroup;

        lineGroup.appendChild(partHeaderObj);

        //Append score lines
        lineGroup.appendChild(lineObj);

        //if the current part header width is higher than the current fixed length
        if(partObjWidth > headerMargin)
            headerMargin = partObjWidth;   //set the fixed lengthas the current header width
    });

    headerMargin += SCORE_LINE_HEADER_MARGIN;
    lineFixedLength += headerMargin;

    //Add the first member to the collection 
    this.Add(firstMeasureGroup);
}


function DrawScoreLineHeader(clef, keySig, timeSig) {
    var scoreHeader = document.createElementNS(xmlns, "g"),
        nextPos = SCORE_LINE_LEFT_MARGIN;

    //if a clef has been specified
    if(clef != undefined) {
        var clefObj = DrawScoreClef(clef);
        scoreHeader.appendChild(clefObj);
        clefObj.translate(nextPos, 0);
        nextPos += clefObj.getBBox().width + SCORE_LINE_HEADER_MARGIN;

        //if the clef key is specified and is different from 0 (value 0 at if statement is equal to false)
        if(keySig) {

            var keyObj = DrawKeySignature(keySig);
            //translate the key sig according to the clef

            switch(clef) {
                case "F4":
                    keyObj.translate(nextPos, 15);
                    break;

                case "C3":
                    keyObj.translate(nextPos, 7.5);
                    break;  

                default:
                    keyObj.translate(nextPos, 0);
                    break;   
            }

            scoreHeader.appendChild(keyObj);
            nextPos += keyObj.getBBox().width + SCORE_LINE_HEADER_MARGIN;
        }

        //if the clef time has been specified
        if(timeSig != undefined) {
            timeObj = DrawTimeSignature(timeSig);
            scoreHeader.appendChild(timeObj);
            timeObj.translate(nextPos, 0);
            nextPos += timeObj.getBBox().width + SCORE_LINE_HEADER_MARGIN;
        }
    }

    return scoreHeader;
}
