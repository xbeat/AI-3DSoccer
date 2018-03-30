class Formation{

	constructor( orientation ){
		let formation = [
			[ 5, 4, 1 ],
			[ 4, 5, 1 ],
			[ 4, 4, 2 ],
			[ 4, 4, 1, 1 ],
			[ 4, 3, 3 ],
			[ 4, 3, 2, 1 ],
			[ 4, 2, 3, 1 ],
			[ 4, 2, 2, 2 ],
			[ 4, 2, 1, 3 ],
			[ 4, 1, 4, 1 ],
			[ 4, 1, 3, 2 ],
			[ 4, 1, 2, 3 ],
			[ 3, 5, 1, 1 ],
			[ 3, 4, 1, 2 ],
			[ 3, 4, 3 ],
			[ 3, 4, 2, 1 ]
		];		

		for ( let i = 0; i < formation.length; i++ ){

			let formationText = document.createElement( "div" );
			formationText.classList.add( "formationText" );
			document.getElementById( "formation" + orientation ).appendChild( formationText );
			
			let text = formation[ i ][ 0 ];

			for ( let j = 1; j < formation[ i ].length; j++ ){	
				text = text + " - " + formation[ i ][ j ];
			};

			formationText.innerText = text;
			formationText.setAttribute( 'data-id', i );
			formationText.setAttribute( 'data-text', text );

			// formation selection
			formationText.addEventListener( "click", function( ev ){
				let selectedFormation = ev.currentTarget.getAttribute( "data-id" );
				[].forEach.call( document.querySelectorAll( '.formationText' ), function ( el, indexElem ) {
					el.style.border = "2px solid transparent";
				});
				this.style.borderBottom = "2px solid #38B87c";
				document.getElementById("gameTacticsTitle").innerText = "GAME TACTICS ( " + ev.currentTarget.getAttribute( "data-text" ) + " )";

				// display jersey
				let formationJerseyContainer = document.getElementById( "formationJerseyContainer" + orientation );
				formationJerseyContainer.innerHTML = "";
				let jerseyNUmber = 0;

				if ( formation[ selectedFormation ].length == 4 ){
					var jerseyMargin = "0px 20px 30px 20px";
				} else {
					var jerseyMargin = "0px 20px 80px 20px";
				};

				for ( let j = formation[ selectedFormation ].length - 1; j >= 0; j-- ){	
					let jerseyFormationRow = document.createElement( "div" );
					jerseyFormationRow.classList.add( "jerseyFormationRow" + orientation );
					formationJerseyContainer.appendChild( jerseyFormationRow );

					for ( let p = 0; p < formation[ selectedFormation ][ j ]; p++ ){
						let jersey = new Jersey( jerseyFormationRow, ++jerseyNUmber, jerseyMargin, j );
					};

				};

				// Goalkeeper
				let goalKeeperContainer = document.createElement( "div" );
				goalKeeperContainer.classList.add( "goalKeeperContainer" );
				formationJerseyContainer.appendChild( goalKeeperContainer );
				let goalKeeper = new Jersey( goalKeeperContainer, 99, 0, 0 );

			});

		};
	};
};

class Jersey{

	constructor( formationJerseyContainer, jerseyNumber, jerseyMargin = 0, row = 0  ){

		let SVGInner = new Array;
		this.SVG_NS = "http://www.w3.org/2000/svg";

		SVGInner.push( this.svg( "path", {
				class: "shadow",
				transform: "translate( 20,20 )",
				d: "M0,106 L87,0 L183,0 L227,44 L271,0 L367,0 L454,106 L385,201 L367,183 L367,385 L87,385 L87,183 L69,201 L0,106 Z"
			} )
		);

		SVGInner.push( this.svg( "path", {
				 class: "jersey_base",
				 fill: "#4A90E2",
				 stroke: "#4A90E2",
				 d: "M0,106 L87,0 L183,0 L227,44 L271,0 L367,0 L454,106 L385,201 L367,183 L367,385 L87,385 L87,183 L69,201 L0,106 Z"
			} )
		);

		let SVGInnerPath = new Array;

		SVGInnerPath.push( this.svg( "path", {
				fill: "#4A90E2", 
				class: "decal decal-one", 
				d: "M87,-2.84217094e-14 L173,-2.84217094e-14 L227,64 L281,-2.84217094e-14 L367,-2.84217094e-14 L367,385 L87,385 L87,-2.84217094e-14 Z"
			} )
		);

		SVGInnerPath.push( this.svg( "path", {
				fill: "#BD10E0",
				class: "decal decal-three", 
				d: "M183,12 L227,64 L271,12 L271,385 L183,385 L183,12 Z"
			} )
		);

		SVGInnerPath.push( this.svg( "polygon", {
				fill: "#4A90E2", 
				class: "decal decal-four", 
				points: "173 0 227 64 281 0 271 0 227 44 183 0"
			} )
		);

		SVGInner.push( this.svg( "g", {
			 class: "decals",
			}, SVGInnerPath )
		);

		SVGInner.push( this.svg( "text", {
				x: "50%",
				y: "50%",
				class: "jersey_name",
				id: "jersey_name#" + jerseyNumber
			} )
		);
	
		let jerseyElement = this.svg( "svg", { 
				class: "jersey",
				id: "jersey",
				viewBox: "0 0 468 395",
				width: "70px"
		}, SVGInner );
		
		let jerseyContainer = document.createElement( "div" );
		jerseyContainer.classList.add( "jerseyContainer" );
		jerseyContainer.style.margin = jerseyMargin;
		jerseyContainer.appendChild( jerseyElement );
		
		formationJerseyContainer.appendChild( jerseyContainer );
		document.getElementById( "jersey_name#" + jerseyNumber ).textContent = jerseyNumber;

		let jerseyNoteTop = document.createElement( "div" );
		jerseyNoteTop.classList.add( "jerseyNoteTop" );
		jerseyContainer.appendChild( jerseyNoteTop );
		jerseyNoteTop.innerText = "Player " + jerseyNumber;

		let jerseyNoteBottom = document.createElement( "div" );
		jerseyNoteBottom.classList.add( "jerseyNoteBottom" );
		jerseyContainer.appendChild( jerseyNoteBottom );
		jerseyNoteBottom.innerText = "ROLE " + jerseyNumber;

		switch ( row ) {
			case 0:
				jerseyNoteBottom.style.backgroundColor = "#cc0000";
				break;
			case 1:
				jerseyNoteBottom.style.backgroundColor = "#3385ff";
				break;
			case 2:
				jerseyNoteBottom.style.backgroundColor = "#008000";
				break;
			case 3:
				jerseyNoteBottom.style.backgroundColor = "#00cc00";
				break;
			default:
				break;
		};	

	};

	/**
	* create SVG
	*/
	svg( name, attrs, children ) {
		const elem = document.createElementNS( this.SVG_NS, name );
		for( const attrName in attrs ) {
			elem.setAttribute( attrName, attrs[ attrName ] );
		};

		if( children ) {
			children.forEach( function( c ) {
				elem.appendChild( c );
			} );
		};
		return elem;
	};
};

let formation = new Formation( "V" );

