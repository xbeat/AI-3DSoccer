class Gauge{
	constructor( size = 100, strokeWidth = 3, start = 30, stop = 100, duration = 1500, type = "full", element, label = "", fill, container = document.body ) {

		this.SVG_NS = "http://www.w3.org/2000/svg";
		this.ease = Easing.easeOutQuint;
		this.start = start;
		this.stop = stop > 100 ? 100 : stop;  
		this.max = 100;
		this.size = size;
		this.fill = fill;
		this.label = label;
		this.strokeWidth = strokeWidth;
		this.duration = duration;
		this.container = container;
		this.element = element;
		
		this.radius = ( this.size / 2 ) - this.strokeWidth;
		this.pos = this.size / 2;
	
		// 2 * Math.PI * (r - stroke-width)
		this.circleLength = 2 * Math.PI * this.radius;		

		switch ( type ){
			case "half":
				this.step = ( this.circleLength / this.max ) / 2;
				this.ringDashArray = this.circleLength / 2;
				this.ringDashOffset = this.circleLength / 2;
				this.segmentDashArray = this.start * this.step  + " " + ( this.circleLength - ( this.start * this.step ) );
				this.segmentDashOffset = this.circleLength / 2;				
				break;

			case "full":
				this.step = this.circleLength / this.max;
				this.ringDashArray = this.circleLength;
				this.ringDashOffset = 0;
				this.segmentDashArray = this.start * this.step  + " " + ( this.circleLength - ( this.start * this.step ) );
				this.segmentDashOffset = this.circleLength / 2;				
				break;				
		};

		this.initializeGauge();
		//this.animate();

	};

	initializeGauge() {

		let SVGInner = new Array;
		
		SVGInner.push( this.svg( "circle", {
				class: "gauge-hole",
				cx: this.pos,
				cy: this.pos,
				r: this.radius,
				fill: "#fff"
			} )
		);

		SVGInner.push( this.svg( "circle", {
				class: "gauge-ring",
				cx: this.pos,
				cy: this.pos,
				r: this.radius,
				fill: "transparent",
				"stroke-dasharray": this.ringDashArray,
				"stroke-dashoffset": this.ringDashOffset,
				stroke: "#d2d3d4",
				"stroke-width": this.strokeWidth
			} )
		);

		SVGInner.push( this.svg( "circle", {
				id: "gauge-segment-" + this.element,
				class: "gauge-segment",
				cx: this.pos,
				cy: this.pos,
				r: this.radius,
				fill: "transparent",
				"stroke-dasharray": this.segmentDashArray,
				"stroke-dashoffset": this.segmentDashOffset,
				stroke: this.fill,
				"stroke-width": this.strokeWidth
			} )
		);

		let SVGInnerText = new Array;
		SVGInnerText.push( this.svg( "text", {
				id: "gauge-number-" + this.element,
				x: "50%",
				y: "50%",
				class: "gauge-number"
			} )
		);

		SVGInnerText.push( this.svg( "text", {
				id: "gauge-label-" + this.element,
				x: "50%",
				y: "50%",
				fill: "#999",
				class: "gauge-label"
			} )
		);
		
		SVGInner.push( this.svg( "g", {
				class: "gauge-text"
			}, SVGInnerText )
		);

		let gaugeElement = this.svg( "svg", { 
				viewBox: "0 0 " + this.size + " " + this.size,
				width: this.size + "px",
				height: this.size + "px",
				class: "gauge" 
		}, SVGInner );
		
		this.container.appendChild( gaugeElement );
		document.getElementById( "gauge-number-" + this.element ).textContent = this.start;
		document.getElementById( "gauge-label-" + this.element ).textContent = this.label;	
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

	normalize( val, min, max ) { 
		return ( val - min ) / ( max - min ); 
	};

	//p0: The initial number
	//p1: The final number
	//u: The progress. It is given in percentage, between 0 and 1
	
	lerp( p0, p1, u ) {
		//return p0 + ( p1 - p0 ) * ( 1 - u );
		return p0 + ( p1 - p0 ) * u;
	};

	onUpdate( position ){
		let circleProgress = position * this.step;
		document.getElementById( "gauge-segment-" + this.element ).setAttribute( "stroke-dasharray", circleProgress + " " + ( this.circleLength - circleProgress ) );
		document.getElementById( "gauge-number-" + this.element ).textContent = parseInt( position );
	};

	onComplete(){
		//console.log("complete");
	};

	animate() {
		this.timeStart = this.timeStart === undefined ? Date.now() : this.timeStart;
		let now = Date.now();
		let t = ( now - this.timeStart ) / this.duration;
		let progress = this.ease( t );// for 1..0 range. Just do: progress = 1.0 - progress;
		let position = this.lerp( this.start, this.stop, progress );

		// If complete
		if ( t >= 1 ) {
			this.onUpdate( position );
			this.onComplete( position );
		} else {
			// Run update callback and loop until finished
			this.onUpdate( position );
			let scope = this;
			requestAnimationFrame( function() { scope.animate(); } );
		};
	};
};
	
/*
* Easing Functions
* only considering the t value for the range [0, 1] => [0, 1]
*/
var Easing = {
	// no easing, no acceleration
	linear: function linear(t) {
		return t;
	},
	// accelerating from zero velocity
	easeInQuad: function easeInQuad(t) {
		return t * t;
	},
	// decelerating to zero velocity
	easeOutQuad: function easeOutQuad(t) {
		return t * (2 - t);
	},
	// acceleration until halfway, then deceleration
	easeInOutQuad: function easeInOutQuad(t) {
		return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	},
	// accelerating from zero velocity
	easeInCubic: function easeInCubic(t) {
		return t * t * t;
	},
	// decelerating to zero velocity
	easeOutCubic: function easeOutCubic(t) {
		return --t * t * t + 1;
	},
	// acceleration until halfway, then deceleration
	easeInOutCubic: function easeInOutCubic(t) {
		return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
	},
	// accelerating from zero velocity
	easeInQuart: function easeInQuart(t) {
		return t * t * t * t;
	},
	// decelerating to zero velocity
	easeOutQuart: function easeOutQuart(t) {
		return 1 - --t * t * t * t;
	},
	// acceleration until halfway, then deceleration
	easeInOutQuart: function easeInOutQuart(t) {
		return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
	},
	// accelerating from zero velocity
	easeInQuint: function easeInQuint(t) {
		return t * t * t * t * t;
	},
	// decelerating to zero velocity
	easeOutQuint: function easeOutQuint(t) {
		return 1 + --t * t * t * t * t;
	},
	// acceleration until halfway, then deceleration
	easeInOutQuint: function easeInOutQuint(t) {
		return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
	},
	// elastic bounce effect at the beginning
	easeInElastic: function easeInElastic(t) {
		return (.04 - .04 / t) * Math.sin(25 * t) + 1;
	},
	// elastic bounce effect at the end
	easeOutElastic: function easeOutElastic(t) {
		return .04 * t / --t * Math.sin(25 * t);
	},
	// elastic bounce effect at the beginning and end
	easeInOutElastic: function easeInOutElastic(t) {
		return (t -= .5) < 0 ? (.01 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1;
	}
};

