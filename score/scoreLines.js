xmlns="http://www.w3.org/2000/svg";
xlink="http://www.w3.org/1999/xlink";  

var ScoreClef = { G:0, F:1, C:2 };

/*function ScoreGroup(lineLength) {    
    
    this.NewScoreLine = function(clef) {
                
        
        
        
    }
}*/

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

var teste = new ScoreLine(890, 50.5, 100.5);
document.documentElement.appendChild(teste.GetObj());
teste.SetClef(ScoreClef.G);
teste.SetSig(44);


/*
var root = document.createElementNS(xmlns, "g");
    root.setAttribute("transform","translate(50.5 50.5)");


root.appendChild(DrawScoreLines(890)); 
root.appendChild(DrawScoreLinesElement(ScoreElement.TimeSig44));
root.appendChild(DrawScoreLinesElement(ScoreElement.GClef));
root.appendChild(DrawScoreLinesElement(ScoreElement.SimpleBar));
  

document.documentElement.appendChild(root);*/
