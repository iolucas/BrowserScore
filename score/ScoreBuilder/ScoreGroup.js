//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();   

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- SCORE GROUP OBJECT --------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

ScoreBuilder.ScoreGroup = function() {

    var selfRef = this,

        generalGroup = $G.create("g"),   //group to fit all the score part lines
        scoreParts = new List(),   //list to store the score parts within this score group
        //scoreLines = new List();    //list to store the score lines visual objects

        SCORE_LINE_LEFT_MARGIN = 10,
        SCORE_LINE_HEADER_MARGIN = 10,
        //SCORE_LINE_LENGTH = 1500,
        SCORE_TOP_MARGIN = 50; //min value for a top margin for the scores


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

    this.Organize = function() {

        //Measure group array
        var measureGroups = [],
            linesHeaderMargin = 0,
            moreThanOnePartFlag = scoreParts.Count() > 1;   //flag signalizing whehter we got more than one part on this score group

        //iterate thru all score parts and populate the measure groups array
        scoreParts.ForEach(function(part) {
            var partHeaderObj = drawScoreLineHeader({clef: part.GetClef(), key: part.GetKeySig(), time: part.GetTimeSig() }),
                partObjBox = partHeaderObj.getBBox(),
                partObjWidth = partObjBox.width + partObjBox.x; //get current part header total width

            //if the current part header width is higher than the current header width
            if(partObjWidth > linesHeaderMargin)
                linesHeaderMargin = partObjWidth;   //set the current part header width as the new one

            var mGroupInd = 0;  //var to store the measure groups index
            //iterate thru the measures of the current part
            part.ForEachMeasure(function(measure) {
                //if the measure index is not created at the measure group index,
                if(!measureGroups[mGroupInd])
                    measureGroups[mGroupInd] = new ScoreBuilder.MeasureGroup(); //create it 

                //add the current measure to its correspondent index @ the measure group
                measureGroups[mGroupInd].AddMeasure(measure);
                mGroupInd++;    //increase the measure group indexer
            });
        });

        //Add to the current header width the constant margin of the line header
        linesHeaderMargin += SCORE_LINE_HEADER_MARGIN;
       
        //Determine which line each measure group is will be place on

        var LINE_WIDTH = 1480,  //constant value to be used to set the score line size
            MIN_MEASURE_WIDTH = 300;//constante value to be used to set measure min width

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
                                key: currPart.GetKeySig(), 
                                time: c == 0 ? currPart.GetTimeSig() : null //if its not the first line, hide the time sig obj
                            });

                        betaLines[currInd].appendChild(headerObj); //append header obj

                        var lineObj = DrawScoreLines(LINE_WIDTH); //create the score lines obj
                        betaLines[currInd].appendChild(lineObj); //append the lines to the lines group
                    }    
                
                    //append the current measure to the just create line
                    betaLines[currInd].appendChild(measure.Draw());

                    //Move the measure to the point specified by the next position pointer
                    measure.MoveTo(nextMeasurePosition);

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
                bracketObj.fill("#222");
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
                    //translate to its position (the first line coord is the top)
                    barObj.translate(currBar.xCoord - barObj.getBBox().width, linesCoords[0]);

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
                    case "F":
                        keyObj.translate(nextPos, 15);
                        break;

                    case "C":
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

}
