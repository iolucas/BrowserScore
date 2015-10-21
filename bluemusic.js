//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
///////////////// 		BLUE MUSIC JS		//////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////


var BlueMusic = new function() {
    var self = this;

    this.GetScore = new function() {

        var getScore = this;

        this.FromMusicXML = function(musicXMLData) {
            var musicXMLObject = null;

            if(typeof musicXMLData == "string")
                musicXMLObject = parseXml(musicXMLData);
            else
                musicXMLObject = musicXMLData;      
            
            var mJsonString = xml2json(parseXml(musicXMLData)),
                mJsonObject = JSON.parse(mJsonString.replace("undefined", ""));

            return getScore.FromMJSON(mJsonObject["score-partwise"]);   
        }

        this.FromMJSON = function(mJson) {
            return getScoreFromMJSON(mJson);
        }
    }



    //PRIVATE MEMBERS

    function getScoreFromMJSON(mJson) {

        //Create the new score
        var newScore = new ScoreBuilder.Score();

        if(mJson.title)
            newScore.SetTitle(mJson.title);
        else
            newScore.SetTitle("Untitled");
        
        if(mJson.composer)
            newScore.SetComposer(mJson.composer);

        if(mJson.lyricist)
            newScore.SetLyricist(mJson.lyricist);

        if(mJson.tempo && mJson.tempo.length > 1) {
            if(mJson.tempo.length == 3)
                newScore.SetTempo(mJson.tempo[0], mJson.tempo[1], mJson.tempo[2]);
            else
                newScore.SetTempo(mJson.tempo[0], 0, mJson.tempo[1]);
        }

        if(mJson.scoreParts && mJson.scoreParts.length > 0)
            newScore.SetScoreGroup(getScoreGroup(mJson.scoreParts));

        return newScore;
    }

    function getScoreGroup(scoreParts) {


        var newScoreGroup = new ScoreBuilder.ScoreGroup();
        if(scoreParts && scoreParts.length > 0) {
            for(var i = 0; i < scoreParts.length; i++) {
                newScoreGroup.InsertPart(getScorePart(scoreParts[i]));    
            }
        }

        return newScoreGroup;
    }

    function getScorePart(scorePart) {
        var newScorePart = new ScoreBuilder.ScorePart();
        if(scorePart && scorePart.measures && scorePart.measures.length > 0) {
            for(var i = 0; i < scorePart.measures.length; i++) {
                newScorePart.InsertMeasure(getScoreMeasure(scorePart.measures[i]));    
            }
        }

        return newScorePart;
    }

    function getScoreMeasure(scoreMeasure) {
        var newScoreMeasure = new ScoreBuilder.Measure();

        if(scoreMeasure == undefined)
            return newScoreMeasure;

        if(scoreMeasure.clef)
            newScoreMeasure.SetClef(scoreMeasure.clef);
            
        if(scoreMeasure.keySig)
            newScoreMeasure.SetKeySig(scoreMeasure.keySig);

        if(scoreMeasure.timeSig)
            newScoreMeasure.SetTimeSig(scoreMeasure.timeSig); 

        if(scoreMeasure.startBar)
            newScoreMeasure.SetStartBar(scoreMeasure.startBar);

        if(scoreMeasure.endBar)
            newScoreMeasure.SetEndBar(scoreMeasure.endBar);

        if(scoreMeasure.chords && scoreMeasure.chords.length > 0) {
            for(var i = 0; i < scoreMeasure.chords.length; i++) {
                newScoreMeasure.InsertChord(getScoreChord(scoreMeasure.chords[i]));    
            }
        }  

        return newScoreMeasure;                 
    }

    function getScoreChord(scoreChord) {

        var newScoreChord = new ScoreBuilder.Chord(scoreChord.denominator, scoreChord.dotted);

        if(scoreChord.notes && scoreChord.notes.length > 0) {
            newScoreChord.AddNoteCollection(scoreChord.notes);
        }

        return newScoreChord; 
    }



    //Function to parse XML strings to xml dom
    function parseXml(xmlString) {
        var xmlDom = null;
        if (window.DOMParser) {
            
            try { 
                xmlDom = (new DOMParser()).parseFromString(xmlString, "text/xml"); 
            } catch (e) { xmlDom = null; }
        
        } else if (window.ActiveXObject) {
            
            try {
                xmlDom = new ActiveXObject('Microsoft.XMLDOM');
                xmlDom.async = false;
                if (!xmlDom.loadXML(xmlString)) // parse error ..
                    window.alert(xmlDom.parseError.reason + xmlDom.parseError.srcText);
            } catch (e) { xmlDom = null; }
        
        } else
            alert("Cannot parse xml string!");
        
        return xmlDom;
    }





}

//Function to convert music xml to maestro json (mjson)
/*MusicXML.ToMJSON = function(xmlString) {

	var mJsonString = xml2json(parseXml(xmlString)),
		mJsonObject
	console.log(mJson);

}*/


