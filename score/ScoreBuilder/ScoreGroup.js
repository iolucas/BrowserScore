//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();   

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- SCORE GROUP OBJECT --------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

ScoreBuilder.ScoreGroup = function() {
    //Creates a new score line passing the line length and the minimum measure length to be kept in a line, otherwise it will overflow

    //KEEP WRITING THIS SCORE GROUP CLASS 
    //IT WILL ALLOCATE MEASURES TO THE LINES AN ORGANIZE AND SYNC LINES

    //TIME SIGS WILL BE CHOOSED BASED ON THE FIRST SCORE PART
    //BARS WILL BE BASED ON THE FIRST SCORE PART, ONLY IN CASE OF REPEAT THAT HAS CIRCLES WILL BE USED THE MEASURE GROUP TO CREATE, 
    //THE OTHER BARS WILL BE PUTTED AT THE MEASURE GROUP

    var selfRef = this,

        generalGroup = $G.create("g"),   //group to fit all the score part lines
        scoreParts = new List();   //list to store the score parts within this score group
        //scoreLines = new List();    //list to store the score lines visual objects

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

    var measureGroups = new List();

    this.Organize = function() {
        //MUST GENERATE THE MEASURES GROUPS (PROBABLY ADD TO THEM WHEN THE SCORE PART IS JUST ADDED)
        //BE WARNED TO WHEN A MIDDLE MEASURE IS INSERTED AT THE SCORE PART (PARTMODIFIED FLAG IS NEEDED)

        //SCORE PART MUST ORGANIZE THE MEASURES POSITIONS

        //Measure group array
        var measureGroups = [];

        scoreParts.ForEach(function(part) {
            var mGroupInd = 0;
            part.ForEachMeasure(function(measure) {
                if(!measureGroups[mGroupInd])
                    measureGroups[mGroupInd] = new ScoreBuilder.MeasureGroup();
                        
                measureGroups[mGroupInd].AddMeasure(measure);
                mGroupInd++;
            });
        });

        var totalFixedLength = 0,   //variable to keep the total fixed length of all the measure groups
            totalDenSum = 0,    //variable to keep the total denominators sum of all the measure groups
            LINE_WIDTH = 1500;  //constante value to be used to set the score line size
            measureGroupsLength = measureGroups.length; //get the amount of measures passed

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
            measureGroups[j].SetChordsPositions(unitLength);

        //set measures to their lines
        var betaLines = [], //variable to store the visual lines group
            nextMeasurePosition = 0;   //pointer to be used for measure positioning

        //Iterate thru all measures passed
        for(var k = 0; k < measureGroupsLength; k++) {
            
            var currInd = 0;    //variable to control the index of the visual lines

            //iterate thru the measures of the current measure group
            measureGroups[k].ForEachMeasure(function(measure) {

                //if the current indexed line is note created
                if(betaLines[currInd] == undefined) {
                   betaLines[currInd] = $G.create("g"); //create its group
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

                console.log(measureGroups[k].GetMinDenUnitLength(300));
            });

            //update the next measure position pointer
            nextMeasurePosition += measureGroups[k].GetWidth();                   
        }

        //var betaGroup = $G.create("g"); //create general group to put lines
        var nextVerticalPos = 0;    //variable to point to the vertical position

        var groupChildren = generalGroup.children;
        //console.log(groupChildren);
        //alert("Oi");

        while(groupChildren.length > 0)
            generalGroup.removeChild(groupChildren[0]);
        /*for(var i = 0; i < groupChildren.length; i++) {
            //console.log(groupChildren.length);    
            //alert("Oi");
            //console.log(groupChildren[i]);
            generalGroup.removeChild(groupChildren[i]);
            i--; 
        }  */

        //position lines vertically
        //console.log(betaLines.length);
        for(var n = 0; n < betaLines.length; n++) {

           generalGroup.appendChild(betaLines[n]);
//alert("Oi"); 
           betaLines[n].translate(0, nextVerticalPos - betaLines[n].getBBox().y);
           nextVerticalPos += betaLines[n].getBBox().height + 50;
        }

        //console.log(groupChildren);

        //return betaGroup;




        /*var measuresQty = 0;

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
        console.log(measuresTimeArrays);*/

    }
/*
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
        
    }*/

}
