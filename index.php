<!DOCTYPE html>
<html>
    
    <head>
        <meta charset="utf-8">
        <!--Begin Style-->
        <link rel="stylesheet" href="style.css"/>
        <!--End Style-->
        <title>Compos.In</title>        
    </head>
    
    <body>
        <!--Side menu-->
        <nav id="side-menu">   
            <div id="logo">
                Compos.In
            </div>
            <div class="side-menu-but" onclick="openFile()">Open...</div>
            <input type="file" id="files" accept=".xml" />
            <!--<input type="text"></input>-->
        </nav>
        
        <!--General Content - Generated by PHP-->
        <section id="general-content">
            <nav id="score-menu"></nav>
            <div id="score-page">
                <!--<object id="svgPage" type="image/svg+xml" data="debug.svg" height="3700" width="1520">Error</object>-->
                <svg id="svgContainer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1520" height="2000">

                </svg>
            </div>
        </section>
        <script src="xml2json.js"></script>
        <script src="score/g-query.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script src="score/ScoreConverter.js"></script>
        <script src="ariajs/List.js"></script>
        <!--<script src="ariajs/Aria.js"></script>-->
        <script src="score/ScoreLoader.js"></script>
        <script src="score/ScoreElements.js" type="text/javascript"></script>
        <script src="score/ScoreBuilder.js"></script>
        <script src="debug.js"></script>
        <script>


            //TERMINAR ADICIONAR SIMBOLOS PARTITURA E ADICIONAR BUILDERS PARA ELES
            window.onload = function() {

                var timeObj = {}
                timeObj["beats"] = 4;
                timeObj["beat-type"] = 4;

                var deltaFile = {
                    attributes: {
                        clef: {sign:'G'},
                        time: timeObj
                    },

                    measures: [
                        getMeasure(),
                        getMeasure(),
                        getMeasure(),
                        getMeasure(),
                        getMeasure()
                    ]
                }

                OpenScore(deltaFile);

            }

            function getInt(from, to) {
                return Math.round(Math.random()*(to-from) + from);
            }

            function getMeasure() {
                var measure = {
                    chords: [
                        getRandomChord(),
                        getRandomChord(),
                        //{ den: 1 , notes: [{n: 'B', o: 5, a: ""}] }
                    ]
                }
                return measure;
            }

            function getRandomChord() {
                var numberOfNotes = getInt(0,30),
                    randDen = Math.pow(2, getInt(0,6));
                    chord = { den: randDen , notes: [] };

                for(var i = 0; i < numberOfNotes; i++) {
                    var randomNote = String.fromCharCode(65 + getInt(0,6)),
                        randomOctave = getInt(3,6);

                    chord.notes.push({ n: randomNote, o: randomOctave, a: getRandomAccident() });
                }
                
                return chord;
            }

            function getRandomAccident() {
                //return "";
                var value = Math.round(Math.random() * 5),
                    acc = "";
                
                switch(value) {

                    case 1:
                        acc = "natural";
                        break;
                    
                    case 2:
                        acc = "sharp";
                        break;

                    case 3:
                        acc = "double-sharp";
                        break;

                    case 4:
                        acc = "flat";
                        break;

                    case 5:
                        acc = "flat-flat";
                        break;
                }

                return acc;
            }



            
            var svgContainer = document.getElementById("svgContainer"),
                scoreObj = null;

            //debug();

            function debug() {
                var chord = new ScoreBuilder.Chord({ denominator: 1 });
                chord.AddNote({n: 'G', o:3 });
                chord.Organize();
                svgContainer.appendChild(chord.Draw());
                chord.Draw().translate(100, 100);


            }

            function OpenScore(jsonStr) {
                //var composinObj = toComposinFormat(JSON.parse(jsonStr));

                //console.log(JSON.parse(jsonStr));
                //console.log(composinObj);

                if(scoreObj)
                    svgContainer.removeChild(scoreObj.Draw());
                    
                //scoreObj = ScoreLoader.Open(composinObj);
                scoreObj = ScoreLoader.Open(jsonStr);

                svgContainer.appendChild(scoreObj.Draw());
                
                scoreObj.Organize(1500, 300);
                scoreObj.MoveTo(15.5, 0.5);
            }

            //FILE OPEN STUFF
            var fileOpenBut = document.getElementById('files');
            fileOpenBut.addEventListener('change', handleFileSelect, false);

            function openFile() {
                //fileOpenBut.click();
            }

            function handleFileSelect(evt) {
                var file = evt.target.files[0]; // FileList object
                if(!file)
                    return;

                fileOpenBut.value = ""; //clear file value to be able to open the same file if needed

                var reader = new FileReader();

                reader.onloadend = function() {
                    if(reader.readyState == 2) {
                        //var xmlobj = parseXml(reader.result);
                        //console.log(xmlobj.documentElement.getElementsByTagName("measure"));    

                        //var jsonstr = xml2json(xmlobj);
                        //console.log(jsonstr);
                        //console.log(JSON.parse(jsonstr.replace("undefined", "")));
                        
                        postFile(replaceCreator(reader.result));
                        //console.log(replaceCreator(reader.result));
                    }
                }

                reader.readAsText(file);
            }

            function parseXml(xml) {
   var dom = null;
   if (window.DOMParser) {
      try { 
         dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
      } 
      catch (e) { dom = null; }
   }
   else if (window.ActiveXObject) {
      try {
         dom = new ActiveXObject('Microsoft.XMLDOM');
         dom.async = false;
         if (!dom.loadXML(xml)) // parse error ..

            window.alert(dom.parseError.reason + dom.parseError.srcText);
      } 
      catch (e) { dom = null; }
   }
   else
      alert("cannot parse xml string!");
   return dom;
}

            //function to replace the creator from music xml to easily find composer and lyricist
            function replaceCreator(xmlString) {
                //return xmlString;

                var changeArray = [];
                    composerIndex = xmlString.indexOf("<creator type=\"composer\">"),
                    poetIndex = xmlString.indexOf("<creator type=\"poet\">"),
                    lyricistIndex = xmlString.indexOf("<creator type=\"lyricist\">"),
                    artistIndex = xmlString.indexOf("<creator type=\"artist\">"),
                    tabberIndex = xmlString.indexOf("<creator type=\"tabber\">");

                if(composerIndex > -1)
                    changeArray[composerIndex] = "composer";

                if(poetIndex > -1)
                    changeArray[poetIndex] = "poet";

                if(lyricistIndex > -1)
                    changeArray[lyricistIndex] = "lyricist";

                if(artistIndex > -1)
                    changeArray[artistIndex] = "artist";

                if(tabberIndex > -1)
                    changeArray[tabberIndex] = "tabber";

                for(var i = 0; i < changeArray.length; i++) {
                    if(changeArray[i] == undefined)
                        continue;

                    xmlString = xmlString
                        .replace("<creator type=\"" + changeArray[i] + "\">", "<" + changeArray[i] + ">")
                        .replace("</creator>", "</" + changeArray[i] + ">");    
                }

                return xmlString;
            }

            //FILE POST STUFF
            function postFile(fileText) {
                var request = $.ajax({
                    url: "openFile.php",
                    type: "post",
                    data: { file: fileText}
                });

                // Callback handler that will be called on success
                request.done(function (response, textStatus, jqXHR){
                    OpenScore(response);
                });

                // Callback handler that will be called on failure
                request.fail(function (jqXHR, textStatus, errorThrown){
                    // Log the error to the console
                    console.error(
                        "The following error occurred: "+
                        textStatus, errorThrown
                    );
                });

                // Callback handler that will be called regardless
                // if the request failed or succeeded
                request.always(function () {});
            }

            /*
            window.onresize = function() {
                svgPage.width = window.innerWidth - 400;

                if(score) {
                    score.Organize(window.innerWidth - 420, 300);
                }
            }*/

        </script>
    </body>   
</html>