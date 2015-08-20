var scoreLine = $Aria.CreateContainer({
	width: 1200,
	height: 120
});
scoreLine.MoveTo(10.5, 10.5);
document.documentElement.appendChild(scoreLine.Build());

scoreLine.SetBorder(1, "#000");

scoreLine.AddElement(createScoreMeasure("blue"));

var lucas = createScoreMeasure("red");

scoreLine.AddElement(lucas);
scoreLine.AddElement(createScoreMeasure("yellow"));
scoreLine.AddElement(createScoreMeasure("green"));

/*var obj = createScoreMeasure("yellow");
obj.MoveTo(50.5, 50.5);*/

//document.documentElement.appendChild(obj.Build());

function createScoreMeasure(color) {
	var scoreMeasure = $Aria.CreateContainer({
		minWidth: 300,
		maxWidth: 1200,
		height: 120
	});
	scoreMeasure.SetBackgroundColor(color);
	//scoreMeasure.SetBorder(1, "#222");
	var rect = $Aria.CreateRectangle(50, 100, "#333");

	rect.Build().addEventListener("click", function(e){

		//scoreMeasure.RemoveElement(rect);


		var width = parseInt(e.target.getAttribute("width"));
		width += 50;
		e.target.setAttribute("width", width);
		log(rect.CheckResize());

		//log(scoreMeasure.UpdateElementDimension(rect));
		//log(scoreLine.UpdateElementDimension(scoreMeasure));
	});

	log(scoreMeasure.AddElement(rect));



	return scoreMeasure;
}





/*
container.SetBackgroundColor("#333");
document.documentElement.appendChild(container.Build());
container.MoveTo(110.5,110.5);

var circle = $Aria.CreateCircle(50, "red");
circle.Build().addEventListener("click", function(e){
	var radius = parseInt(e.target.getAttribute("r"));
	radius += 10;
	e.target.setAttribute("r", radius);
	log(container.UpdateElementDimension(circle));
});

var rect = $Aria.CreateRectangle(20, 100, "orange");

rect.Build().addEventListener("click", function(e){
	var width = parseInt(e.target.getAttribute("width"));
	width += 40;
	e.target.setAttribute("width", width);
	log(container.UpdateElementDimension(rect));
});*/


//log(container.AddElement($Aria.CreateCircle(100, "blue")));
//log(container.AddElement(circle));
//log(container.AddElement($Aria.CreateCircle(70, "yellow")));
//log(container.AddElement(rect));




function log(msg) { console.log(msg); }