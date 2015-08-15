xmlns = "http://www.w3.org/2000/svg";
xlink = "http://www.w3.org/1999/xlink";  

var ScoreClef = { G:0, F:1, C:2 };

/*function ScoreGroup(lineLength) {    
    
    this.NewScoreLine = function(clef) {
                
        
        
        
    }
}*/

function CreateScoreLine(lineLength, x, y) {

    var lineHeight = 300;   //score line height

    var scoreLine = document.createElementNS(xmlns, "g");   //group to organize score lines member
    scoreLine.setAttribute("transform", "translate(" + x + " " + y + ")");  //translate the group to its specified position

    scoreLine.scoreY = y; //set this new member to verify exact position of mousemove events
    
    var lines = DrawScoreLines(lineLength); //create score lines
    scoreLine.appendChild(lines);   //append lines to the group
    //Calculate coordinates to place the lines at the center of the group
    lines.setAttribute("transform", "translate(0 " + ((lineHeight - 60) / 2) + ")");

    var mainContainer = CreateCavacoContainer(lineLength, lineHeight);
    mainContainer.cavaco.SetBorder(1, "#000");
    scoreLine.appendChild(mainContainer);

    mainContainer.cavaco.AddElement(createSpace(10));

    var clef = DrawScoreLinesElement(ScoreElement.GClef);
    mainContainer.cavaco.AddElement(clef);
    clef.cavaco.MoveTo(clef.cavaco.x, clef.cavaco.y + 4);

    mainContainer.cavaco.AddElement(createSpace(10));
    mainContainer.cavaco.AddElement(DrawScoreLinesElement(ScoreElement.TimeSig44));
    mainContainer.cavaco.AddElement(createSpace(30));

    var symbolSpace = CreateSymbolsSpace();
    mainContainer.cavaco.AddElement(symbolSpace);
    //mainContainer.cavaco.AddElement(CreateSymbolsSpace());

    return scoreLine;
}

function CreateSymbolsSpace() {
    var symbolsGroup = document.createElementNS(xmlns, "g");

    var space = document.createElementNS(xmlns, "rect");  //create new line
    space.setAttribute("width", 30);
    space.setAttribute("height", 300);
    space.setAttribute("stroke", "#000");
    space.setAttribute("fill", "rgba(0,0,0,.0)");
    //space.setAttribute("fill", "none");
    space.setAttribute("stroke-width", 0);
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
    var space = document.createElementNS(xmlns, "rect");  //create new line
    space.setAttribute("width", length);
    space.setAttribute("height", 1);
    return space;
}


function ScoreLine(lineLength, x, y) {
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
}
