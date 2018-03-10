'use strict';
 
class Menu{
	constructor(){

		let cameraMenuIsOpen = false;
		let mainMenuIsOpen = false;
		let closeTab = document.getElementsByClassName("closeTab");

		document.getElementById("wrapperMain").addEventListener( "mouseover", function(){
			this.addEventListener("transitionend", function(event) {
				if ( this.style.margin ==  "10px auto" ){
					mainMenuIsOpen = true;		
				} else {
					mainMenuIsOpen = false;
				};
			}, false);

			if ( mainMenuIsOpen == true ) return;

			this.style.margin = "10px auto";
			if ( cameraMenuIsOpen == true ){
				document.getElementById( "wrapperCamera" ).style.margin = "140px auto";
			};

		});

		document.getElementById("closeMenu").addEventListener( "click", function(){
			document.getElementById("wrapperMain").style.margin = "-100px auto";
			if ( cameraMenuIsOpen == true ){
				document.getElementById("wrapperCamera").style.margin = "30px auto";
			};
		});

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
			document.getElementById("wrapperMain").style.margin = "-100px auto";
			document.getElementById("wrapperCamera").style.margin = "30px auto";
			cameraMenuIsOpen = true;
		});

		for( let i = 0; i < closeTab.length; i++ ){
			closeTab[i].addEventListener( "click", function(){
				resetMenu();
			});
		};

		function resetMenu(){
			let content = document.getElementsByClassName("content");
			for( let i = 0; i < content.length; i++ ){
					content[i].style.display = "none";
			};
		};

		document.getElementById("tabPlayerData").addEventListener( "click", function(){
			resetMenu();
			document.getElementById( "playerData" ).style.display = "flex";
		});

		document.getElementById("tabPlayerStatistics").addEventListener( "click", function(){
			resetMenu();
			document.getElementById( "playerStatistics" ).style.display = "flex";
		});

		document.getElementById("tabTeamStatistics").addEventListener( "click", function(){
			resetMenu();
			document.getElementById( "teamStatistics" ).style.display = "flex";
		});

		document.getElementById("tabPlayerComparison").addEventListener( "click", function(){
			resetMenu();
			document.getElementById( "playerComparison" ).style.display = "flex";
		});

		document.getElementById("tabGameStatistics").addEventListener( "click", function(){
			resetMenu();
			document.getElementById( "gameStatistics" ).style.display = "flex";
		});

		document.getElementById("tabGameTactics").addEventListener( "click", function(){
			resetMenu();
			document.getElementById( "gameTactics" ).style.display = "flex";
		});

		document.getElementById("tabGameStrategy").addEventListener( "click", function(){
			resetMenu();
			document.getElementById( "gameStrategy" ).style.display = "flex";
		});

		document.getElementById("closeCamera").addEventListener( "click", function(){
			document.getElementById("wrapperCamera").style.margin = "-170px auto";
			cameraMenuIsOpen = false;
		});
	};
};

let menu = new Menu();

