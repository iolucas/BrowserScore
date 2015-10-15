//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();   

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- SCORE PART OBJECT --------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

//Object to store score part data
ScoreBuilder.ScorePart = function() {
    var selfRef = this,
        measures = new List(),    //ordered list to fit all the measures @ this score
        currLineLength = 0,
        partModified = false,
        scoreAttr = {};    //object to store score attributes that are passed from the measures

    this.ForEachMeasure = function(action, index) {
        //iterate thru all the measures and apply the specified action to it
        measures.ForEach(action, index);
    }

    /*this.Find = function(measure) {
        return measures.Find(measure);
    }*/

    this.Count = function() {
        return measures.Count();
    }

    this.InsertMeasure = function(measure, position) {
        //if the measure object already exists at this measure, return a message
        if(measures.Find(measure) != -1) return "MEASURE_ALREADY_INSERTED"; 
        //implement timing verification in the future

        //Object validation successful

        //if the type of the position variable is different from number or the position is bigger or the size of the list
        if(typeof position != "number" || position >= measures.Count())    
            measures.Add(measure);    //insert with add method at the last position
        else //otherwise
            measures.Insert(position, measure); //insert element reference at the position to the list

        return "SUCCESS";
    }

    this.RemoveAt = function(position) {
        if(position < 0 || position >= measures.Count()) return "ERROR_POSITION_OUT_OF_BOUNDS";

        var removedMeasure = measures.GetItem(position);    //get the measure handler from the list

        if(removedMeasure.Draw().parentElement) //if this measure is appended somewhere
            removedMeasure.Draw().parentElement.removeChild(removedMeasure.Draw());  //remove it
        
        measures.RemoveAt(position);    //remove the measure from the list

        return removedMeasure;
    }

    this.RemoveMeasure = function(measure) {
        var position = measures.Find(measure);
        if(position == -1) 
            return "ERROR_MEASURE_NOT_FOUND";
        else 
            return selfRef.RemoveAt(position);
    }

    this.Organize = function() {

        //Iterate thru all measures and organize them passing the attribute pointer to update score attributes
        var prevMeasure = null;
        measures.ForEach(function(measure) {
            //console.log(measure.attr);
            //measure.OrganizeChords(scoreAttr);
            measure.OrganizeChords(prevMeasure);
            prevMeasure = measure;
        });
    }
}