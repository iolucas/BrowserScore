
var cont1 = CreateCavacoContainer(200, 120);
cont1.cavaco.SetBorder(1, "#000");
cont1.cavaco.MoveTo(10.5, 10.5);
document.documentElement.appendChild(cont1);

var cont2 = CreateCavacoContainer(1000, 120);
cont2.cavaco.SetBorder(1, "#000");
cont2.cavaco.MoveTo(10.5, 140.5);
document.documentElement.appendChild(cont2);


for (var i = 1 ; i <= 6 ; i++) {
    var overflowed = cont1.cavaco.AddElement(DrawScoreLinesElement(ScoreElement.SimpleBar));
    if (overflowed && overflowed.length > 0) {
        for (var j = 0 ; j < overflowed.length ; j++) {
            cont2.cavaco.AddElement(overflowed[j]);
        }
    }
}


/*var circ = document.createElementNS(xmlns, "circle");
circ.setAttribute("r", 150);

circ.setAttribute("fill", "yellow");

var circ2 = document.createElementNS(xmlns, "circle");
circ2.setAttribute("r", 250);

circ2.setAttribute("fill", "red");*/


/*
log(cont.AddElement(circ));



log(cont.AddElement(DrawScoreLinesElement(ScoreElement.GClef)));
log(cont.AddElement(DrawScoreLinesElement(ScoreElement.SimpleBar)));
log(cont.AddElement(DrawScoreLinesElement(ScoreElement.TimeSig44)));
log(cont.AddElement(DrawScoreLinesElement(ScoreElement.TimeSig44)));
log(cont.AddElement(DrawScoreLines(20)));
log(cont.AddElement(circ));
log(cont.InsertAt(6, circ2));*/

//log(cont.RemoveAt(2));
//log(cont.RemoveAt(0));
//log(cont.RemoveElement(circ2));


function log(msg) { console.log(msg); }

/*    var rect = document.createElementNS(xmlns, "rect");

    rect.setAttribute("x", 50);
    rect.setAttribute("y", 50);
    rect.setAttribute("height", 500);
    rect.setAttribute("width", 500);
    rect.setAttribute("fill", "blue");
    container.appendChild(rect);
    container.appendChild(circ);*/