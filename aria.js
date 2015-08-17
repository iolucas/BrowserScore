xmlns = "http://www.w3.org/2000/svg";
xlink = "http://www.w3.org/1999/xlink";


var rect = document.createElementNS(xmlns, "circle");
rect.setAttribute("r", 50);
rect.setAttribute("fill", "yellow");
document.documentElement.appendChild(rect);
var oi = new AriaElement(rect);

//Framework to manipulate svg elements

function AriaElement(svgElement) {

    //Public members
    this.GetX = function () {
        var currTranslateValues = GetTransform(svgElement, "translate");
        if (!currTranslateValues //if no translate has been applied to this objector it is invalid,  
            || (typeof currTranslateValues[0]) != "number")
        return getBoxValues().x;    //return its raw x coord

        return getBoxValues().x + currTranslateValues[0];
    }

    this.GetY = function () {
        var currTranslateValues = GetTransform(svgElement, "translate");
        if (!currTranslateValues //if no translate has been applied to this objector it is invalid,  
            || (typeof currTranslateValues[1]) != "number")
            return getBoxValues().y;    //return its raw y coord

        return getBoxValues().y + currTranslateValues[1];
    }

    this.GetWidth = function () { return getBoxValues().width; }
    this.GetHeight = function () { return getBoxValues().height; }

    //Function to translate the object in referecen to point 0,0
    this.MoveTo = function (x, y) {
        var newX = (typeof x) == "number" ? -getBoxValues().x + x : this.GetX() - getBoxValues().x,
            newY = (typeof y) == "number" ? -getBoxValues().y + y : this.GetY() - getBoxValues().y;

        //Set the translate values for new x and y
        SetTransform(svgElement, { translate: [newX, newY] });
    }

    //Function to return the svg element to be appended
    this.Build = function () {
        return svgElement;
    }

    function getBoxValues() {
        if (svgElement.parentElement)  //if the element is already appended
            return svgElement.getBBox();   //get element bBox
        document.documentElement.appendChild(svgElement);  //append element to be able to get its bbox
        var bBox = svgElement.getBBox();   //get element bBox
        document.documentElement.removeChild(svgElement);  //remove element from its parent
        return bBox;
    }

    //Construction routines
    this.MoveTo(0, 0);  //move the just created object to the origin
}

function AriaHContainer(width, height) {
    //Group to keep the container elements
    var container = document.createElementNS(xmlns, "g");

    //Rectangle to set container size and border
    var contBorder = document.createElementNS(xmlns, "rect");
    contBorder.setAttribute("height", height);
    contBorder.setAttribute("width", width);
    contBorder.setAttribute("fill", "none");
    container.appendChild(contBorder);

    //Append all cavaco.js needed members
    AppendCavacoMembers(container);

    //Function to set the containers border
    this.SetBorder = function (borderWidth, borderColor) {
        if (borderColor) contBorder.setAttribute("stroke", borderColor);
        if (borderWidth) contBorder.setAttribute("stroke-width", borderWidth);
    }

    //Object to hold the elements of the Container
    container.membersList = new List();

    //Function to insert element in the container
    container.cavaco.InsertAt = function (position, element) {
        //if the position is out of the array bounds, return null
        //if the desired to include element already exists, return null
        if (position < 0 || position > container.membersList.Count() || container.membersList.Exists(element))
            return null;

        //Append all cavaco.js needed members
        AppendCavacoMembers(element);

        //if the element height is bigger than the container, return null
        if (element.cavaco.height > container.cavaco.height)
            return null;


        //get the length sum of the elements before the position specified        
        var elementsBeforeSum = 0;
        for (var i = 0 ; i < position ; i++)
            elementsBeforeSum += container.membersList.GetItem(i).cavaco.width;

        //if the container width minus the members width is lesser than the element width, return null
        if (element.cavaco.width > container.cavaco.width - elementsBeforeSum) {
            return [element];
        }

        //if the position is the size of the list
        if (position == container.membersList.Count())
            container.membersList.Add(element);    //insert with add method
        else
            container.membersList.Insert(position, element); //insert element reference at the position to the list

        //Calculate the center position for the given element
        var centerPos = (container.cavaco.height - element.cavaco.height) / 2;

        //translate the element to its position at the container
        element.cavaco.MoveTo(elementsBeforeSum, centerPos);

        var overflowObjects = [],   //array to store elements that overflow the container after insertion of new element
            overflow = false;   //flag to signalize when a overflow occurs

        //iterate thru all the container members since the removed and translate their positions
        for (var j = position + 1 ; j < container.membersList.Count() ; j++) {
            var currElem = container.membersList.GetItem(j); //get the item ref

            //update elem currPos width object
            var newX = currElem.cavaco.x += element.cavaco.width;

            //if a overflow flag or a overflow just occured, 
            //remove next element and put it in the overflow array and move the next iteration
            if (overflow || newX + currElem.cavaco.width > container.cavaco.width) {

                overflow = true;//set the overflow flag
                overflowObjects.push(container.RemoveAt(j));
                j--;    //subtracts one unit from the position var
                continue;   //proceed next iteration
            }

            currElem.cavaco.MoveTo(newX, currElem.cavaco.y);
        }

        container.appendChild(element);  //append the element at the container object
        return overflowObjects; //return the overflowed objects
    }

    //Function to add elements to the container
    container.cavaco.AddElement = function (element) {
        return container.cavaco.InsertAt(container.membersList.Count(), element);
    }

    //Function to Remove element at certain position
    container.cavaco.RemoveAt = function (position) {
        //if the position is out of the array bounds, return false
        if (position < 0 || position >= container.membersList.Count())
            return null;

        //get the elem ref and its width to translate the others
        var elem = container.membersList.GetItem(position);

        //remove the element from the container
        container.removeChild(elem);

        var listSize = container.membersList.Count();   //get list size

        //iterate thru all the container members begging at  the removed element position and translate their positions
        for (var i = position + 1 ; i < listSize ; i++) {
            var currElem = container.membersList.GetItem(i); //get the item ref

            //Move the element to its new position
            currElem.cavaco.MoveTo(currElem.cavaco.x - elem.cavaco.width, currElem.cavaco.y)
        }

        //remove the element from the element list
        container.membersList.RemoveAt(position);

        //return the just removed elem
        return elem;
    }

    //Function to remove some element 
    container.cavaco.RemoveElement = function (element) {
        var index = container.membersList.Find(element);    //find the element in the list
        if (index == -1)     //if not found, return false
            return null;

        return container.cavaco.RemoveAt(index);//otherwise, remove the element        
    }

    return container;




}

function SetTransform(element, values) {
    //get the transform string
    var oldValues = element.getAttribute("transform");
    if (!oldValues) //if the string were not found
        oldValues = "";//clear variable
    else
        oldValues += " ";

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







//Horizontal container
function CreateCavacoContainer(width, height) {
    //Group to keep the container elements
    var container = document.createElementNS(xmlns, "g");

    //Rectangle to set container size and border
    var contBorder = document.createElementNS(xmlns, "rect");
    contBorder.setAttribute("height", height);
    contBorder.setAttribute("width", width);
    contBorder.setAttribute("fill", "none");
    container.appendChild(contBorder);

    //Append all cavaco.js needed members
    AppendCavacoMembers(container);

    //Function to set the containers border
    container.cavaco.SetBorder = function (borderWidth, borderColor) {
        if (borderColor) contBorder.setAttribute("stroke", borderColor);
        if (borderWidth) contBorder.setAttribute("stroke-width", borderWidth);
    }

    //Object to hold the elements of the Container
    container.membersList = new List();

    //Function to insert element in the container
    container.cavaco.InsertAt = function (position, element) {
        //if the position is out of the array bounds, return null
        //if the desired to include element already exists, return null
        if (position < 0 || position > container.membersList.Count() || container.membersList.Exists(element))
            return null;

        //Append all cavaco.js needed members
        AppendCavacoMembers(element);

        //if the element height is bigger than the container, return null
        if (element.cavaco.height > container.cavaco.height)
            return null;


        //get the length sum of the elements before the position specified        
        var elementsBeforeSum = 0;
        for (var i = 0 ; i < position ; i++)
            elementsBeforeSum += container.membersList.GetItem(i).cavaco.width;

        //if the container width minus the members width is lesser than the element width, return null
        if (element.cavaco.width > container.cavaco.width - elementsBeforeSum) {
            return [element];
        }

        //if the position is the size of the list
        if (position == container.membersList.Count())
            container.membersList.Add(element);    //insert with add method
        else
            container.membersList.Insert(position, element); //insert element reference at the position to the list

        //Calculate the center position for the given element
        var centerPos = (container.cavaco.height - element.cavaco.height) / 2;

        //translate the element to its position at the container
        element.cavaco.MoveTo(elementsBeforeSum, centerPos);

        var overflowObjects = [],   //array to store elements that overflow the container after insertion of new element
            overflow = false;   //flag to signalize when a overflow occurs

        //iterate thru all the container members since the removed and translate their positions
        for (var j = position + 1 ; j < container.membersList.Count() ; j++) {
            var currElem = container.membersList.GetItem(j); //get the item ref

            //update elem currPos width object
            var newX = currElem.cavaco.x += element.cavaco.width;

            //if a overflow flag or a overflow just occured, 
            //remove next element and put it in the overflow array and move the next iteration
            if (overflow || newX + currElem.cavaco.width > container.cavaco.width) {

                overflow = true;//set the overflow flag
                overflowObjects.push(container.RemoveAt(j));
                j--;    //subtracts one unit from the position var
                continue;   //proceed next iteration
            }

            currElem.cavaco.MoveTo(newX, currElem.cavaco.y);
        }

        container.appendChild(element);  //append the element at the container object
        return overflowObjects; //return the overflowed objects
    }

    //Function to add elements to the container
    container.cavaco.AddElement = function (element) {
        return container.cavaco.InsertAt(container.membersList.Count(), element);
    }

    //Function to Remove element at certain position
    container.cavaco.RemoveAt = function (position) {
        //if the position is out of the array bounds, return false
        if (position < 0 || position >= container.membersList.Count())
            return null;

        //get the elem ref and its width to translate the others
        var elem = container.membersList.GetItem(position);

        //remove the element from the container
        container.removeChild(elem);

        var listSize = container.membersList.Count();   //get list size

        //iterate thru all the container members begging at  the removed element position and translate their positions
        for (var i = position + 1 ; i < listSize ; i++) {
            var currElem = container.membersList.GetItem(i); //get the item ref

            //Move the element to its new position
            currElem.cavaco.MoveTo(currElem.cavaco.x - elem.cavaco.width, currElem.cavaco.y)
        }

        //remove the element from the element list
        container.membersList.RemoveAt(position);

        //return the just removed elem
        return elem;
    }

    //Function to remove some element 
    container.cavaco.RemoveElement = function (element) {
        var index = container.membersList.Find(element);    //find the element in the list
        if (index == -1)     //if not found, return false
            return null;

        return container.cavaco.RemoveAt(index);//otherwise, remove the element        
    }

    return container;
}