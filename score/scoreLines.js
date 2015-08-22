xmlns = "http://www.w3.org/2000/svg";
xlink = "http://www.w3.org/1999/xlink";  

var lineHeight = 300;   //score line height


function createScoreLine(lineLength, headerProperties) {

    //Create container to fit all objects
    var lineContainer = $Aria.CreateContainer({ minWidth: lineLength, height: lineHeight });
    //lineContainer.SetBorder(1, "blue");

    //Create score lines
    var lines = DrawScoreLines(lineLength); 
    //Calculate coordinates to place the lines at the center of the group
    SetTransform(lines, { translate: [0, (lineHeight - 60) / 2] });
    //Append lines to the group
    lineContainer.Build().appendChild(lines);   

    //AddScore header
    lineContainer.AddElement(createScoreLineHeader(headerProperties));

    //Append function to be used for insert a measure @ the score line
    lineContainer.InsertMeasure = function(position) {
        //if the position were not specified, assume it is the last one
        if(!position) position = lineContainer.Count();
        //create new score measure, passing a function to be used to get the current number of symbols spaces on this line
        var measure = createScoreMeasure();
        //insert it in the specified position
        lineContainer.InsertAt(position, measure);

        return measure; //return the just created measure
    }

    //append function to update the symbols spaces to adjust the score line correctly
    lineContainer.UpdateSpaces = function() {

        var symbolSpaceCount = 0,   //var to sum the number of symbols space
            fixedSymbolsLength = 0; //var to sum the length of all fixed symbols at the score line

        //Got to iterate thry all the line to get the fixed symbols total length and how many symbols space there is

        lineContainer.ForEach(function(lineElement)  {   //iterate thru all elements at the line container           
            if(lineElement.toString() == "ScoreMeasure") {  //check whether the element is a score measure
                lineElement.ForEach(function(measureElement) {    //if it is, iterate thru all its element 
                    if(measureElement.toString() == "SymbolSpace")   //if the element is a symbol space
                        symbolSpaceCount += 1 / measureElement.denominator;   //gets its denominator and sum its fraction value
                    else //if not
                        fixedSymbolsLength += measureElement.GetWidth();   //get its width and sum
                });
            } else //if it is not a score measure
                fixedSymbolsLength += lineElement.GetWidth();   //get its width and sum
        });

        //now we got the values, we can adjust their sizes
        var unitSpaceSize = (lineLength - fixedSymbolsLength) / symbolSpaceCount;   //calc the unitSpace size

        lineContainer.ForEach(function(lineElement)  {   //iterate thru all elements at the line container           
            if(lineElement.toString() == "ScoreMeasure") {  //check whether the element is a score measure
                lineElement.ForEach(function(measureElement) {    //if it is, iterate thru all its element 
                    if(measureElement.toString() == "SymbolSpace")   //if the element is a symbol space
                        measureElement.SetWidth(unitSpaceSize); //set this space symbol new width
                });
            } 
        });
    }

    return lineContainer;   //return the create line container
}

//Function to create a ScoreMeasure object inherited from Aria rectangle
function createScoreMeasure() {
    var measure = $Aria.CreateContainer(({ minWidth: 10, height: lineHeight }));
    measure.SetBorder(1, "#000");
    //measure.SetBackgroundColor("rgba(0,0,64,.5)");

    measure.AddSymbol = function() {
        var symbol = $Aria.CreateCircle( 50, "#333");
        measure.AddElement(symbol);
        return symbol;
    }

    measure.AddScoreElement = function(scoreElement) {
        //var elemCont = 

    }

    measure.AddSymbolSpace = function(sizeDenominator) {
        var s = createSymbolSpace(sizeDenominator);
        measure.AddElement(s);
        return s;
    }

    //Overwrite the current toString method
    measure.toString = function() { return "ScoreMeasure"; }

    return measure;
}

function createSymbolSpace(denominator) {
    if(!denominator || denominator < 1)
        throw "Invalid denominator";

    var space = $Aria.CreateRectangle(10, 50, "rgba(0,128,255,.7)"); //create the rectangle to fill the space
    //space.Build().setAttribute("stroke", "#000");
    //space.Build().setAttribute("stroke-width", 1);
    //var to hold the denominator value of this space
    space.denominator = denominator;

    //method to set the width of the symbol space
    space.SetWidth = function(symbolSpaceSize) { 
        space.SetSize(symbolSpaceSize / space.denominator);
    }

    //overwrite the to string function
    space.toString = function() { return "SymbolSpace"; }

    return space;
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
