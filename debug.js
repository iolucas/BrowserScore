function log(msg) { console.log(msg); }

var score = ScoreBuilder.CreateLine(1200);   //create a scoreline with 890 length
document.documentElement.appendChild(score.Build());

score.MoveTo(300.5, 20.5);
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

