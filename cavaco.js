xmlns = "http://www.w3.org/2000/svg";
xlink = "http://www.w3.org/1999/xlink";

//Function to append to elements all cavaco needed methods and properties
function AppendCavacoMembers(element) {

    var cavaco = new Object();  //Create new object to hold stuff
    //cavaco.parentRef = element; //Set the object parent as reference to be used
    element.cavaco = cavaco;    //Create new member to store cavaco ref @ the target element

    document.documentElement.appendChild(element);  //append element to be able to get its bbox
    var bBox = element.getBBox();   //get element bBox
    document.documentElement.removeChild(element);  //remove element from its parent

    //Add bBox properties to the items
    //cavaco.originX = bBox.x;
    //cavaco.originY = bBox.y;
    cavaco.x;   //current x value in relation to 0,0
    cavaco.y;   //current y value in relation to 0,0
    cavaco.height = bBox.height;
    cavaco.width = bBox.width;

    //Function to translate the object in referecen to point 0,0
    cavaco.MoveTo = function (x, y) {
        SetTransform(element, {translate:[bBox.x * (-1) + x, bBox.y * (-1) + y]});
        /*element.setAttribute("transform", "translate(" +
                (bBox.x * (-1) + x) + " " +
                (bBox.y * (-1) + y) + ")");*/
        cavaco.x = x;
        cavaco.y = y;
    }
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
    container.cavaco.AddElement = function(element) {
        return container.cavaco.InsertAt(container.membersList.Count(), element);
    }
    
    //Function to Remove element at certain position
    container.cavaco.RemoveAt = function(position) {
        //if the position is out of the array bounds, return false
        if (position < 0 || position >= container.membersList.Count())
            return null;
        
        //get the elem ref and its width to translate the others
        var elem = container.membersList.GetItem(position);
        
        //remove the element from the container
        container.removeChild(elem);
        
        var listSize = container.membersList.Count();   //get list size
        
        //iterate thru all the container members begging at  the removed element position and translate their positions
        for(var i = position + 1 ; i < listSize ; i++) {
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
    container.cavaco.RemoveElement = function(element) {
        var index = container.membersList.Find(element);    //find the element in the list
        if(index == -1)     //if not found, return false
            return null;
        
        return container.cavaco.RemoveAt(index);//otherwise, remove the element        
    }
    
    return container;
}

//SVG transform option parser
function SetTransform(element, values) {
    //get the transform string
    var oldValues = element.getAttribute("transform");
    if (!oldValues) //if the string were not found
        oldValues = "";//clear variable
    else
        oldValues += " ";
    
    for(member in values) {
        //generate transform string
        var tString = member + "(";
                
        //if the member is not a valid array, proceed next iteration
        if(!values[member].length)
            continue;
        
        for(var i = 0; i < values[member].length; i++) {
            tString += values[member][i];
            tString += (i+1) == values[member].length ? ")" : " ";
        }
        
        //get the start index of the current transform prop
        var sIndex = oldValues.indexOf(member);
        
        if(sIndex > -1) {
            var eIndex = oldValues.indexOf(")", sIndex);  //get the end index
            //Clear the old value for the given transform
            oldValues = oldValues.replace(oldValues.substring(sIndex, eIndex + 1), "");
        }
        
        oldValues += tString + " ";
    }
    //console.log(oldValues);
    element.setAttribute("transform", oldValues.substr(0, oldValues.length-1));
}