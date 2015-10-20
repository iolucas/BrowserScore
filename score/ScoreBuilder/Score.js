//Ensure definition of the ScoreBuilder namespace
if(!ScoreBuilder) var ScoreBuilder = new Object();   

//-----------------------------------------------------------
//-----------------------------------------------------------
//-------------------- SCORE OBJECT -------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

ScoreBuilder.Score = function() {

	var self = this,
		generalGroup = $G.create("g"),   //Score group to fit everything of the score
		headerGroup = $G.create("g");


	generalGroup.appendChild(headerGroup);
	var composerText = $G.createText("Composer", 40,"times");
	var titleText = $G.createText("Title", 46,"times");
	var lyricistText = $G.createText("Lyricist", 40,"times");

	titleText.translate(680);
	composerText.translate(1300, 50);
	lyricistText.translate(0, 50);

	headerGroup.appendChild(composerText);
	headerGroup.appendChild(titleText);
	headerGroup.appendChild(lyricistText);

	this.Draw = function() {
		return generalGroup;
	}

	var _scoreGroup = null;
	this.SetScoreGroup = function(scoreGroup) {
		_scoreGroup = scoreGroup;
		generalGroup.appendChild(scoreGroup.Draw());
	}

	var _title = "",
		_subtitle = "";
	this.SetTitle = function(title, subtitle) {
		
	}

	var _composer = "";
	this.SetComposer = function(composer) {

	}

	var _lyricist = "";
	this.SetLyricist = function(lyricist) {
		
	}

	this.Organize = function() {
		if(_scoreGroup)
			_scoreGroup.Organize();

		//Put header on the right position
		var headerBox = headerGroup.getBBox();
		headerGroup.translate(-headerBox.x, -headerBox.y);

		_scoreGroup.Draw().translate(0, headerBox.height + 50.5);
	}
}