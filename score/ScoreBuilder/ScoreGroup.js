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


    /*var debRect1 = $G.create("rect");
    debRect1.setAttribute("fill", "green");
    debRect1.setAttribute("height", 15);
    debRect1.setAttribute("width", 15);
    generalGroup.appendChild(debRect1);*/

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

    //function createLine(attributes) {}

    this.Organize = function() {

        //Measure group array
        var measureGroups = [];
        var linesHeaderMargin = 0;

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

        var LINE_WIDTH = 1500,  //constant value to be used to set the score line size
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

                //lineGroup.barsQueue = [];   //array to store the bars to be draw at this line group
            
            //Iterate thru the current measure group line
            for(var d = 0; d < measureGroupLine.length; d++) {
                var measureGroup = measureGroupLine[d],   //get the current measure group
                    currInd = 0;    //variable to control the index of the visual lines
                    //firstMeasure = true;

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
                                time: currPart.GetTimeSig()
                            });

                        betaLines[currInd].appendChild(headerObj); //append header obj

                        var lineObj = DrawScoreLines(LINE_WIDTH); //create the score lines obj
                        betaLines[currInd].appendChild(lineObj); //append the lines to the lines group
                    }

                    //if this is the first measure of a measure group, 
                    /*if(firstMeasure) {
                        //Create a barObj array to store the bars data that will be appended to this line later 
                        //and append this barObj array to the current bar line
                        if(betaLines[currInd].barObjs == undefined)    
                            betaLines[currInd].barObjs = [];    

                        //push the measure group bars data to the current line
                        betaLines[currInd].barObjs.push({ 
                            start: measureGroup.GetStartBar(), 
                            startCoord: nextMeasurePosition,
                            end: measureGroup.GetEndBar(), 
                            endCoord: nextMeasurePosition + measureGroup.GetWidth()
                        });
                    }*/       
                
                    //append the current measure to the just create line
                    betaLines[currInd].appendChild(measure.Draw());

                    //Move the measure to the point specified by the next position pointer
                    measure.MoveTo(nextMeasurePosition);

                    currInd++;  //increase the line index

                    //firstMeasure = false;
                });

                //update the next measure position pointer
                //nextMeasurePosition += currMGroup.GetWidth() + currMGroup.endBarWidth;
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

            //generalBetaLines.push(betaLines);   //put this array of visual lines in the general beta lines array
            generalBetaLines.push(lineGroup);
        }

        //Remove all elements currently appended to the general group
        var groupChildren = generalGroup.children;
        while(groupChildren.length > 0)
            generalGroup.removeChild(groupChildren[0]);

        //Organize lines groups vertically
        for(var i = 0, nextVPos = 0; i < generalBetaLines.length; i++) {
            var currLineGroup = generalBetaLines[i];    //get the line group reference
            generalGroup.appendChild(currLineGroup);    //append the line group to the general group
            var nextPosCeil = Math.ceil(nextVPos - currLineGroup.getBBox().y);    //round up every coordinate value
            currLineGroup.translate(0, nextPosCeil);    //translate the line group to its positions
            nextVPos += currLineGroup.getBBox().height + 90;    //increase the next v pos variable
        }



        return;

        var nextVerticalPos = 0;    //variable to point to the vertical position

        var betaBarDrawQueue = [];

        for(var e = 0; e < generalBetaLines.length; e++) {
        
            var betaLines = generalBetaLines[e],
                currBarObjRef = null;

            //position lines vertically
            for(var n = 0; n < betaLines.length; n++) {
                generalGroup.appendChild(betaLines[n]);
                var nextPosCeil = Math.ceil(nextVerticalPos - betaLines[n].getBBox().y);    //round up every coordinate
                betaLines[n].translate(0, nextPosCeil);
                nextVerticalPos += betaLines[n].getBBox().height + 10;

                //if the current bar line got the bar objects, get the top coord
                if(betaLines[n].barObjs) {
                    currBarObjRef = betaLines[n].barObjs;
                    currBarObjRef.lineCoords = [];
                    betaBarDrawQueue.push(currBarObjRef);
                }

                //Push the current coordinate of the line to lineCoords array
                //currBarObjRef.lineCoords.push(nextPosCeil);
                /*betaLines[n].barObjs.topCoord = nextPosCeil;

                //if its the last line, get the line coordinate, plus the standard high of the score line
                if(n == betaLines.length - 1)
                    betaBarDrawQueue[betaBarDrawQueue.length - 1].bottomCoord = nextPosCeil + 60; */   

            }

            nextVerticalPos += 90;
        }



        //MAYBE CREATE GROUPS FOR EACH BETALINES GROUP AND ADD BARS TO THEM

        //Draw bar lines
        /*for(var m = 0; m < betaBarDrawQueue.length; m++) {
            //get the current bar obj array
            var barObjArray = betaBarDrawQueue[m],
                //get the current bar top coordinate
                barTopCoord = barObjArray.lineCoords[0],
                //get the current bar height (botom coord - top coord)
                barSize = barObjArray.lineCoords[barObjArray.lineCoords.length - 1] + 60 - barTopCoord;
            
            for(var o = 0; o < barObjArray.length; o++) {
                var barObj = barObjArray[o];
                
                if(barObj.start) {
                    //var startBar = DrawBar(barObj.start, barSize);
                    var startBar = DrawBar(barObj.start, barObjArray.lineCoords);
                    generalGroup.appendChild(startBar); 
                    startBar.translate(barObj.startCoord, barTopCoord);    
                }

                if(barObj.end) {
                    //var endBar = DrawBar(barObj.end, barSize);
                    var endBar = DrawBar(barObj.end, barObjArray.lineCoords);
                    generalGroup.appendChild(endBar);
                    endBar.translate(barObj.endCoord - endBar.getBBox().width, barTopCoord);    
                } 
            }
        }*/


        

        /*var totalFixedLength = linesHeaderMargin,   
        //variable to keep the total fixed length of all the measure groups
            totalDenSum = 0;    //variable to keep the total denominators sum of all the measure groups
            

        //iterate thru the measure groups passed
        for(var i = 0; i < measureGroupsLength; i++) {
            measureGroups[i].Organize();    //ensure they are organized
            //sum the curr measure group fixed length to the total fixed length
            totalFixedLength += measureGroups[i].GetFixedLength();  
            //sum the curr measure group den sum to the total denominator sum
            totalDenSum += measureGroups[i].GetDenominatorSum();
        }

        //get the unit length to be used for chord positioning
        var unitLength = (LINE_WIDTH - totalFixedLength) / totalDenSum;

        //Iterate thry all measure groups
        for(var j = 0; j < measureGroupsLength; j++) 
            //set their chords positions according to the unit length value
            measureGroups[j].SetChordsPositions(unitLength);*/




        //set measures to their lines
        /*var betaLines = [], //variable to store the visual lines group
            nextMeasurePosition = linesHeaderMargin;   //pointer to be used for measure positioning

        //Iterate thru all measures passed
        for(var k = 0; k < measureGroupsLength; k++) {
            
            var currInd = 0;    //variable to control the index of the visual lines

            //iterate thru the measures of the current measure group
            measureGroups[k].ForEachMeasure(function(measure) {

                //if the current indexed line is note created
                if(betaLines[currInd] == undefined) {
                   betaLines[currInd] = $G.create("g"); //create its group

                    //get measure header and draw it
                    var currPart = scoreParts.GetItem(currInd),
                        headerObj = drawScoreLineHeader({
                            clef: currPart.GetClef(), 
                            key: currPart.GetKeySig(), 
                            time: currPart.GetTimeSig()
                        });

                    betaLines[currInd].appendChild(headerObj); //append header obj

                    var lineObj = $G.create("path"); //create the lines object
                    lineObj.setAttribute("d", GetScoreLinesPath(LINE_WIDTH)); //draw the lines
                    lineObj.setAttribute("stroke", "#000");  //set lines color
                    betaLines[currInd].appendChild(lineObj); //append the lines to the lines group
                }
                
                //append the current measure to the just create line
                betaLines[currInd].appendChild(measure.Draw());

                //Move the measure to the point specified by the next position pointer
                measure.MoveTo(nextMeasurePosition);

                currInd++;  //increase the line index

                //console.log(measureGroups[k].GetMinDenUnitLength(300));
            });

            //update the next measure position pointer
            nextMeasurePosition += measureGroups[k].GetWidth();                   
        }*/



        //var betaGroup = $G.create("g"); //create general group to put lines
        /*var nextVerticalPos = 0;    //variable to point to the vertical position

        var groupChildren = generalGroup.children;

        //Remove all elements currently appended to the general group
        while(groupChildren.length > 0)
            generalGroup.removeChild(groupChildren[0]);

        //position lines vertically
        for(var n = 0; n < betaLines.length; n++) {
           generalGroup.appendChild(betaLines[n]);
           betaLines[n].translate(0, nextVerticalPos - betaLines[n].getBBox().y);
           nextVerticalPos += betaLines[n].getBBox().height + 50;
        }*/

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
