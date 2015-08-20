/*var cont = $Aria.CreateContainer({
	width: 500,
	maxWidth: 400,
	minWidth: 200,
	height: 120
});

cont.OnOverflow = function(overflowObjects) {
	log(overflowObjects);
	cont.AddElement(getRect("green"));
};

cont.addEventListener("resize", function() {
	log("container resized!");

});

cont.MoveTo(10.5, 10.5);
cont.SetBorder(1, "#000");
document.documentElement.appendChild(cont.Build());

//log(cont.GetFreeLength());

cont.AddElement(getRect("blue"));
//log(cont.GetFreeLength());
cont.AddElement(getRect("yellow"));
//log(cont.GetFreeLength());
var r = getRect("red")
cont.InsertAt(0, r);
//log(cont.GetFreeLength());

r.Build().addEventListener("click", function() {
	r.SetSize(r.GetWidth() + 2000);

});





function getRect(color) {
	var rect = $Aria.CreateRectangle(100, 100, color);

	/*rect.Build().addEventListener("click", function(){
		if(rect.SetSize)
			rect.SetSize(rect.GetWidth() + 20);		
	});*/

//	return rect;
//}



var scoreLine = $Aria.CreateContainer({
	width: 1200,
	height: 120
});
scoreLine.MoveTo(10.5, 10.5);
document.documentElement.appendChild(scoreLine.Build());

scoreLine.OnOverflow = function(overflowObjects) {
	//log(overflowObjects);
	scoreLine2.InsertAt(0, overflowObjects[0]);
}

scoreLine.SetBorder(1, "#000");

var scoreLine2 = $Aria.CreateContainer({
	width: 1500,
	height: 120
});
scoreLine2.MoveTo(10.5, 200.5);
document.documentElement.appendChild(scoreLine2.Build());
scoreLine2.SetBorder(1, "#000");
scoreLine2.OnOverflow = function(overflowObjects) {
	log(overflowObjects);
	//scoreLine2.InsertAt(0, overflowObjects[0]);
}


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
		maxWidth: 1251,
		height: 120
	});
	scoreMeasure.SetBackgroundColor(color);
	//scoreMeasure.SetBorder(1, "#222");
	var rect = $Aria.CreateRectangle(50, 100, "#333");

	rect.Build().addEventListener("click", function(e){

		//scoreMeasure.RemoveElement(rect);


		var width = parseInt(e.target.getAttribute("width"));
		width += 50;
		rect.SetSize(width);
		//e.target.setAttribute("width", width);
		//log(rect.CheckResize());

		//log(scoreMeasure.UpdateElementDimension(rect));
		//log(scoreLine.UpdateElementDimension(scoreMeasure));
	});

	scoreMeasure.AddElement(rect);



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