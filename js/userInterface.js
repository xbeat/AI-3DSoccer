const originalConsole = window.console;

function manageConsole(){

	document.getElementById( "myConsoleLog" ).classList.toggle( "myConsoleLogHide" );

	if ( document.getElementById( "myConsoleLog" ).classList.contains( "myConsoleLogHide" ) ){

		window.console = originalConsole;

	} else {
		
		window.console = {
			log: function( str ){
				var node = document.createElement( "div" );
				node.appendChild( document.createTextNode( str ) );
				document.getElementById("myConsoleLog").appendChild( node );
				document.getElementById("myConsoleLog").scrollTop = document.getElementById("myConsoleLog").scrollHeight;
			},
			warn: function( str ){
				console.log( str );
			}
		};

	};

};

function managePlayerInfo(){
	document.getElementsByClassName( "playerInfo" )[ 0 ].classList.toggle( "playerInfoHide" );
};

function manageBigScoreboard(){
	document.getElementsByClassName( "scoreBoardBigContainer" )[ 0 ].classList.toggle( "scoreBoardBigContainerHide" );
};

function manageScoreboard(){
	document.getElementsByClassName( "scoreboardTimer" )[ 0 ].classList.toggle( "scoreboardTimerHide" );
};

function displayBgGame(){	
	document.getElementsByTagName( "body" )[0].style.background = "url('img/big.jpg') no-repeat fixed top left / cover";
    document.getElementsByTagName( "body" )[0].style.zIndex = "-1";
};

function displayBgData(){	
	document.getElementsByTagName( "body" )[0].style.background = "url('img/stadiums-33.jpg') no-repeat fixed top left / cover";
    document.getElementsByTagName( "body" )[0].style.zIndex = "-1";
};


let icons = document.getElementsByClassName("icon");
for( let i = 0; i < icons.length; i++ ){
	icons[i].addEventListener( "mouseover", function(){
		this.style.transform = "scale(1.1)";
	});

	icons[i].addEventListener( "mouseleave", function(){
		this.style.transform = "scale(1)";
	});	

};

document.getElementById("camera").addEventListener( "click", function(){
	//document.getElementById("wrapperMain").style.margin = "-100px auto";
	document.getElementById("wrapperCamera").style.margin = "30px auto";
});

let closeTab = document.getElementsByClassName("closeTab");
for( let i = 0; i < closeTab.length; i++ ){
	closeTab[i].addEventListener( "click", function(){
		resetTab();
	});
};

function resetTab(){
	let content = document.getElementsByClassName("content");
	for( let i = 0; i < content.length; i++ ){
			content[i].style.display = "none";
	};
};

document.getElementById("tabPlayerData").addEventListener( "click", function(){
	resetTab();
	document.getElementById( "playerData" ).style.display = "flex";
});

document.getElementById("tabPlayerStatistics").addEventListener( "click", function(){
	resetTab();
	document.getElementById( "playerStatistics" ).style.display = "flex";
});

document.getElementById("tabTeamStatistics").addEventListener( "click", function(){
	resetTab();
	document.getElementById( "teamStatistics" ).style.display = "flex";
});

document.getElementById("tabPlayerComparison").addEventListener( "click", function(){
	resetTab();
	document.getElementById( "playerComparison" ).style.display = "flex";
});

document.getElementById("tabGameStatistics").addEventListener( "click", function(){
	resetTab();
	document.getElementById( "gameStatistics" ).style.display = "flex";
});

document.getElementById("tabGameTactics").addEventListener( "click", function(){
	resetTab();
	document.getElementById( "gameTactics" ).style.display = "flex";
});

document.getElementById("tabGameStrategy").addEventListener( "click", function(){
	resetTab();
	document.getElementById( "gameStrategy" ).style.display = "flex";
});

document.getElementById("tabHeatMap").addEventListener( "click", function(){
	resetTab();
	document.getElementById( "heatMap" ).style.display = "flex";
});

document.getElementById("closeCamera").addEventListener( "click", function(){
	document.getElementById("wrapperCamera").style.margin = "-170px auto";
});

function manageStatistics(){
	document.getElementsByClassName( "centerStat" )[ 0 ].classList.toggle( "centerStatShow" );
	document.getElementsByClassName( "scoreBoardBigContainer" )[ 0 ].classList.toggle( "scoreBoardBigContainerUp" );
	document.getElementsByClassName( "scoreBoardBigTop" )[ 0 ].classList.toggle( "scoreBoardBigTopHide" );
	if ( document.getElementsByClassName( "scoreBoardBigContainer" )[ 0 ].classList.contains("scoreBoardBigContainerHide") ){
		document.getElementsByClassName( "scoreBoardBigContainer" )[ 0 ].classList.toggle( "scoreBoardBigContainerHide" );
	}; 
};

function managePitch(){
	document.getElementById( "canvasPitch" ).classList.toggle( "hidePitch" );
	document.getElementById( "canvasPitchAI" ).classList.toggle( "hidePitch" );
};

/*
* Timer
*/
class ScoreboardTimer{
	constructor( callback ) {
		this.time = 0;
		this.status = 0;
		this.timer_id;
		this.callback = callback;
		this.generateTime();
	};

	start() {
		if( this.status == 0 ) {
			this.status = 1;
			this.timer_id = setInterval( function() {
				this.time++;
				this.generateTime();
				if( typeof( this.callback ) === 'function') this.callback( this.time );
			}.bind( this ), 1000);
		};

		EXECUTERAF = true;
	};

	stop() {
		if( this.status == 1 ){
			this.status = 0;
			clearInterval( this.timer_id );
		};
		//cancelAnimationFrame( RAF );
		cancelAnimationFrame( RAF_AI );
	};

	static pause(){

		EXECUTERAF = EXECUTERAF == true ? EXECUTERAF = false : EXECUTERAF = true;
	};

	reset()	{
		this.time = 0;
		this.generateTime();

        g_SoccerPitch.gameReset = true;

	};

	getTime() {
		return this.time;
	};

	getStatus()	{
		return this.status;
	};

	generateTime() {
		this.second = this.time % 60;
		this.minute = Math.floor( this.time / 60 ) % 60;
		this.second = ( this.second < 10 ) ? '0' + this.second : this.second;
		this.minute = ( this.minute < 10 ) ? '0' + this.minute : this.minute;
		document.getElementsByClassName('second')[ 0 ].innerText = this.second;
		document.getElementsByClassName('minute')[ 0 ].innerText = this.minute;
	};
};

