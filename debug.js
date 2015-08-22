

var score1 = ScoreBuilder.CreateLine(1500, { GClef: true, TimeSig44: true});   //create a scoreline with 890 length
document.documentElement.appendChild(score1.Build());

score1.MoveTo(10.5, 10.5);

score1.InsertMeasure().AddSymbolSpace(1);
score1.InsertMeasure().AddSymbolSpace(1);

score1.UpdateSpaces();

var score2 = ScoreBuilder.CreateLine(1500, { GClef: true, TimeSig44: false});   //create a scoreline with 890 length
document.documentElement.appendChild(score2.Build());

score2.MoveTo(10.5, score1.GetHeight() + 21.5);

score2.InsertMeasure().AddSymbolSpace(1);
var m = score2.InsertMeasure();
m.AddSymbol();
m.AddSymbolSpace(2);

score2.UpdateSpaces();

//document.documentElement.appendChild(CreateScoreLine(890, 10.5, 312.5));



/*var scoreLine = new ScoreLine(890, 50.5, 100.5);
document.documentElement.appendChild(scoreLine.GetObj());
scoreLine.SetClef(ScoreClef.G);
scoreLine.SetSig(44);*/


/*var cont1 = CreateCavacoContainer(1200, 500);
cont1.cavaco.SetBorder(1, "#000");
cont1.cavaco.MoveTo(10.5, 10.5);
document.documentElement.appendChild(cont1);*/

/*
for (var i = 1 ; i <= 6 ; i++) {
    var overflowed = cont1.cavaco.AddElement(DrawScoreLinesElement(ScoreElement.TimeSig44));
    if (overflowed && overflowed.length > 0) {
        for (var j = 0 ; j < overflowed.length ; j++) {
            cont2.cavaco.AddElement(overflowed[j]);
        }
    }
}*/


/*var circ = document.createElementNS(xmlns, "circle");
circ.setAttribute("r", 150);

circ.setAttribute("fill", "yellow");

var circ2 = document.createElementNS(xmlns, "circle");
circ2.setAttribute("r", 250);

circ2.setAttribute("fill", "red");*/


//log(cont1.cavaco.AddElement(circ));


/*
log(cont1.cavaco.AddElement(DrawScoreLinesElement(ScoreElement.GClef)));
log(cont1.cavaco.AddElement(DrawScoreLinesElement(ScoreElement.SimpleBar)));
log(cont1.cavaco.AddElement(DrawScoreLinesElement(ScoreElement.TimeSig44)));
log(cont1.cavaco.AddElement(DrawScoreLinesElement(ScoreElement.TimeSig44)));
log(cont1.cavaco.AddElement(DrawScoreLines(20)));
log(cont1.cavaco.AddElement(circ));
log(cont1.cavaco.InsertAt(6, circ2));*/

//log(cont.RemoveAt(2));
//log(cont.RemoveAt(0));
//log(cont.RemoveElement(circ2));




/*    var rect = document.createElementNS(xmlns, "rect");

    rect.setAttribute("x", 50);
    rect.setAttribute("y", 50);
    rect.setAttribute("height", 500);
    rect.setAttribute("width", 500);
    rect.setAttribute("fill", "blue");
    container.appendChild(rect);
    container.appendChild(circ);*/




/*
var root = document.createElementNS(xmlns, "g");
    root.setAttribute("transform","translate(50.5 50.5)");


root.appendChild(DrawScoreLines(890)); 
root.appendChild(DrawScoreLinesElement(ScoreElement.TimeSig44));
root.appendChild(DrawScoreLinesElement(ScoreElement.GClef));
root.appendChild(DrawScoreLinesElement(ScoreElement.SimpleBar));
  

document.documentElement.appendChild(root);*/

function log(msg) { console.log(msg); }