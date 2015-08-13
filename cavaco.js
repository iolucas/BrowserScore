xmlns="http://www.w3.org/2000/svg";
xlink="http://www.w3.org/1999/xlink";


function createContainer(height, width) {
    //Group to keep the container elements
    var container = document.createElementNS(xmlns, "g");
    
    //Rectangle for container border
    var contBorder = document.createElementNS(xmlns, "rect");
    contBorder.style.display = "none";
    container.appendChild(contBorder);
    
    container.ContainerSize = {
        height: height,
        width: width       
    }
    
    //Function to set the containers border
    container.SetBorder = function(borderWidth, borderColor) {
        var borderRect = this.getElementsByTagNameNS(xmlns, "rect")[0];
        borderRect.setAttribute("height", this.ContainerSize.height);
        borderRect.setAttribute("width", this.ContainerSize.width);
        borderRect.setAttribute("fill", "#fff");
        borderRect.style.display = "block";
        if(borderColor) borderRect.setAttribute("stroke", borderColor);
        if(borderWidth) borderRect.setAttribute("stroke-width", borderWidth);
    }
    
    //Function to move the container
    container.MoveTo = function(x,y) {
        container.setAttribute("transform", "translate(" + x + " " + y + ")");    
    }
    
    return container;
}


var cont = createContainer(500,500);
document.documentElement.appendChild(cont);

cont.SetBorder(1, "#000");
cont.MoveTo(10,10);

/*    var rect = document.createElementNS(xmlns, "rect");
    var circ = document.createElementNS(xmlns, "circle");
    circ.setAttribute("r", 100);
    circ.setAttribute("cx", 120);
    circ.setAttribute("cy", 120);
    circ.setAttribute("fill", "yellow");
    rect.setAttribute("x", 50);
    rect.setAttribute("y", 50);
    rect.setAttribute("height", 500);
    rect.setAttribute("width", 500);
    rect.setAttribute("fill", "blue");
    container.appendChild(rect);
    container.appendChild(circ);*/