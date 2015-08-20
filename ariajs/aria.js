xmlns = "http://www.w3.org/2000/svg";
xlink = "http://www.w3.org/1999/xlink";

//Framework to manipulate svg elements

var $Aria = new function() {

    this.Parse = function(svgElement) { return new AriaElement(svgElement); }
    this.CreateContainer = function(properties) { return new AriaContainer(properties); }
    this.CreateCircle = function(radius, color) {
        var circle = document.createElementNS(xmlns, "circle");
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", color);
        return this.Parse(circle);
    }
    this.CreateRectangle = function(width, height, color) {
        var rect = document.createElementNS(xmlns, "rect");
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("fill", color);
        return this.Parse(rect);
    }
};

//Horizontal container
function AriaContainer(properties) {  

    var selfRef = this;

    //Register the container dimensions
    var width = properties.width,
        minWidth = properties.minWidth || 0,    //if the minWidth is not valid, set it value as 0
        maxWidth = properties.maxWidth,
        height = properties.height;
    
    var containerGroup = document.createElementNS(xmlns, "g"),  //Group to keep the container elements
        ariaContainer = $Aria.Parse(containerGroup);   //parse the group to a ariaElement    

    //Inherit aria element members
    this.GetX = function() { return ariaContainer.GetX(); }
    this.GetY = function() { return ariaContainer.GetY(); }   
    this.GetHeight = function() { return ariaContainer.GetHeight(); }   
    this.GetWidth = function() { return ariaContainer.GetWidth(); }
    this.MoveTo = function(x, y) { return ariaContainer.MoveTo(x, y); } 
    this.Build = function() { return ariaContainer.Build(); }
    //Wrapper for fire events but with modified args
    this.addEventListener = function(event, callback) {
        return ariaContainer.addEventListener(event, function(e) {
            e.target = selfRef;    //modify the target value
            callback.call(selfRef, e); //fire the callback function
        });
    }
    this.removeEventListener = function(eventHandler) { return ariaContainer.removeEventListener(eventHandler); }
    //Function to verify if some resized occurred, private due to for containers it are called automatically
    function CheckResize() { return ariaContainer.CheckResize(); }  

    //Rectangle to set container size and border
    var areaRect = document.createElementNS(xmlns, "rect");
    areaRect.setAttribute("height", height);    //set rectangle fixed height
    if(width)//if the width dimension has been passed, means container has a fixed width
        areaRect.setAttribute("width", width);    //set rectangle fixed width
    else  //if not, it has a variable width
        areaRect.setAttribute("width", minWidth);    //set rectangle min width

    areaRect.setAttribute("fill", "none");  //fill the area rectangle with opacity 0
    containerGroup.appendChild(areaRect);   //append it to the containers group

    //Function to set the containers border
    this.SetBorder = function (borderWidth, borderColor) {
        if (borderColor) areaRect.setAttribute("stroke", borderColor);
        if (borderWidth) areaRect.setAttribute("stroke-width", borderWidth);
    }
    //Function to set the containers background color
    this.SetBackgroundColor = function(color) { areaRect.setAttribute("fill", color); }

    //Object to hold the elements of the Container
    var childs = new List();

    //Function to insert element in the container
    this.InsertAt = function (position, ariaElement) {
        //if the position is out of the array bounds, return null
        //if the desired to include element already exists, return null
        if (position < 0 || position > childs.Count() || childs.Exists(ariaElement))
            return null;

        //if the element height is greater than the container's, return null
        if (ariaElement.GetHeight() > height)
            return null;

        //get the length sum of the elements before the position specified        
        var elementsBeforeSum = 0;
        for (var i = 0 ; i < position ; i++)
            elementsBeforeSum += childs.GetItem(i).GetWidth();

        //If a fixed width or a max width has been specified and
        //the container width or max width minus the members width is lesser than the element width, return the element as an overflow
        if ((width || maxWidth) && (ariaElement.GetWidth() > ((width || maxWidth) - elementsBeforeSum)))
            return [ariaElement];    

        //if the position is the size of the list
        if (position == childs.Count())
            childs.Add(ariaElement);    //insert with add method
        else
            childs.Insert(position, ariaElement); //insert element reference at the position to the list

        //Variable to store element's original width to be used when it is removed
        ariaElement.originalWidth = ariaElement.GetWidth();

        //Calculate the center position for the given element
        var centerPos = (height - ariaElement.GetHeight()) / 2;

        //translate the element to its position at the container
        ariaElement.MoveTo(elementsBeforeSum, centerPos);

        //Add a resize listener to the appended element to update its dimension at the container whenever is needed
        //record the resize event handler to be used for remove this event when this element is removed
        ariaElement.resizeEventHandler = ariaElement.addEventListener("resize", function(e) {
            UpdateElementDimension.call(selfRef, ariaElement);
        });

        var overflowObjects = [],   //array to store elements that overflow the container after insertion of new element
            overflow = false;   //flag to signalize when a overflow occurs

        //iterate thru all the container members since the removed and translate their positions
        for (var j = position + 1 ; j < childs.Count() ; j++) {
            var currElem = childs.GetItem(j); //get the item ref

            //update elem currPos width object
            var newX = currElem.GetX() + ariaElement.GetWidth();

            //if a overflow flag or a width or maxWidth has been defined and overflow just occured,  
            //remove next element and put it in the overflow array and move the next iteration
            if (overflow || ((width || maxWidth) && newX + currElem.GetWidth() > (width || maxWidth))) {

                overflow = true;//set the overflow flag
                overflowObjects.push(selfRef.RemoveAt(j));
                j--;    //subtracts one unit from the position var
                continue;   //proceed next iteration
            }

            currElem.MoveTo(newX);
        }

        containerGroup.appendChild(ariaElement.Build());  //append the element at the container object

        if(!width) {  //if no width has been informed,
            //if the min width has been informed and the current length is less than this min width
            if(minWidth && this.GetWidth() < minWidth) 
                areaRect.setAttribute("width", minWidth);    //set rectangle min width
            else //if not, 
                areaRect.setAttribute("width", this.GetWidth());    //set rectangle width as the group width
        }

        CheckResize(); 

        return overflowObjects; //return the overflowed objects
    }

    //Function to add elements to the container
    this.AddElement = function (ariaElement) {
        return selfRef.InsertAt(childs.Count(), ariaElement);
    }

    //function to update the area rectangle
    //TO BE FIXED AND IMPLEMENTED
    /*function updateRectWidth(newOffset) {
        if(width)   //if any width has been specified
            return; //return

    //if the min width has been informed and the current length is less than this min widt
        if(minWidth && this.GetWidth() - elem.originalWidth < minWidth)
            areaRect.setAttribute("width", minWidth);    //set rectangle min width
        else //if not, 
            areaRect.setAttribute("width", this.GetWidth() - elem.originalWidth);    //set rectangle width as the group width




        log(selfRef.GetWidth());
        //get the rectangle current width
        var currRectWidth = parseInt(areaRect.getAttribute("width"));
        if(currRectWidth == selfRef.GetWidth()) //if the area rectangle is already the size of the rectangle
            return;

        //if the min width has been informed and the current length is less than this min width
        if(minWidth && selfRef.GetWidth() < minWidth) 
            areaRect.setAttribute("width", minWidth);    //set rectangle min width
        else //if not, 
            areaRect.setAttribute("width", selfRef.GetWidth());    //set rectangle width as the group width

        //execute the function to check a resize on this element to update whowever subscribed to its resize event
        CheckResize();  
    }*/

    //Function to Remove element at certain position
    this.RemoveAt = function (position) {
        //if the position is out of the array bounds, return false
        if (position < 0 || position >= childs.Count())
            return null;

        //get the elem ref and its width to translate the others
        var elem = childs.GetItem(position);

        //remove the resize event listener 
        log(elem.removeEventListener(elem.resizeEventHandler));

        //remove the element from the container
        containerGroup.removeChild(elem.Build());

        var listSize = childs.Count();   //get list size

        //iterate thru all the container members begging at  the removed element position and translate their positions
        for (var i = position + 1 ; i < listSize ; i++) {
            var currElem = childs.GetItem(i); //get the item ref

            //Move the element to its new position
            //Use original width in case the element has been resized from an outer method
            currElem.MoveTo(currElem.GetX() - elem.originalWidth);
        }

        if(!width) {  //if no width has been informed,
            //if the min width has been informed and the current length is less than this min widt
            if(minWidth && this.GetWidth() - elem.originalWidth < minWidth)
                areaRect.setAttribute("width", minWidth);    //set rectangle min width
            else //if not, 
                areaRect.setAttribute("width", this.GetWidth() - elem.originalWidth);    //set rectangle width as the group width
        }

        CheckResize(); 

        //remove the element from the element list
        childs.RemoveAt(position);

        //return the just removed elem
        return elem;
    }

    //Function to remove some element 
    this.RemoveElement = function (ariaElement) {
        var index = childs.Find(ariaElement);    //find the element in the list
        if (index == -1)     //if not found, return false
            return null;

        return selfRef.RemoveAt(index);//otherwise, remove the element        
    }

    //Function to get the element current position at the container
    this.GetElementPosition = function(ariaElement) {
        return childs.Find(ariaElement);    //find the element in the list
    }

    //Function to get the number of childs at this container
    this.Count = function() { return childs.Count(); }

    //Private function to update target element dimensions at the container
    function UpdateElementDimension (ariaElement) {
        //If the width hasn't changed, returt null
        //if(ariaElement.originalWidth == ariaElement.GetWidth())
          //  return null;

        var position = selfRef.GetElementPosition(ariaElement);
        if(position == -1) return null;    //if the element is not found, return null

        selfRef.RemoveAt(position);   //Remove the element from the container
        return selfRef.InsertAt(position, ariaElement);    //put it back and return overflow elements
/*
        //Get the distance to be offset
        var newOffset = ariaElement.GetWidth() - ariaElement.originalWidth;

        var overflowObjects = [],   //array to store elements that overflow the container after element translation
        overflow = false;   //flag to signalize when a overflow occurs

        //iterate thru all the container members since the removed and translate their positions
        for (var j = position + 1 ; j < childs.Count() ; j++) {
            var currElem = childs.GetItem(j); //get the item ref

            //update elem currPos width object
            var newX = currElem.GetX() + newOffset;

            //if a overflow flag or a width or maxWidth has been defined and overflow just occured,  
            //remove next element and put it in the overflow array and move the next iteration
            if (overflow || ((width || maxWidth) && newX + currElem.GetWidth() > (width || maxWidth))) {

                overflow = true;//set the overflow flag
                overflowObjects.push(selfRef.RemoveAt(j));
                j--;    //subtracts one unit from the position var
                continue;   //proceed next iteration
            }

            currElem.MoveTo(newX);
        }

        updateRectWidth();  //update area rectangle width

        return overflowObjects; //return the overflowed objects*/
    }

    //var occupedSpace = 0;   //variable to store the occuped space at this container (TO BE IMPLEMENTED)

    //Function to get the free space available at the container
    this.GetFreeSpace = function() {
        if(!width)  //if no width for the container has been specified
            return -1;  //return -1

        var childsCount = childs.Count();   //get the number of elements at the container
        var occupedLength = 0; //variable to accumulate the members width
        for(var i = 0; i < childsCount; i++)    //iterate thru all the container members 
            occupedLength += childs.GetItem(i).GetWidth(); //get their length

        return width - occupedLength; //return the free length
    }
}


function AriaElement(svgElement) {

    var selfRef = this;

    //Public members
    this.GetX = function () {
        var currTranslateValues = GetTransform(svgElement, "translate");
        //if no translate has been applied to this object or it is invalid,  
        if (!currTranslateValues || (typeof currTranslateValues[0]) != "number")
            return getBoxValues().x;    //return its raw x coord

        return getBoxValues().x + currTranslateValues[0];
    }

    this.GetY = function () {
        var currTranslateValues = GetTransform(svgElement, "translate");
        //if no translate has been applied to this objector it is invalid,
        if (!currTranslateValues || (typeof currTranslateValues[1]) != "number")
            return getBoxValues().y;    //return its raw y coord

        return getBoxValues().y + currTranslateValues[1];
    }

    this.GetWidth = function () { return getBoxValues().width; }
    this.GetHeight = function () { return getBoxValues().height; }

    //Function to translate the object in referece to point 0,0
    this.MoveTo = function (x, y) {
        var newX = (typeof x) == "number" ? x - getBoxValues().x : selfRef.GetX() - getBoxValues().x,
            newY = (typeof y) == "number" ? y - getBoxValues().y : selfRef.GetY() - getBoxValues().y;

        //Set the translate values for new x and y
        SetTransform(svgElement, { translate: [newX, newY] });
    }

    //Function to return the svg element to be appended
    this.Build = function () {
        return svgElement;
    }

    //Wrapper to get a element valid bbox
    function getBoxValues() {
        var bBox = svgElement.getBBox();   //get element bBox
        if(bBox.x || bBox.y || bBox.width || bBox.height) { //if any of the members are valid, 
            return bBox;    //return the gotten bbox cause it is valid
        }
        
        //if it is not valid,
        var elementParent = svgElement.parentElement;   //got the element parent if any
        document.documentElement.appendChild(svgElement);  //append element to a valid aux parent to be able to get its bbox
        bBox = svgElement.getBBox();   //get element bBox
        if(elementParent) //if the element had a parent
            elementParent.appendChild(svgElement);    //put the element back to its parent
        else //if not, 
            document.documentElement.removeChild(svgElement);  //remove element from its aux parent          
        
        return bBox;
    }

    //Private variables to check whether a object resize has occurred
    var currHeight = selfRef.GetHeight();
    var currWidth = selfRef.GetWidth();

    //Function to check if a resize has occured, if so, fire the resize event
    this.CheckResize = function() {
        //If any change has occurred
        if(currHeight != selfRef.GetHeight() || currWidth != selfRef.GetWidth()) {
            //Update current height and width variables
            currHeight = selfRef.GetHeight();
            currWidth = selfRef.GetWidth();

            dispatchEvent("resize");    //fire the resize event
            return true;    //return true to simbolize a resize
        }
        return false;   //return false to simblize not resize
    }

    //Events
    var events = new Object();    //Object to store the subscribed the events subscribed
    this.addEventListener = function(event, callback) {
        if(!events[event])  //if the specified event collection has not been created, 
            events[event] = []; //create it
        //register the callback for the event
        events[event][events[event].length] = callback;
        //return a event handler to be used for remove the event listener
        return { event: event, position: events[event].length - 1}
    }

    this.removeEventListener = function(eventHandler) {
        //if the specified event handler exists
        if(events[eventHandler.event] && events[eventHandler.event][eventHandler.position]) {
            events[eventHandler.event][eventHandler.position] = null;   //clear the event handler
            return true;    //return true if remove is sucessfull
        }
        return false;   //return false if the event were not found
    }

    //Function to fire the specified event
    function dispatchEvent(event) {
        if(events[event]) { //if the event exists
            var subsCount = events[event].length;
            for(var i = 0; i < subsCount; i++)   //iterate thru 
                if(events[event][i])    //if the callback is valid, 
                    events[event][i].call(selfRef, {target: selfRef});    //fire it
        }
    }
}

//Function to set the transform attributes of a given element
function SetTransform(element, values) {
    //get the transform string
    var oldValues = element.getAttribute("transform");
    if (!oldValues) //if the string were not found
        oldValues = "";//clear variable

    for (member in values) {
        //generate transform string
        var tString = member + "(";

        //if the member is not a valid array, proceed next iteration
        if (!values[member].length)
            continue;

        for (var i = 0; i < values[member].length; i++) {
            tString += values[member][i];
            tString += (i + 1) == values[member].length ? ")" : " ";
        }

        //get the start index of the current transform prop
        var sIndex = oldValues.indexOf(member);

        if (sIndex > -1) {
            var eIndex = oldValues.indexOf(")", sIndex);  //get the end index
            //Clear the old value for the given transform
            oldValues = oldValues.replace(oldValues.substring(sIndex, eIndex + 1), "");
        }

        oldValues += tString + " ";
    }
    //console.log(oldValues);
    element.setAttribute("transform", oldValues.substr(0, oldValues.length - 1));
}

//Function to get the transform attribute for a given element
function GetTransform(element, property) {
    var tString = element.getAttribute("transform");
    if (!tString) return null;  //if no transform has been applied

    var pIndex = tString.indexOf(property);
    if (pIndex == -1) return null;  //if the prop is not found, return null
        
    var sIndex = tString.indexOf("(", pIndex),
        eIndex = tString.indexOf(")", pIndex);

    vArray = tString.substring(sIndex + 1, eIndex).split(" ");
    for (var i = 0; i < vArray.length; i++)
        vArray[i] = parseInt(vArray[i], 10);

    return vArray;
}







