//Main header for all svg js files
xmlns = "http://www.w3.org/2000/svg";
xlink = "http://www.w3.org/1999/xlink";








function createFixedGroup () {
	var group = $Aria.Parse(document.createElementNS(xmlns, "g"));

		var circle = document.createElementNS(xmlns, "circle");
	circle.setAttribute("r", 100);
	circle.setAttribute("fill", "black");

	group.Build().appendChild(circle);

	group.Build().addEventListener("click", function() {
		//alert("oi");
		console.log(group.GetX() + ", " + group.GetY());
		group.Build().appendChild($Aria.CreateCircle(30, "yellow").Build());
		console.log(group.GetX() + ", " + group.GetY());
	});

	group.MoveTo(0, 0);


	return group;
}	

document.documentElement.appendChild(createFixedGroup().Build());