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
            <input type="file" id="files" accept=".xml,.mxl" />
            <!--<input type="text"></input>-->
        </nav>
        
        <!--General Content - Generated by PHP-->
        <section id="general-content">
            <!--<nav id="score-menu"></nav>-->
            <div id="score-page">
                <!--<object id="svgPage" type="image/svg+xml" data="debug.svg" height="3700" width="1520">Error</object>-->
                <svg id="svgContainer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1520" height="100"></svg>
            </div>
        </section>
        <script src="g-query.js"></script>
        <script src="List.js"></script>
        <script src="ScoreBuilder/ScoreElements.js"></script>
        <!--<script src="score/ScoreBuilder/TabChord.js"></script>-->
        <script src="ScoreBuilder/Chord.js"></script>
        <script src="ScoreBuilder/Measure.js"></script>
        <script src="ScoreBuilder/MeasureGroup.js"></script>
        <script src="ScoreBuilder/ScorePart.js"></script>
        <script src="ScoreBuilder/ScoreGroup.js"></script>
        <script src="ScoreBuilder/Score.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script src="MusicXMLConversor.js"></script>
        <script src="bluemusic.js"></script>
        <script src="ScorePrerender.js"></script>
        <script src="musicXmlFileHandler.js"></script>
        <script src="DEBUG_SCORE.js"></script>
        <script>

            //get svg container reference
            var svgContainer = document.getElementById("svgContainer");

            window.onload = function() {

                //var newMusicScore = BlueMusic.GetScore.FromMJSON(GetDebugScore());
                //newMusicScore.Organize();

                //svgContainer.appendChild(newMusicScore.Draw());
                //var prFile = ScorePrerender(newMJson);

                //var newMusicScore = BlueMusic.GetScore.FromMJSON(prFile);
                //newMusicScore.Organize();

                //svgContainer.appendChild(newMusicScore.Draw());

                //console.log(newMusicScore)

            }




//-------------------------- OUTTER FILE OPENING -----------------------------------
            //FILE OPEN STUFF
            var fileOpenBut = document.getElementById('files');
            fileOpenBut.addEventListener('change', handleFileSelect, false);


            function openFile() {
                fileOpenBut.click();
            }


            function handleFileSelect(evt) {
                var file = evt.target.files[0]; // FileList object
                if(!file)
                    return;

                fileOpenBut.value = ""; //clear file value to be able to open the same file if needed

                //Check file extension
                var fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1);

                switch(fileExtension) {

                    case "mxl":
                        ReadMXLFile(file, function(openResult) {

                            //console.log(openResult);
                            if(openResult == "MXL_OPEN_ERROR")
                                console.log("Error while opening mxl file.");
                            else
                                LoadAndOpenMusicXML(openResult);
                        });
                        break;

                    case "xml":
                        ReadXMLFile(file, function(openResult) {
                            if(openResult == "XML_OPEN_ERROR")
                                console.log("Error while opening xml file.");
                            else
                                LoadAndOpenMusicXML(openResult);
                        });
                        break;
                }
            }


            function LoadAndOpenMusicXML(musicXML) {
                //Convert file into a dom
                var scoreObject = BlueMusic.GetScore.FromMusicXML(musicXML),
                    scoreDOM = scoreObject.Draw();

                //scoreDOM.scale(0.75);

                //Organize the score object
                scoreObject.Organize();    

                //Clear svg container
                while(svgContainer.children.length > 0)
                    svgContainer.removeChild(svgContainer.children[0]);


                var scoreHeight = scoreDOM.getBBox().height + 20;

                svgContainer.setAttribute("height", scoreHeight);    

                svgContainer.appendChild(scoreDOM);  
                
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