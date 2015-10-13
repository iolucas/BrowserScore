//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();   

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- SCORE GROUP OBJECT --------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

var SCORE_LINE_LEFT_MARGIN = 10,
    SCORE_LINE_HEADER_MARGIN = 10,
    //SCORE_LINE_LENGTH = 1500,
    SCORE_TOP_MARGIN = 50, //min value for a top margin for the scores
    LINE_WIDTH = 1480,  //constant value to be used to set the score line size
    MIN_MEASURE_WIDTH = 300;//constante value to be used to set measure min width

ScoreBuilder.ScoreGroup = function() {

    var selfRef = this,

        generalGroup = $G.create("g"),   //group to fit all the score part lines
        scoreParts = new List(),   //list to store the score parts within this score group
        //scoreLines = new List();    //list to store the score lines visual objects

        measureGroups;  //measure group array to store measure groups

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


/*
    function fillMeasureGroups() {

        measureGroups = []; //reset measure groups collection

        //iterate thru all score parts and populate the measure groups array
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
    }

    this.Org = function() {

        fillMeasureGroups();

        //Iterate thry the measure group
        for(var a = 0; a < measureGroups.length; a++) {

            measureGroups[a].Organize();    //ensure the current measure is organized

            //update the total fixed length with current measure group fixed length
            var measureGroupTotalFixedWidth = measureGroups[a].GetFixedLength(); 
            
            currTotalFixedLength += measureGroupTotalFixedWidth;  
            //update the current denominator sum with current measure group denominator sum
            currDenSum += measureGroups[a].GetDenominatorSum();

            //get the currDenUnit value
            var currDenUnitValue = (LINE_WIDTH - currTotalFixedLength) / currDenSum;

            //Check whether this den unit value makes some measure group of the current group line 
            //to be below the threshold measure width value
            
            var newLineFlag = false;    //flag to signalize whether a new line must be created or not

            //if the current group line has already been initiated
            if(measureGroupLines[currLinesInd]) {

                //check whether this den unit value is ok for the current measure group
                if(currDenUnitValue < measureGroups[a].GetMinDenUnitLength(MIN_MEASURE_WIDTH)) {
                //(if curr is less, means the measure width will be less than the min measure width passed
                    newLineFlag = true; //set new line flag
                } else {  //if for the current measure group its ok
                    //iterate thru the current line
                    for(var b = 0; b < measureGroupLines[currLinesInd].length; b++) {
                        //if the curr den value is not ok for the current measure group of the line
                        if(currDenUnitValue < measureGroupLines[currLinesInd][b].GetMinDenUnitLength(MIN_MEASURE_WIDTH)) {
                            newLineFlag = true; //set new line flag
                            break;  //stop the iteration, (one measure group not ok is enough)
                        }    
                    }
                }      

            } else {    //if not
                measureGroupLines[currLinesInd] = [];   //inits the new line 
                //This is a bad formated "for loop" due that its behave is different for the first time
                //This section will only happen at the first time       
            }

            if(newLineFlag) {   //if the new line flag is set,
                currLinesInd++; //increase the current line index
                measureGroupLines[currLinesInd] = [];   //inits the new line 
                //set curr total fixed length 
                currTotalFixedLength = linesHeaderMargin + measureGroupTotalFixedWidth;
                //set curr den sum 
                currDenSum = measureGroups[a].GetDenominatorSum(); 
                //update curr unit value
                currDenUnitValue = (LINE_WIDTH - currTotalFixedLength) / currDenSum;           
            } 

            //methods below are the same whether a new line is created or not,
            //there is not strange, since the curr lines index has been increased

            //push the current measure group to the current group line (new line or older) 
            measureGroupLines[currLinesInd].push(measureGroups[a]);
            //updates its current den unit value (new line or older) 
            measureGroupLines[currLinesInd].denUnitValue = currDenUnitValue;     
        }



    }
*/

    this.Organize2 = function() {

        //Measure group array
        var linesHeaderMargin = 0,
            moreThanOnePartFlag = scoreParts.Count() > 1;   //flag signalizing whehter we got more than one part on this score group

        measureGroups = [];

        //iterate thru all score parts and populate the measure groups array
        scoreParts.ForEach(function(part) {
            //Ensure every part, measure and chord are organized
            part.Organize();

            var partHeaderObj = drawScoreLineHeader({ clef: part.GetClef(), keySig: part.GetKeySig(), timeSig: part.GetTimeSig() }),
                partObjBox = partHeaderObj.getBBox(),
                partObjWidth = partObjBox.width + partObjBox.x; //get current part header total width

            //if the current part header width is higher than the current header width
            if(partObjWidth > linesHeaderMargin)
                linesHeaderMargin = partObjWidth;   //set the current part header width as the new one

            //iterate thru the measures of the current part
            part.ForEachMeasure(function(measure, index) {
                //if the measure index is not created at the measure group index,
                if(!measureGroups[index])
                    measureGroups[index] = new ScoreBuilder.MeasureGroup(); //create it 

                //add the current measure to its correspondent index @ the measure group
                measureGroups[index].AddMeasure(measure);
            });
        });

        //Add to the current header width the constant margin of the line header
        linesHeaderMargin += SCORE_LINE_HEADER_MARGIN;
       
        //Determine which line each measure group is will be place on

        var measureGroupLines = [];

        var currLinesInd = 0;   //current group line index pointer

        var currTotalFixedLength = linesHeaderMargin;   //current iteration fixed length
        var currDenSum = 0; //curretn iteration denominator sum

        //MUST REWRITE THIS ITERATION FOR A BETTER READBILITY AND OPTIMIZATION
        

        for(var a = 0; a < measureGroups.length; a++) {

            measureGroups[a].Organize();    //ensure the current measure is organized

            //update the total fixed length with current measure group fixed length
            var measureGroupTotalFixedWidth = measureGroups[a].GetFixedLength(); 
            
            currTotalFixedLength += measureGroupTotalFixedWidth;  
            //update the current denominator sum with current measure group denominator sum
            currDenSum += measureGroups[a].GetDenominatorSum();

            //get the currDenUnit value
            var currDenUnitValue = (LINE_WIDTH - currTotalFixedLength) / currDenSum;

            //Check whether this den unit value makes some measure group of the current group line 
            //to be below the threshold measure width value
            
            var newLineFlag = false;    //flag to signalize whether a new line must be created or not

            //if the current group line has already been initiated
            if(measureGroupLines[currLinesInd]) {

                //check whether this den unit value is ok for the current measure group
                if(currDenUnitValue < measureGroups[a].GetMinDenUnitLength(MIN_MEASURE_WIDTH)) {
                //(if curr is less, means the measure width will be less than the min measure width passed
                    newLineFlag = true; //set new line flag
                } else {  //if for the current measure group its ok
                    //iterate thru the current line
                    for(var b = 0; b < measureGroupLines[currLinesInd].length; b++) {
                        //if the curr den value is not ok for the current measure group of the line
                        if(currDenUnitValue < measureGroupLines[currLinesInd][b].GetMinDenUnitLength(MIN_MEASURE_WIDTH)) {
                            newLineFlag = true; //set new line flag
                            break;  //stop the iteration, (one measure group not ok is enough)
                        }    
                    }
                }      

            } else {    //if not
                measureGroupLines[currLinesInd] = [];   //inits the new line 
                //This is a bad formated "for loop" due that its behave is different for the first time
                //This section will only happen at the first time       
            }

            if(newLineFlag) {   //if the new line flag is set,
                currLinesInd++; //increase the current line index
                measureGroupLines[currLinesInd] = [];   //inits the new line 
                //set curr total fixed length 
                currTotalFixedLength = linesHeaderMargin + measureGroupTotalFixedWidth;
                //set curr den sum 
                currDenSum = measureGroups[a].GetDenominatorSum(); 
                //update curr unit value
                currDenUnitValue = (LINE_WIDTH - currTotalFixedLength) / currDenSum;           
            } 

            //methods below are the same whether a new line is created or not,
            //there is not strange, since the curr lines index has been increased

            //push the current measure group to the current group line (new line or older) 
            measureGroupLines[currLinesInd].push(measureGroups[a]);
            //updates its current den unit value (new line or older) 
            measureGroupLines[currLinesInd].denUnitValue = currDenUnitValue;     
        }

        //Now we got and array of lines made by measure groups (1 or more measure group per line)
        //Must iterate thru the measure group lines

        var generalBetaLines = []; //variable to store the arrays of visual lines

        //Must iterate thru the lines of measure groups
        for(var c = 0; c < measureGroupLines.length; c++) {
            
            var betaLines = [], //variable to store the visual lines group
                nextMeasurePosition = linesHeaderMargin,   //pointer to be used for measure positioning
                measureGroupLine = measureGroupLines[c],    //current line of measure group
                barsQueue = []; //queue to add the bars of this measure group that must be added
            
            //Iterate thru the current measure group line
            for(var d = 0; d < measureGroupLine.length; d++) {
                var measureGroup = measureGroupLine[d],   //get the current measure group
                    currInd = 0;    //variable to control the index of the visual lines

                //Set the measure group chord positions
                measureGroup.SetChordsPositions(measureGroupLines[c].denUnitValue);

                var mgStartBar = measureGroup.GetStartBar(),
                    mgEndBar = measureGroup.GetEndBar();

                if(mgStartBar)  //if there is a start bar, push it and its coordinate to the bars queue
                    barsQueue.push({ start: true, bar: mgStartBar, xCoord: nextMeasurePosition });

                if(mgEndBar)    //if there is an end bar, push it and its coordinate to the bars queue
                    barsQueue.push({ bar: mgEndBar, xCoord: nextMeasurePosition + measureGroup.GetWidth() });


                //Iterate thru the measures of the current measure group
                measureGroup.ForEachMeasure(function(measure) {

                    //if the current indexed line is not created
                    if(betaLines[currInd] == undefined) {
                        betaLines[currInd] = $G.create("g"); //create its group

                        //get measure header and draw it
                        var currPart = scoreParts.GetItem(currInd),
                            headerObj = drawScoreLineHeader({
                                clef: currPart.GetClef(), 
                                keySig: currPart.GetKeySig(), 
                                timeSig: c == 0 ? currPart.GetTimeSig() : null //if its not the first line, hide the time sig obj
                            });

                        betaLines[currInd].appendChild(headerObj); //append header obj

                        var lineObj = DrawParalelLines(5, LINE_WIDTH, 15); //create the score lines obj
                        betaLines[currInd].appendChild(lineObj); //append the lines to the lines group
                    }    
                
                    //append the current measure to the just create line
                    betaLines[currInd].appendChild(measure.Draw());

                    //Move the measure to the point specified by the next position pointer
                    measure.MoveX(nextMeasurePosition);

                    currInd++;  //increase the line index

                });

                //update the next measure position pointer
                nextMeasurePosition += measureGroup.GetWidth();  
            }

            //Must organize measures vertical positions

            //line group to accomodate all lines of this measure group line and other features, such score bars
            var lineGroup = $G.create("g"), 
                //create an array to store the lines coordinates to be used for score bars positioning
                linesCoords = new Array(betaLines.length); 

            for(var i = 0, nextVPos = 0; i < betaLines.length; i++) {
                var betaLine = betaLines[i],
                    nextPosCeil = Math.ceil(nextVPos - betaLine.getBBox().y);    //round up every coordinate

                linesCoords[i] = nextPosCeil;  

                lineGroup.appendChild(betaLine);//append this beta line to the line group

                betaLine.translate(0, nextPosCeil);
                nextVPos += betaLine.getBBox().height + 10;
            }

            //Draw lines junction bar and bracket if more than one part
            if(moreThanOnePartFlag) {
                var linesJunctionBar = DrawBar("simple", linesCoords);
                linesJunctionBar.translate(0, linesCoords[0]);
                lineGroup.appendChild(linesJunctionBar);

                var bracketObj = DrawBracket(linesCoords[linesCoords.length - 1] - linesCoords[0]);
                bracketObj.translate(-12, linesCoords[0]);
                lineGroup.appendChild(bracketObj);
            }

            //Now that everything is on positions, we add the features that are vertical position dependent, such score bars
            for(var i = 0; i < barsQueue.length; i++) {
                var currBar = barsQueue[i],
                    barObj = DrawBar(currBar.bar, linesCoords);
                    
                //if the bar is a start bar
                if(currBar.start)    
                    //translate to its position (the first line coord is the top)
                    barObj.translate(currBar.xCoord, linesCoords[0]);   
                //if not (its an end bar),
                else 
                    //translate to its position (the first line coord is the top) add 1 for correct position
                    barObj.translate(currBar.xCoord - barObj.getBBox().width + 1, linesCoords[0]);

                lineGroup.appendChild(barObj);
            }

            generalBetaLines.push(lineGroup);
        }

        //Remove all elements currently appended to the general group
        var groupChildren = generalGroup.children;
        while(groupChildren.length > 0)
            generalGroup.removeChild(groupChildren[0]);

        //append debug rect again
        generalGroup.appendChild(debRect1);

        //Organize lines groups vertically
        for(var i = 0, nextVPos = 0; i < generalBetaLines.length; i++) {
            var currLineGroup = generalBetaLines[i];    //get the line group reference
            generalGroup.appendChild(currLineGroup);    //append the line group to the general group
            var nextPosCeil = Math.ceil(nextVPos - currLineGroup.getBBox().y);    //round up every coordinate value
            currLineGroup.translate(12, nextPosCeil);    //translate the line group to its positions
            nextVPos += currLineGroup.getBBox().height + 20;    //increase the next v pos variable
        }

        //translate the general group to a fit position (CHECK WHY NOT WORKING)
        //generalGroup.translate(-generalGroup.getBBox().x);
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

        //Array to store score lines groups
        /*var scoreLinesGroups = []; 

        for(var i = 0; i < measureGroupLines.length; i++) {

            //Array to store the visual lines group
            var scoreLinesGroup = [],
                mGroupLine = measureGroupLines[i],    //current line of measure group

            mGroupLine.ForEachMeasureGroup(function(measureGroup) {



            });
        }*/



        //Now we got an array of lines made by measure groups (1 or more measure group per line)
        //Must iterate thru the measure group lines

        var generalBetaLines = []; //variable to store the arrays of visual lines

        //Must iterate thru the lines of measure groups
        /*for(var c = 0; c < measureGroupLines.length; c++) {
            
            var betaLines = [], //variable to store the visual lines group
                measureGroupLine = measureGroupLines[c],    //current line of measure group
                //pointer to be used for measure positioning
                nextMeasurePosition = measureGroupLine.GetHeaderMargin(),   
                barsQueue = []; //queue to add the bars of this measure group that must be added
            

            measureGroupLine.ForEachMeasureGroup(function(measureGroup, index) {
                var currInd = 0;    //variable to control the index of the visual lines

                //Set the measure group chord positions
                measureGroup.SetChordsPositions(measureGroupLine.GetDenUnitValue());

                var mgStartBar = measureGroup.GetStartBar(),
                    mgEndBar = measureGroup.GetEndBar();

                if(mgStartBar)  //if there is a start bar, push it and its coordinate to the bars queue
                    barsQueue.push({ start: true, bar: mgStartBar, xCoord: nextMeasurePosition });

                if(mgEndBar)    //if there is an end bar, push it and its coordinate to the bars queue
                    barsQueue.push({ bar: mgEndBar, xCoord: nextMeasurePosition + measureGroup.GetWidth() });


                //Iterate thru the measures of the current measure group
                measureGroup.ForEachMeasure(function(measure) {

                    //if the current indexed line is not created
                    if(betaLines[currInd] == undefined) {
                        betaLines[currInd] = $G.create("g"); //create its group

                        //get measure header and draw it
                        var currPart = scoreParts.GetItem(currInd),
                            headerObj = drawScoreLineHeader({
                                clef: measure.attr.clef, 
                                keySig: measure.attr.keySig, 
                                timeSig: c == 0 ? measure.attr.timeSig : null //if its not the first line, hide the time sig obj
                            });

                        betaLines[currInd].appendChild(headerObj); //append header obj

                        var lineObj = DrawParalelLines(5, LINE_WIDTH, 15); //create the score lines obj
                        betaLines[currInd].appendChild(lineObj); //append the lines to the lines group
                    }    
                
                    //append the current measure to the just create line
                    betaLines[currInd].appendChild(measure.Draw());

                    //Move the measure to the point specified by the next position pointer
                    measure.MoveX(nextMeasurePosition);

                    currInd++;  //increase the line index

                });

                //update the next measure position pointer
                nextMeasurePosition += measureGroup.GetWidth();  
            });




            //Must organize measures vertical positions

            //line group to accomodate all lines of this measure group line and other features, such score bars
            var lineGroup = $G.create("g"), 
                //create an array to store the lines coordinates to be used for score bars positioning
                linesCoords = new Array(betaLines.length); 

            for(var i = 0, nextVPos = 0; i < betaLines.length; i++) {
                var betaLine = betaLines[i],
                    nextPosCeil = Math.ceil(nextVPos - betaLine.getBBox().y);    //round up every coordinate

                linesCoords[i] = nextPosCeil;  

                lineGroup.appendChild(betaLine);//append this beta line to the line group

                betaLine.translate(0, nextPosCeil);
                nextVPos += betaLine.getBBox().height + 10;
            }

            //Draw lines junction bar and bracket if more than one part
            if(moreThanOnePartFlag) {
                var linesJunctionBar = DrawBar("simple", linesCoords);
                linesJunctionBar.translate(0, linesCoords[0]);
                lineGroup.appendChild(linesJunctionBar);

                var bracketObj = DrawBracket(linesCoords[linesCoords.length - 1] - linesCoords[0]);
                bracketObj.translate(-12, linesCoords[0]);
                lineGroup.appendChild(bracketObj);
            }

            //Now that everything is on positions, we add the features that are vertical position dependent, such score bars
            for(var i = 0; i < barsQueue.length; i++) {
                var currBar = barsQueue[i],
                    barObj = DrawBar(currBar.bar, linesCoords);
                    
                //if the bar is a start bar
                if(currBar.start) {  
                    var startBarBox = barObj.getBBox();
                    //translate to its position (the first line coord is the top)
                    barObj.translate(currBar.xCoord - startBarBox.x - startBarBox.width, linesCoords[0]);
                }   
                //if not (its an end bar),
                else 
                    //translate to its position (the first line coord is the top) add 1 for correct position
                    barObj.translate(currBar.xCoord - barObj.getBBox().x, linesCoords[0]);

                lineGroup.appendChild(barObj);
            }

            generalBetaLines.push(lineGroup);
        }*/



        //Remove all elements currently appended to the general group
        var groupChildren = generalGroup.children;
        while(groupChildren.length > 0)
            generalGroup.removeChild(groupChildren[0]);

        //append debug rect again
        generalGroup.appendChild(debRect1);

        //Organize lines groups vertically
        /*for(var i = 0, nextVPos = 0; i < generalBetaLines.length; i++) {
            var currLineGroup = generalBetaLines[i];    //get the line group reference
            generalGroup.appendChild(currLineGroup);    //append the line group to the general group
            var nextPosCeil = Math.ceil(nextVPos - currLineGroup.getBBox().y);    //round up every coordinate value
            currLineGroup.translate(12, nextPosCeil);    //translate the line group to its positions
            nextVPos += currLineGroup.getBBox().height + 20;    //increase the next v pos variable
        }*/

        //translate the general group to a fit position (CHECK WHY NOT WORKING)
        //generalGroup.translate(-generalGroup.getBBox().x);


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
        headerMargin = 0,
        groupLines = [];    //Array to store the lines of this measure group line

    //--------------------OBJECT CONSTRUCTION ROUTINES-----------------

    //Draw all the headers to check the highest one
    firstMeasureGroup.ForEachMeasure(function(measure, index) {
        //Get lines header obj
        var partHeaderObj = drawScoreLineHeader({ 
            clef: measure.attr.clef, 
            keySig: measure.attr.keySig, 
            timeSig: measure.attr.timeSig 
        }), 
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
    //this.Add(firstMeasureGroup); (METHOD CALLED AFTER ADD FUNCTION IS DECLARED)

    /*measureGroups.push(firstMeasureGroup);

    //Update line values
    if(firstMeasureGroup.GetStartBar()) {
        var barWidth = DrawBar(firstMeasureGroup.GetStartBar(), [0, 1]).getBBox().width;
        lineFixedLength += barWidth;
        //headerMargin += barWidth;
    }

    if(firstMeasureGroup.GetEndBar())
        lineFixedLength += DrawBar(firstMeasureGroup.GetEndBar(), [0, 1]).getBBox().width;

    lineFixedLength += firstMeasureGroup.GetFixedLength();
    lineDenominatorSum += firstMeasureGroup.GetDenominatorSum();*/ 



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

        //Update line values
        if(measureGroup.GetStartBar())
            lineFixedLength += DrawBar(measureGroup.GetStartBar(), [0, 1]).getBBox().width;

        if(measureGroup.GetEndBar())
            lineFixedLength += DrawBar(measureGroup.GetEndBar(), [0, 1]).getBBox().width;

        lineFixedLength += measureGroup.GetFixedLength();
        lineDenominatorSum += measureGroup.GetDenominatorSum();

        //Add the measures of this measure group to the correpondent lines
        measureGroup.ForEachMeasure(function(measure, index) {
            groupLines[index].appendChild(measure.Draw());
        });
    }

    //Add the first measure group
    this.Add(firstMeasureGroup);

    this.CheckFit = function(measureGroup) {
        //Check whether these values fits inside this line without crossing the max and min values

        //WE MUST CHECK ATTRIBUTES CHANGES THAT CHANGES LINES BEFORE, SUCH CLEF, TIME AND KEY CHANGES, AND BARS
        //(CHECK HOW HANDLE BARS PRIORITY, CAUSE A PREVIOUS MEASURE SAYS A DOUBLE BAR AND THE NEXT, A REPEAT FORWARD BAR)

        //Values for checking purposes
        var checkFixedLength = lineFixedLength + measureGroup.GetFixedLength(),
            checkDenSum = lineDenominatorSum + measureGroup.GetDenominatorSum(),
            checkDenUnitValue,
            fitResult = true;

        //Add bars length
        if(measureGroup.GetStartBar())
            checkFixedLength += DrawBar(measureGroup.GetStartBar(), [0, 1]).getBBox().width;

        if(measureGroup.GetEndBar())
            checkFixedLength += DrawBar(measureGroup.GetEndBar(), [0, 1]).getBBox().width;

        checkDenUnitValue = (LINE_WIDTH - checkFixedLength) / checkDenSum;

        //check whether this den unit value is ok for the current measure group
        if(checkDenUnitValue < measureGroup.GetMinDenUnitLength(MIN_MEASURE_WIDTH)) {
            fitResult = false;
        } else {  //if for the current measure group its ok

            //iterate thru all the groups of this lines
            for(var b = 0; b < measureGroups.length; b++) {
                //if the curr den value is not ok for the current measure group of the line
                if(checkDenUnitValue < measureGroups[b].GetMinDenUnitLength(MIN_MEASURE_WIDTH)) {
                    fitResult = false;
                    break;  //stop the iteration, (one measure group not ok is enough)
                }    
            }
        }

        return fitResult;
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
            vPosPointer += currGroupBox.height + 10;
        }

        //Draw lines junction bar and bracket if more than one part
        if(groupLines.length > 1) {
            var linesJunctionBar = DrawBar("simple", linesCoords);
            linesJunctionBar.translate(0, linesCoords[0]);
            linesGroup.appendChild(linesJunctionBar);

            var bracketObj = DrawBracket(linesCoords[linesCoords.length - 1] - linesCoords[0]);
            bracketObj.translate(-12, linesCoords[0]);
            linesGroup.appendChild(bracketObj);
        }

        //Organize measure groups positions (chords, bars and measures)
        var hPosPointer = headerMargin, //horizontal position pointer
            denUnitValue = (LINE_WIDTH - lineFixedLength) / lineDenominatorSum;
        for(var i = 0; i < measureGroups.length; i++) {
            currMeasureGroup = measureGroups[i];
            currMeasureGroup.SetChordsPositions(denUnitValue);

            if(currMeasureGroup.GetStartBar()) {
                var startBar = DrawBar(currMeasureGroup.GetStartBar(), linesCoords),
                    startBarBox = startBar.getBBox();
                linesGroup.appendChild(startBar);
                startBar.translate(hPosPointer - startBarBox.x, linesCoords[0]);
                hPosPointer += startBarBox.width;
            }

            currMeasureGroup.ForEachMeasure(function(measure) {
                measure.MoveX(hPosPointer);
            });

            hPosPointer += currMeasureGroup.GetWidth();

            if(currMeasureGroup.GetEndBar()) {
                var endBar = DrawBar(currMeasureGroup.GetEndBar(), linesCoords),
                    endBarBox = endBar.getBBox();
                linesGroup.appendChild(endBar);
                endBar.translate(hPosPointer - endBarBox.x, linesCoords[0]);
                hPosPointer += endBarBox.width;
            }     
        }

        return linesGroup;
    }
}


function drawScoreLineHeader(attr) {
    var attrGroup = document.createElementNS(xmlns, "g"),
        nextPos = SCORE_LINE_LEFT_MARGIN;

    //if a clef has been specified
    if(attr.clef != undefined) {
        var clefObj = DrawScoreClef(attr.clef);
        attrGroup.appendChild(clefObj);
        clefObj.translate(nextPos, 0);
        nextPos += clefObj.getBBox().width + SCORE_LINE_HEADER_MARGIN;

        //if the clef key is specified and is diferent from 0 (value 0 at if statement is equal to false)
        if(attr.keySig) {
            var keyObj = DrawKeySignature(attr.keySig);
            //translate the key sig according to the clef

            switch(attr["clef"]) {
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

            attrGroup.appendChild(keyObj);
            nextPos += keyObj.getBBox().width + SCORE_LINE_HEADER_MARGIN;
        }

        //if the clef time has been specified
        if(attr.timeSig != undefined) {
            var timeSigMembers = attr.timeSig.split(","),
                timeObj;

            //If the object hasn't been splited, means time sig symbol 
            if(timeSigMembers.length < 2)
                timeObj = DrawTimeSymbol(timeSigMembers[0]);
            else //if not, pass thetime sig values
                timeObj = DrawTimeSig(timeSigMembers[0], timeSigMembers[1]); 

            attrGroup.appendChild(timeObj);
            timeObj.translate(nextPos, 0);
            nextPos += timeObj.getBBox().width + SCORE_LINE_HEADER_MARGIN;
        }
    }

    return attrGroup;
}
