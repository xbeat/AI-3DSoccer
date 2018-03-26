
/*
* Change skill value
*/
class Skill{
	constructor( controlPanel ){

		this.buttonContainer;
		this.buttonSelected;	
		this.updating = false;
		this.skillOpen = false;
		this.skillValue = document.getElementsByClassName( "skill-value" );
		this.controlPanel = controlPanel;	
		let scope = this;

		document.getElementById( "qty-subtract" ).addEventListener( "click", function() {
			
			this.buttonSelected.innerText = this.subtractQty( parseInt( this.buttonSelected.innerText ) );
			this.buttonContainer.style.backgroundColor = this.getColor( parseInt ( this.buttonSelected.innerText ), 0, 20 );

			this.updating = true;
		}.bind( this ));

		document.getElementById( "qty-addition" ).addEventListener( "click", function() {
			
			this.buttonSelected.innerText = this.addQty( parseInt( this.buttonSelected.innerText ) );
			this.buttonContainer.style.backgroundColor = this.getColor( parseInt ( this.buttonSelected.innerText ), 0, 20 );
			this.colorSkill = this.getColor( parseInt ( this.buttonSelected.innerText ), 0, 20 );
			
			this.updating = true;
		}.bind( this ) );

		// button skills value
		for ( let i = 0; i < this.skillValue.length; i++ ){

			document.getElementsByClassName( "skill-value" )[ i ].getElementsByTagName( "p" )[ 0 ].innerText = 10;
			document.getElementsByClassName( "skill-wrap" )[ i ].addEventListener( "click", function( event ) {
				
				this.buttonContainer = event.currentTarget;
				this.buttonSelected = event.currentTarget.getElementsByTagName( "p" )[0];

				//https://stackoverflow.com/questions/10003683/javascript-get-number-from-string
				this.SkillId = this.buttonSelected.id.replace( /^\D+/g, '' );
				scope.setPlayerId( parseInt ( this.SkillId ) + 3 );
				scene3D.playerSelected = parseInt ( this.SkillId ) + 3;

				if ( this.skillOpen == false ){
					this.skillOpen = true;
				} else {
					return;
				};

				document.getElementById( "skill-change-value-container" ).style.opacity = 1;
				document.getElementById( "skill-change-value-container" ).style.zIndex = 30;

				var autoClose = setInterval( function(){ 
					if ( this.updating == false ){
						document.getElementById( "skill-change-value-container" ).style.opacity = 0;
						document.getElementById( "skill-change-value-container" ).style.zIndex = -100;
						clearInterval( autoClose );
						this.skillOpen = false;
					} else {
						this.updating = false;
					};
				}.bind( this ), 2000 );

			}.bind( this ) );

		};

		let selects = document.getElementsByClassName( "skill-wrap" );
		document.getElementsByClassName( "cross-close" )[ 0 ].addEventListener( "click", function(){
			
			if ( document.getElementById( "skill" ).classList.contains( "shrink-skill" ) ){

				for( let i = 0, il = selects.length; i < il; i++ ){
					selects[i].style.transition = "opacity .3s linear 1.5s";
		    		selects[i].style.opacity = "1";
				};

				document.getElementById( "skill" ).classList.remove("shrink-skill");
		   		document.getElementById( "skill" ).style.width = "10px";
			    document.getElementById( "skill" ).style.transition = "background .2s linear .1s";
				document.getElementById( "skill" ).style.background = "rgba( 78, 78, 78, 1 )";
				document.getElementById( "skill" ).style.animation = "expand .5s linear .8s forwards";
		   		document.getElementById( "cross-close" ).style.transform = "rotate(180deg)";
				document.getElementById( "cross-close" ).style.left = "810px";
			    document.getElementById( "cross-close" ).style.transition = "left .5s linear .8s";
			    document.getElementById( "cross-close" ).style.animation = "unspin .5s linear 1.8s forwards";
			    document.getElementById( "playerInfo" ).style.transition = "bottom .4s linear .1s";
			    document.getElementById( "playerInfo" ).style.bottom = "150px";

			} else {
				
				for( let i = 0, il = selects.length; i < il; i++ ){
					selects[i].style.transition = "opacity .3s linear .1s";
					selects[i].style.opacity = "0";
				};

				document.getElementById( "skill" ).classList.add("shrink-skill");
				document.getElementById( "skill" ).style.width = "800px";
			    document.getElementById( "skill" ).style.transition = "background .2s linear 1.5s";
				document.getElementById( "skill" ).style.background = "rgba( 78, 78, 78, 0 )";
				document.getElementById( "skill" ).style.animation = "shrink .5s linear .5s forwards";
		   		document.getElementById( "cross-close" ).style.transform = "rotate(0deg)";
				document.getElementById( "cross-close" ).style.left = "5px";
			    document.getElementById( "cross-close" ).style.transition = "left .5s linear .5s";
			    document.getElementById( "cross-close" ).style.animation = "spin .5s linear 1.8s forwards";
			    document.getElementById( "playerInfo" ).style.transition = "bottom .4s linear 1.2s";
			    document.getElementById( "playerInfo" ).style.bottom = "10px";
			};

		});

		// button skills
		for( let i = 0, il = selects.length; i < il; i++ ){
			selects[i].addEventListener( "mouseenter", function( event ) {
			    this.style.transition = "all .3s";
			    this.style.transform = "scale( 1.1 )";
		    	this.style.cursor = "pointer";
		    });

		    selects[i].addEventListener( "mouseleave", function( event ) {
			    this.style.transition = "all .3s";
			    this.style.transform = "scale( 1 )";
		    	this.style.cursor = "none";
		    });
		};		

	};

	setPlayerId( id ){
		this.playerId = id;
	};

	addQty( val ) {

		if( isNaN( val ) ) {
			return 20;
		} else {
			if ( val < 20 ){
				return val+1;
			} else {
				return val;
			};
		};

	};

	subtractQty( val ) {

		if( isNaN( val ) ) {
			return 0;
		} else {  
			if( val > 0 && val <= 20 ) {
				return val-1;
			} else {
				return val;
			};
		};

	};

	getColor( value, min, max ){

	    if ( value > max ) value = max;
	    	var v = ( value - min) / ( max - min );
	    	var hue = ( ( 1 - v )* 120 ).toString( 10 );
	    return [ "hsl(", hue, ", 100%, 50% )" ].join( "" );

	};

};