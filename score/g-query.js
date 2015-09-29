

//------------------------------------------------------------------
//--------------------- G-QUERY LIBRARY-----------------------------
//------------------------------------------------------------------

//-------------------- G-QUERY METHODS -----------------------------

var $G = new function() {
	//set namespaces
	var gquery_xmlns = "http://www.w3.org/2000/svg",
		gquery_xlink = "http://www.w3.org/1999/xlink";  

	//function to create any graphic stuff
	this.create = function(elemName) {
		return document.createElementNS(gquery_xmlns, elemName);
	}
}

//-------------------- G-QUERY PROTOTYPES --------------------------

//Set an enhanced "getBBox()" method to ensure bboxes even with the element not appended to the final document
SVGGraphicsElement.prototype.__oldGetBBox = SVGGraphicsElement.prototype.getBBox;	//store the old getbbox
SVGGraphicsElement.prototype.getBBox = function () {	//set the new one
    var bBox;
    try {
        bBox = this.__oldGetBBox();   //try to get element bBox
        if(bBox.x || bBox.y || bBox.width || bBox.height) //if any of the members are valid,
            return bBox;    //return the gotten bbox cause it is valid
        else //if not suceed
            throw "BBOX_NOT_VALID";	//crash the try block (firefox crashes automatically, chrome doesn't)
    } catch(e) { //if it is not valid,

        //recursively checks the parent element of the current element to find the highest not null
        var higherNotNullElement = this;
        for(;;) {
            if(higherNotNullElement.parentElement)
                higherNotNullElement = higherNotNullElement.parentElement;
            else
                break;               
        }

        //if the last element is one of the root tags, means the element is completely appended and the bbox cleared is the right one
        if(higherNotNullElement.tagName == "HTML" || higherNotNullElement.tagName == "svg")
            return bBox;    //return the bBox before the catch (cleared)

        var auxParent;  //aux parent to append the element for get its bbBox

        //if the root document is already a svg, 
        if(document.documentElement.tagName == "svg")
            auxParent = document.documentElement; //set the svg doc parent element as the auxParent
        else if(document.documentElement.tagName == "HTML") { //if is a HTML
            auxParent = $G.create("svg");   //creates a svg doc for it
            document.body.appendChild(auxParent);   //append the svg doc to the html doc body
        }
        else //if neither one of them, throw error
            throw "G-QUERY_ERROR__UNKNOWN_DOC_TYPE";

        //append the higher element to the auxiliar parent to be able to get this element bbox
        auxParent.appendChild(higherNotNullElement);  
        bBox = this.__oldGetBBox();   //get this element bBox
        //remove higher element from its aux parent
        auxParent.removeChild(higherNotNullElement); 

        if(auxParent.parentElement)
            auxParent.parentElement.removeChild(auxParent);

        delete auxParent;
        return bBox;
    }
}

//Set a translate function for easily set the transform attribute to the element
SVGGraphicsElement.prototype.translate = function(x, y) {
	//get the transform string
    var oldValues = this.getAttribute("transform");
    if (!oldValues) //if the string were not found
        oldValues = "";//clear variable

    //Clear the current transform value word
    //get the start index of the current transform prop
    var startIndex = oldValues.indexOf("translate");
    if (startIndex > -1) {
        var endIndex = oldValues.indexOf(")", startIndex);  //get the end index
        //Clear the old value for the given transform
        oldValues = oldValues.replace(oldValues.substring(startIndex, endIndex + 1), "");
    }

    //if the angle hasn't been informed, return
	if(x == undefined) {
		this.setAttribute("transform", oldValues);	
		return;		
	}	

    var transStr = "translate(" + x;
    
    if(y)	
    	transStr += " " + y;

	transStr += ")";

    oldValues += transStr;

    this.setAttribute("transform", oldValues);
}

//Set a rotate function for easily set the transform attribute to the element
SVGGraphicsElement.prototype.rotate = function(angle, x, y) {
	//get the transform string
    var oldValues = this.getAttribute("transform");
    if (!oldValues) //if the string were not found
        oldValues = "";//clear variable

	//Clear the current rotate transform string
    //get the start index of the current transform prop
    var startIndex = oldValues.indexOf("rotate");
    if (startIndex > -1) {
        var endIndex = oldValues.indexOf(")", startIndex);  //get the end index
        //Clear the old value for the given transform
        oldValues = oldValues.replace(oldValues.substring(startIndex, endIndex + 1), "");
    }

    //if the angle hasn't been informed, return
	if(angle == undefined) {
		this.setAttribute("transform", oldValues);	
		return;		
	}		

    var transStr = "rotate(" + angle;
    
    if(typeof x == "number" && typeof y == "number")	
    	transStr += " " + x + " " + y;

	transStr += ")";

    oldValues += transStr;	//append the transform string to the old values

    this.setAttribute("transform", oldValues);
}

//Set a translate function for easily set the transform attribute to the element
SVGGraphicsElement.prototype.scale = function(x, y) {
	//get the transform string
    var oldValues = this.getAttribute("transform");
    if (!oldValues) //if the string were not found
        oldValues = "";//clear variable

    //Clear the current transform value word
    //get the start index of the current transform prop
    var startIndex = oldValues.indexOf("scale");
    if (startIndex > -1) {
        var endIndex = oldValues.indexOf(")", startIndex);  //get the end index
        //Clear the old value for the given transform
        oldValues = oldValues.replace(oldValues.substring(startIndex, endIndex + 1), "");
    }

    //if the x value hasn't been informed, return
	if(x == undefined) {
		this.setAttribute("transform", oldValues);	
		return;		
	}	

    var transStr = "scale(" + x;
    
    if(y)	
    	transStr += " " + y;

	transStr += ")";

    oldValues += transStr;

    this.setAttribute("transform", oldValues);
}

//Function to get the transform attribute for a given element
SVGGraphicsElement.prototype.getTransform = function (property) {
    var tString = this.getAttribute("transform");
    if (!tString) return null;  //if no transform has been applied

    var pIndex = tString.indexOf(property);
    if (pIndex == -1) return null;  //if the prop is not found, return null

    var sIndex = tString.indexOf("(", pIndex),
        eIndex = tString.indexOf(")", pIndex);

    vArray = tString.substring(sIndex + 1, eIndex).split(" ");
    for (var i = 0; i < vArray.length; i++)
        vArray[i] = parseFloat(vArray[i], 10);

    return vArray;
}



//MAYBE THESE ARRAY FUNCTIONS SHOULDN'T BE HERE SINCE THIS IS ONLY FOR GRAPHICS

//Set method to an array get its true valid length
Array.prototype.getValidLength = function() {
	var length = 0;
    for(var i = 0; i < this.length; i++)
        if(this[i] != undefined)
            length++;
    return length;
}





//--------------- DEBUG AREA --------------------------------

//console.log(document.documentElement.tagName);

/*
var test = $G.create("rect");

//var svgDoc123 = $G.create("svg");
//svgDoc123.appendChild(test);
//document.body.appendChild(svgDoc123);


test.setAttribute("width", 100);
test.setAttribute("height", 100);
test.setAttribute("fill", "#000");

console.log(test.getBBox());*/

/*
var oi = $G.create("g");
oi.appendChild(test);




oi.translate(300, 300);
oi.scale(2, 1);
console.log(oi);
//console.log([test]);

var circ = $G.create("circle");
circ.setAttribute("r", 100);
circ.setAttribute("fill","yellow");
circ.translate(300,300);
document.documentElement.appendChild(circ);
document.documentElement.appendChild(oi);*/