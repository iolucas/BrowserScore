

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
        
        var elementParent = this.parentElement, //got the element parent if any
            auxParent;  //aux parent to append the element for get its bbBox

        //check if we are in a svg doc or html doc
        if(document.documentElement.tagName == "svg") {
            auxParent = document.documentElement; //set the svg doc parent element    

        } else if(document.documentElement.tagName == "HTML") {
            //inits the svg aux doc
            auxParent = $G.create("svg");
            document.body.appendChild(auxParent);
        } else
            throw "G-QUERY_ERROR__UNKNOWN_DOC_TYPE";

        auxParent.appendChild(this);  //append element to the auxiliar parent to be able to get its bbox
        bBox = this.__oldGetBBox();   //get this element bBox

        if(elementParent) //if the element had a parent
            elementParent.appendChild(this);    //put the element back to its parent
        else //if not,
            auxParent.removeChild(this);  //just remove element from its aux parent

        //if the aux parent has a parent element, dettach it and delete it
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

    //if the angle hasn't been informed, return
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