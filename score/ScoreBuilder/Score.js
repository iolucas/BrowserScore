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
		headerGroup = $G.create("g"),
		titleText = $G.createText("", 46,"times"),
		titleHeight = 0,
		subtitleText = $G.createText("", 22,"times"),
		subtitleHeight = 0,
		composerText = $G.createText("", 28,"times"),
		lyricistText = $G.createText("", 28,"times"),
		tempoObj,

		SCORE_WIDTH = 1520;

	generalGroup.appendChild(headerGroup);

	headerGroup.appendChild(titleText);
	headerGroup.appendChild(subtitleText);
	headerGroup.appendChild(composerText);
	headerGroup.appendChild(lyricistText);

	this.Draw = function() { return generalGroup; }

	var _scoreGroup = null;
	this.SetScoreGroup = function(scoreGroup) {
		if(_scoreGroup && _scoreGroup.parentElement)
			_scoreGroup.parentElement.removeChild(_scoreGroup);

		_scoreGroup = scoreGroup;
		generalGroup.appendChild(scoreGroup.Draw());
	}

	this.SetTitle = function(title) {
		titleText.SetText(title);
		var titleBox = titleText.getBBox();

		titleHeight = titleBox.height;
		titleText.setAttribute("y", titleHeight);
		titleText.setAttribute("x", (SCORE_WIDTH - titleBox.width) / 2);

		setScoreGroupPos();
	}

	this.SetSubtitle = function(subtitle) {
		subtitleText.SetText(subtitle);
		var subtitleBox = subtitleText.getBBox();

		subtitleHeight = subtitleBox.height;
		subtitleText.setAttribute("y", titleHeight + subtitleHeight + 5);
		subtitleText.setAttribute("x", (SCORE_WIDTH - subtitleBox.width) / 2);

		setScoreGroupPos();		
	}


	this.SetComposer = function(composer) {
		composerText.SetText(composer);
		var composerBox = composerText.getBBox();

		composerText.setAttribute("y", titleHeight + subtitleHeight + composerBox.height + 50);
		composerText.setAttribute("x", SCORE_WIDTH - composerBox.width);

		setScoreGroupPos();	
	}


	this.SetLyricist = function(lyricist) {
		lyricistText.SetText(lyricist);
		var lyricistBox = lyricistText.getBBox();

		
		lyricistText.setAttribute("y", titleHeight + subtitleHeight + lyricistBox.height + 50);	

		setScoreGroupPos();	
	}

	this.SetTempo = function(denominator, dotted, value) {
		if(tempoObj && tempoObj.parentElement)
			tempoObj.parentElement.removeChild(tempoObj);

		if(denominator == undefined)
			return;

		tempoObj = DrawTempo(denominator, dotted, value);
		headerGroup.appendChild(tempoObj);
		tempoObj.translate(80, 200);

		setScoreGroupPos();	
	}

	function setScoreGroupPos() {
		var headerBox = headerGroup.getBBox();
		_scoreGroup.Draw().translate(0, headerBox.height + 30.5);
	}

	this.Organize = function() {
		if(_scoreGroup)
			_scoreGroup.Organize();

		//Put header on the right position
		//var headerBox = headerGroup.getBBox();
		//headerGroup.translate(-headerBox.x, -headerBox.y);

		//_scoreGroup.Draw().translate(0, headerBox.height + 50.5);
	}
}