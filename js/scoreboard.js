function managePlayerInfo(){
	document.getElementsByClassName( "playerInfo" )[ 0 ].classList.toggle( "playerInfoHide" );
};

function manageScoreboard(){
	document.getElementsByClassName( "scoreboardTimer" )[ 0 ].classList.toggle( "scoreboardTimerHide" );
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
		this.reset();
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
	};

	stop() {
		if( this.status == 1 ){
			this.status = 0;
			clearInterval( this.timer_id );
		};
	};

	reset()	{
		this.time = 0;
		this.generateTime();
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
}


let	scoreboardTimer = new ScoreboardTimer(
	function( time ) {
		if( time >= 2700 ) { 
			timer.stop();
			alert('time out');
		};
	}
);