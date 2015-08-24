xmlns="http://www.w3.org/2000/svg";
xlink="http://www.w3.org/1999/xlink"; 

//Wrapper to hold possible elements to draw
var ScoreElement = {
    GClef: 0,
    TimeSig44: 1
};

//Wrapper to hold possible elements to draw
var MeasureElement = {
    SimpleBar: 0,
    Margin: 1,
    WholeNote: 2, 
    WholePause: 3,

    DebugNote: 1000
};

//Function to draw score Lines
function DrawScoreLines(length) {
    var scoreLines = document.createElementNS(xmlns, "path");
    scoreLines.setAttribute("d","M 0, 0 " + length + ", 0 M 0, 15 " + length + ", 15 M 0, 30 " + length + ", 30 M 0, 45 " + length + ", 45 M 0, 60 " + length + ", 60");
    scoreLines.setAttribute("stroke", "#000");
    return scoreLines;   
}
                
//Function to draw general score lines elements
function DrawScoreLinesElement(scoreElement) {
    var sElem;  //var to store line the score element draw
    
    switch(scoreElement) {
        
        case ScoreElement.GClef:
            sElem = document.createElementNS(xmlns, "path");  //create new path
            sElem.setAttribute("d","M7.124-20.882C7.871-13.221,2.175-7.019-2.868-2.008c-2.29,2.2-0.38,0.364-1.577,1.458 c-0.251-1.175-0.733-4.244-0.687-5.172c0.318-6.604,5.685-16.146,10.387-19.665C6.011-23.975,6.634-23.86,7.124-20.882z M8.721,18.682C5.7,16.46,1.735,15.875-1.902,16.51c-0.469-3.076-0.938-6.151-1.407-9.225C2.452,1.578,8.718-5.048,9.046-13.642 c0.144-5.471-0.678-11.45-4.114-15.892c-4.167,0.315-7.106,5.284-9.317,8.375C-8.033-14.616-7.181-6.658-5.781,0.398 c-1.983,2.334-4.729,4.272-6.685,6.702c-5.775,5.656-10.807,13.308-9.815,21.758c0.45,8.171,6.347,15.771,14.387,17.714 c3.054,0.771,6.285,0.848,9.373,0.242c0.538,5.515,2.515,11.344,0.228,16.698c-1.719,3.916-6.833,7.362-10.62,5.371 c-1.47-0.773-0.278-0.125-1.171-0.618c2.621-0.629,4.9-2.538,5.539-3.834c2.054-3.589-0.979-8.919-5.282-8.23 c-5.543,0.112-7.819,7.695-4.253,11.481c3.301,3.727,9.394,3.216,13.307,0.78c4.442-2.893,5-8.686,4.492-13.631 c-0.172-1.664-0.988-6.546-1.089-8.303c1.709-0.61,0.512-0.144,2.925-1.102c6.517-2.58,10.676-10.438,8.808-17.452 C13.581,24.373,11.803,20.832,8.721,18.682z M10.094,32.789c0.524,4.879-2.58,10.59-7.546,12.157 c-0.333-1.947-0.421-2.479-0.644-3.616C0.722,35.301,0.08,29.109-0.832,22.996c3.983-0.412,8.475,1.331,9.861,5.352 C9.625,29.763,9.869,31.282,10.094,32.789z M-2.524,45.524c-6.235,0.347-12.254-3.908-13.81-10.002 c-1.835-5.275-1.295-11.349,2.013-15.941c2.733-4.171,6.388-7.608,9.873-11.134C-4,11.209-3.551,13.97-3.103,16.736 c-7.329,1.917-12.266,11.581-7.879,18.261c1.304,1.875,4.844,5.45,6.778,4.007c-2.702-1.675-4.909-4.557-4.435-7.91 c-0.201-3.142,3.358-7.135,6.499-7.838c1.075,7.031,2.307,14.885,3.382,21.919C0.002,45.417-1.262,45.524-2.524,45.524z"); //draw in the created path the G clef symbol
            break;
            
        case ScoreElement.TimeSig44:
            sElem = document.createElementNS(xmlns, "path");  //create new path
            sElem.setAttribute("d","M6.891,32 l9.176,0.053c0,0-5.978,9.233-13.003,15.76c-0.053,0,7.708,0.053,7.708,0.053l0.052-5.041l5.873-5.677 l 0.262,11.036l2.991-0.017l-0.002,1.715l-3.015-0.013l0.013,2.903c0,0,0.499,2.124,3.041,2.163c0,0.052,0.013,3.012,0.013,3.012L7.625,58l0.052-3.184c0,0,3.172,0.796,3.159-4.908c0-0.001-10.749-0.013-10.749-0.013L0,48.511C0,48.511,7.232,41.422,6.891,32zM6.891,2 l9.176,0.053c0,0-5.978,9.233-13.003,15.76c-0.053,0,7.708,0.053,7.708,0.053l0.053-5.041l5.873-5.677l0.262,11.036l2.991-0.017l-0.003,1.715l-3.015-0.013l0.013,2.903c0,0,0.499,2.124,3.041,2.163c0,0.052,0.014,3.012,0.014,3.012L7.625,28l0.053-3.184c0,0,3.172,0.796,3.159-4.908c0-0.001-10.749-0.013-10.749-0.013L0,18.511C0,18.511,7.232,11.422,6.891,2z"); //draw in the created path the G clef symbol
            break;
            
        default:
            return null; 
    }
    
    sElem.setAttribute("class", "scoreElement");
    return sElem;
}

//Function to draw general score measure elements
function DrawMeasureElement(measureElement) {
    var mElem;  //var to store the measure element draw

    switch(measureElement) {
            
        //Element to draw simple bars in the score
        case MeasureElement.SimpleBar:
            mElem = document.createElementNS(xmlns, "line");  //create new line
            mElem.setAttribute("y2", 60);
            mElem.setAttribute("stroke", "#000");
            break;  

        case MeasureElement.Margin:
            mElem = document.createElementNS(xmlns, "rect");  //create new line
            mElem.setAttribute("width", 20);
            mElem.setAttribute("height", 1);
            //mElem.setAttribute("stroke", "yellow");
            mElem.setAttribute("fill", "none");
            break;

        case MeasureElement.QuarterNote:
            mElem = document.createElementNS(xmlns, "path");  //create new path
            //draw in the created path the whole note
            mElem.setAttribute("d","M13.233,12.788c4.43-2.373,6.791-6.671,5.338-9.906c-1.549-3.447-6.869-4.42-11.877-2.172C1.686,2.96-1.122,7.585,0.427,11.034c1.548,3.445,6.87,4.42,11.879,2.172C12.618,13.063,12.938,12.946,13.233,12.788z");  
            mElem.setAttribute("transform", "translate(0 2)");    
            break;

        case MeasureElement.WholeNote:
            mElem = document.createElementNS(xmlns, "path");  //create new path
            //draw in the created path the whole note
            mElem.setAttribute("d","M12.352,0.108 C5.461,0.355,0,3.604,0,7.555C0,11.664,5.913,15,13.198,15c7.287,0,13.198-3.336,13.198-7.445c0-4.111-5.911-7.447-13.198-7.447C12.914,0.108,12.632,0.099,12.352,0.108z M10.152,1.547c1.838-0.188,4.153,0.664,6.091,2.411c2.904,2.616,3.888,6.286,2.201,8.208l-0.042,0.042c-1.722,1.908-5.5,1.319-8.419-1.312s-3.877-6.341-2.157-8.25C8.404,2.006,9.222,1.643,10.152,1.547z");          
            break;

        case MeasureElement.WholePause:
            mElem = document.createElementNS(xmlns, "rect");  //create new rect
            //set attributes for the whole pause symbol
            mElem.setAttribute("width", 20);
            mElem.setAttribute("height", 7.5);
            mElem.setAttribute("fill", "#000");
            break;

        case MeasureElement.DebugNote:
            mElem = document.createElementNS(xmlns, "circle");  //create new line
            mElem.setAttribute("r", 7.5);
            mElem.setAttribute("fill", "yellow");
            mElem.setAttribute("stroke", "#008");
            break;
            
        default:
            return null; 
    }
    
    mElem.setAttribute("class", "measureElement");
    return mElem;
}