var container = $Aria.CreateContainer({
	//width: 1000,
	height: 400,
	minWidth: 10,
	maxWidth: 700
});

//container.SetBorder(1, "#000");
container.SetBackgroundColor("#333");
document.documentElement.appendChild(container.Build());
container.MoveTo(10.5,10.5);

var circle = $Aria.CreateCircle(50, "red");
circle.Build().addEventListener("click", function(e){
	var radius = parseInt(e.target.getAttribute("r"));
	radius += 10;
	e.target.setAttribute("r", radius);
	log(container.UpdateElementDimension(circle));
});


log(container.AddElement($Aria.CreateCircle(100, "blue")));
log(container.AddElement(circle));
log(container.AddElement($Aria.CreateCircle(70, "yellow")));




function log(msg) { console.log(msg); }