xmlns = "http://www.w3.org/2000/svg";
xlink = "http://www.w3.org/1999/xlink";  

//Pseudo Namespace to fit score objects classes
var ScoreBuilder = new function() {
    ///create notes, chords, measures and score class to manage all the score features
    ///lets begin with the note element placing at a chord


    var SCORE_LINE_LEFT_MARGIN = 10,
        SCORE_LINE_HEADER_MARGIN = 10,
        //SCORE_LINE_LENGTH = 1500,
        SCORE_TOP_MARGIN = 50, //min value for a top margin for the scores
        DEBUG_RECTANGLES = true;
  

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
