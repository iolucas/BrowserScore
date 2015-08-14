xmlns="http://www.w3.org/2000/svg";
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

    //Function to translate the object begining from the 
    cavaco.MoveTo = function (x, y) {
        element.setAttribute("transform", "translate(" +
                (bBox.x * (-1) + x) + " " +
                (bBox.y * (-1) + y) + ")");
        cavaco.x = x;
        cavaco.y = y;
    }
}

//Horizontal container
function createContainer(width, height) {
    //Group to keep the container elements
    var container = document.createElementNS(xmlns, "g");
    
    //Append all cavaco.js needed members
    AppendCavacoMembers(container);
    //Got to overflow due to G tag doesn't have fixed size
    container.cavaco.height = height;
    container.cavaco.width = width;

    //----------------------------------------------------
    //-------------- BORDER RECTANGLE --------------------
    //----------------------------------------------------
    //Rectangle for container border
    var contBorder = document.createElementNS(xmlns, "rect");
    contBorder.style.display = "none";
    container.appendChild(contBorder);

    //Function to set the containers border
    container.SetBorder = function (borderWidth, borderColor) {
        var borderRect = this.getElementsByTagNameNS(xmlns, "rect")[0];
        borderRect.setAttribute("height", this.cavaco.height);
        borderRect.setAttribute("width", this.cavaco.width);
        borderRect.setAttribute("fill", "none");
        borderRect.style.display = "block";
        if (borderColor) borderRect.setAttribute("stroke", borderColor);
        if (borderWidth) borderRect.setAttribute("stroke-width", borderWidth);
    }
    //----------------------------------------------------
    //----------------------------------------------------
    //----------------------------------------------------


    //Object to holds the container size
    /*container.ContainerSize = {
        height: height,
        width: width       
    }*/
    
    //Object to hold the next x-position to place a element
    //container.nextPos = 0;
    
    //Object to hold the elements of the Container
    container.membersList = new List();
    

    
    //Function to move the container
    /*container.MoveTo = function(x,y) {
        this.setAttribute("transform", "translate(" + x + " " + y + ")");    
    }*/

    //Function to insert element in the container
    container.InsertAt = function (position, element) {
        //if the position is out of the array bounds, return null
        //if the desired to include element already exists, return null
        if (position < 0 || position > this.membersList.Count() || container.membersList.Exists(element))
            return null;
        
        //Append all cavaco.js needed members
        AppendCavacoMembers(element);
        
        //if the element height is bigger than the container, return null
        if (element.cavaco.height > this.cavaco.height)
            return null;
        
        //this.appendChild(element);  //append element to be able to get its box
        //var elemDim = element.getBBox();    //get the box that surrounds the element  
        //element.style.display = "none"; //imediatelly hide the element

        //get the length sum of the elements before the position specified        
        var elementsBeforeSum = 0;
        for (var i = 0 ; i < position ; i++)
            elementsBeforeSum += this.membersList.GetItem(i).cavaco.width;

        //if the container width minus the members width is lesser than the element width, return null
        if (element.cavaco.width > this.cavaco.width - elementsBeforeSum) {
            return null;
        }

        //---------------
        //DOESNT WORKED DUE TO B BOX ERROR. MUST REGISTER BBOX VALUES IN SOME OBJECT
        //--------------------

        //Set the element a function to move it
        //The minus 1 ops put the element at 0,0 position
        /*element.MoveTo = function (x, y) {
            this.setAttribute("transform", "translate(" +
                (this.getBBox().x * (-1) + x) + " " +
                (this.getBBox().y * (-1) + y) + ")");
            log(this.getBBox().x);
        }*/

        //if the position is the size of the list
        if (position == this.membersList.Count())
            container.membersList.Add(element);    //insert with add method
        else
            container.membersList.Insert(position, element); //insert element reference at the position to the list

        //register in the element it self its new position at the container
        //(maybe used in the future if margin stuff be implemented

        var centerPos = (this.cavaco.height - element.cavaco.height) / 2;

        /*element.currPos = {
            x: elementsBeforeSum,
            y: centerPos
        };*/

        //translate the element to its position at the container
        /*element.setAttribute("transform", "translate(" +
            (elemDim.x * (-1) + elementsBeforeSum) + " " +
            (elemDim.y * (-1) + (this.ContainerSize.height - elemDim.height) / 2) + ")");*/
        element.cavaco.MoveTo(elementsBeforeSum, centerPos);
        
        var overflowObjects = [],   //array to store elements that overflow the container after insertion of new element
            overflow = false;   //flag to signalize when a overflow occurs

        /*this.elemList.ForEach(function (e) {
            log(e.currPos);


        });*/


        //iterate thru all the container members since the removed and translate their positions
        for (var j = position + 1 ; j < this.membersList.Count() ; j++) {
            var currElem = this.membersList.GetItem(j); //get the item ref
            
            //update elem currPos width object
            var newX = currElem.cavaco.x += element.cavaco.width;
            
            //if a overflow flag or a overflow just occured, 
            //remove next element and put it in the overflow array and move the next iteration

            //log(currElem.currPos.x);
            //log(currElem.currPos.x + currElem.getBBox().width);
            //log(container.ContainerSize.width);

            if (overflow || newX + currElem.cavaco.width > container.cavaco.width) {

                overflow = true;//set the overflow flag
                overflowObjects.push(this.RemoveAt(j));
                j--;    //subtracts one unit from the position var
                continue;   //proceed next iteration
            }

            currElem.cavaco.MoveTo(newX, currElem.cavaco.y);
        }

        //update the nextposition value
        //this.nextPos += elemDim.width;
        this.appendChild(element);
        //element.style.display = "block";
        return overflowObjects;
    }
    
    //Function to add elements to the container
    container.AddElement = function(element) {
        return this.InsertAt(this.membersList.Count(), element);
    }
    
    //Function to Remove element at certain position
    container.RemoveAt = function(position) {
        //if the position is out of the array bounds, return false
        if(position < 0 || position >= this.membersList.Count())    
            return null;
        
        //get the elem ref and its width to translate the others
        var elem = this.membersList.GetItem(position);
            //elemWidth = elem.cavaco.width;
        
        //remove the element from the container
        this.removeChild(elem);
        
        var listSize = this.membersList.Count();   //get list size
        
        //iterate thru all the container members begging at  the removed element position and translate their positions
        for(var i = position + 1 ; i < listSize ; i++) {
            var currElem = this.membersList.GetItem(i); //get the item ref
            //update elem currPos width object
            //currElem.currPos.x -= elemWidth;
            currElem.cavaco.MoveTo(currElem.cavaco.x - elem.cavaco.width, currElem.cavaco.y)
            
            //Move the element to 
            /*currElem.MoveTo(currElem.getBBox().x * (-1) + currElem.currPos.x,
                currElem.getBBox().y * (-1) + currElem.currPos.y);*/
        }
        
        //update the nextposition value
        //this.nextPos -= elemWidth;
        
        //remove the element from the element list
        this.membersList.RemoveAt(position);
        
        //return the just removed elem
        return elem;
    }
    
    //Function to remove some element 
    container.RemoveElement = function(element) {
        var index = this.membersList.Find(element);    //find the element in the list
        if(index == -1)     //if not found, return false
            return null;
        
        return this.RemoveAt(index);//otherwise, remove the element        
    }
    
    return container;
}


var cont = createContainer(1000, 500);
document.documentElement.appendChild(cont);

var circ = document.createElementNS(xmlns, "circle");
circ.setAttribute("r", 150);

circ.setAttribute("fill", "yellow");

var circ2 = document.createElementNS(xmlns, "circle");
circ2.setAttribute("r", 200);

circ2.setAttribute("fill", "red");

cont.SetBorder(1, "#000");
cont.cavaco.MoveTo(10.5,10.5);

//log(cont.AddElement(circ));



log(cont.AddElement(DrawScoreLinesElement(ScoreElement.GClef)));
log(cont.AddElement(DrawScoreLinesElement(ScoreElement.SimpleBar)));
log(cont.AddElement(DrawScoreLinesElement(ScoreElement.TimeSig44)));
log(cont.AddElement(DrawScoreLinesElement(ScoreElement.TimeSig44)));
log(cont.AddElement(DrawScoreLines(20)));
log(cont.AddElement(circ));
log(cont.InsertAt(2, circ2));

//log(cont.RemoveAt(2));
log(cont.RemoveAt(0));
//log(cont.RemoveElement(circ2));


function log(msg) {console.log(msg);}

/*    var rect = document.createElementNS(xmlns, "rect");

    rect.setAttribute("x", 50);
    rect.setAttribute("y", 50);
    rect.setAttribute("height", 500);
    rect.setAttribute("width", 500);
    rect.setAttribute("fill", "blue");
    container.appendChild(rect);
    container.appendChild(circ);*/