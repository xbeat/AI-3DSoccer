/*
* EventDispatcher
*/

class EventDispatcher{

	constructor(){};

	addListenerMulti( el, a, fn, scope ) {

		//bind(this) will change the signature. 
		//Always assign the function to a var after binding this to using function bind API so 
		//that same var can be used in removeListener
		//https://stackoverflow.com/questions/10444077/javascript-removeeventlistener-not-working

		if ( scope !== undefined ){
			var fnStatic = fn.bind( scope ); 
		} else {
			var fnStatic = fn;
		};

		a.forEach( function( ev ) {
			el.addEventListener( ev, fnStatic, false );
		} );
		
		return fnStatic;
	};

	removeListenerMulti( el, a, fn ) {

		a.forEach( function( ev ) {
			el.removeEventListener( ev, fn, false );
		} );
	};

	addEventListener( type, listener ) {
		if ( this.listeners === undefined ) this.listeners = {};
		
		let listeners = this.listeners;
		
		if ( listeners[type] === undefined ) {
			listeners[type] = [];
		};

		if ( listeners[type].indexOf( listener ) === -1 ) {
			listeners[type].push( listener );
		};
	};

	hasEventListener( type, listener ) {
		
		if ( this.listeners === undefined ) return false;
			let listeners = this.listeners;
		
		if ( listeners[ type ] !== undefined &&
			listeners[ type ].indexOf( listener ) !== -1 ) {
			return true;
		};
		return false;
	};

	removeEventListener( type, listener ) {
		
		if ( this.listeners === undefined ) return;
		
		var listeners = this.listeners;
		var listenerArray = listeners[type];
		
		if ( listenerArray !== undefined ) {
			var index = listenerArray.indexOf( listener );
			if ( index !== -1 ) {
				listenerArray.splice( index, 1 );
			};
		};
	};

	dispatchEvent( event ) {
		if ( this.listeners === undefined ) return;
		let listeners = this.listeners;
		let listenerArray = listeners[event.type];

		if ( listenerArray !== undefined ) {
			event.target = this;
			var array = [];
			var length = listenerArray.length;
			for ( var i = 0; i < length; i++ ) {
				array[i] = listenerArray[i];
			};

			for ( var i = 0; i < length; i++ ) {
				array[i].call( this, event );
			};
		};
	};
};

/*
* Joystick
*/
class Joystick extends EventDispatcher {

	constructor( container, size, params ) {

		super();
		this.angle = 0;
		this.position = { x: 0, y: 0 };
		this.pointerId = null;
		this.isActive = false;

		this.width = size * 2;
		this.halfWidth = size;
		this.scope = this;

		var id = params && params.id ? params.id : "";
		var template = [
			'<div class="virtualInput-joystick" id="' + id + '">',
			'<div class="virtualInput-joystick__button"></div>',
			'<svg class="virtualInput-joystick__frame" width="' +
			this.width +
			'" height="' +
			this.width +
			'" viewbox="0 0 64 64">',
			'<polygon class="virtualInput-joystick__arrowUp"    points="32 19 34 21 30 21"></polygon>',
			'<polygon class="virtualInput-joystick__arrowRight" points="45 32 43 34 43 30"></polygon>',
			'<polygon class="virtualInput-joystick__arrowDown"  points="32 45 34 43 30 43"></polygon>',
			'<polygon class="virtualInput-joystick__arrowLeft"  points="19 32 21 34 21 30"></polygon>',
			'<circle  class="virtualInput-joystick__circle" cx="32" cy="32" r="16" stroke-width="' +
			this.halfWidth / 64 +
			'"></circle>',
			"</svg>",
			"</div>"
		].join("");

		container.insertAdjacentHTML( "beforeend", template );

		this.start = ["pointerdown", "MSPointerDown", "touchstart", "mousedown"];
		this.move = ["pointermove", "MSPointerMove", "touchmove", "mousemove"];
		this.end = ["pointerup", "MSPointerUp", "touchend", "mouseup"];

		this.all = document.getElementById( id );
		this.all.style.width = this.width + "px";
		this.all.style.height = this.width + "px";

		window.addEventListener( "resize", function() {
				this.offset.left = this.all.offsetLeft;
				this.offset.top = this.all.offsetTop;
		}.bind( this ) );

		this.button = this.all.querySelector( ".virtualInput-joystick__button" );
		this.button.style.width = size * 0.6 + "px";
		this.button.style.height = size * 0.6 + "px";

		this.addListenerMulti( this.button, this.start, this.onbuttondown, this );

		this.offset = {};
		this.offset.left = this.all.offsetLeft;
		this.offset.top = this.all.offsetTop;

		this.buttonRadius = parseInt( this.button.style.width ) / 2;
		this.frameRadius = size / 2;

		this.setCSSPosition( 0, 0 );
	};
	
	// Events
	onbuttondown( event ) {
		event.preventDefault();
		event.stopPropagation();

		this.dispatchEvent( { type: "active" } );
		this.isActive = true;

		if ( event.changedTouches ) {
			this.pointerId =
			event.changedTouches[event.changedTouches.length - 1].identifier;
		};

		var coordinate = this.getEventCoordinate( event );

		if ( !coordinate ) {
			return;
		};

		this.setPosition( coordinate.x, coordinate.y );
		this.dispatchEvent( { type: "move" } );

		this.staticonbuttonmove = this.addListenerMulti( document.body, this.move, this.onbuttonmove, this );
		this.staticonbuttonup = this.addListenerMulti( document.body, this.end, this.onbuttonup, this );
	};

	onbuttonmove( event ) {
		event.preventDefault();
		event.stopPropagation();
		var coordinate = this.getEventCoordinate( event );

		if ( !coordinate ) {
			return;
		};

		this.setPosition( coordinate.x, coordinate.y );
		this.dispatchEvent( { type: "move" } );
	};

	onbuttonup( event ) {
		event.stopPropagation();
		var wasEventHappend;

		if ( event.changedTouches ) {
			for ( ( i = 0 ), ( l = event.changedTouches.length ); i < l; i++ ) {
				if ( this.pointerId === event.changedTouches[i].identifier ) {
					wasEventHappend = true;
					break;
				};
				if ( !wasEventHappend ) {
					return;
				};
			};
		};

		this.dispatchEvent( { type: "disactive" } );
		this.isActive = false;
		this.setPosition( 0, 0 );

		this.removeListenerMulti( document.body, this.move, this.staticonbuttonmove );
		this.removeListenerMulti( document.body, this.end, this.staticonbuttonup );
	};


	getLength( x, y ) {
		return Math.sqrt(Math.pow( x, 2 ) + Math.pow( y, 2 ) );
	};

	setAngle( lengthX, lengthY ) {
		if (lengthX === 0 && lengthY === 0) {
			return this.angle;
		};

		var angle = Math.atan( lengthY / lengthX );

		if ( 0 > lengthX && 0 <= lengthY ) {
			//the second quadrant
			angle += Math.PI;
		} else if ( 0 > lengthX && 0 > lengthY ) {
			//the third quadrant
			angle += Math.PI;
		} else if ( 0 <= lengthX && 0 > lengthY ) {
			//the fourth quadrant
			angle += Math.PI * 2;
		};
		this.angle = angle;
		return angle;
	};

	getAngle() {
		return this.angle;
	};

	getPointOnRadius() {
		return {
			x: Math.cos( this.angle ),
			y: Math.sin( this.angle )
		};
	};

	// geometry
	getEventCoordinate( event ) {
		var x, y, i, l; 
		this.event = null;

		if ( event.changedTouches ) {
			for ( ( i = 0 ), ( l = event.changedTouches.length ); i < l; i++ ) {
				if ( this.pointerId === event.changedTouches[i].identifier ) {
					this.event = event.changedTouches[i];
				};
			};
		} else {
			this.event = event;
		};

		if ( this.event === null ) {
			return false;
		};

		x = ( this.event.clientX - this.offset.left - this.halfWidth ) / this.halfWidth * 2;
		y = ( -( this.event.clientY - this.offset.top) + this.halfWidth ) / this.halfWidth * 2;

		return { x: x, y: y };
	};

	setPosition( x, y ) {
		this.position.x = x;
		this.position.y = y;
		var length = this.getLength( x, y );
		var angle = this.setAngle( x, y );

		if ( 1 >= length ) {
			this.setCSSPosition( x, y );
			return;
		}

		var pointOnRadius = this.getPointOnRadius();
		this.setCSSPosition( pointOnRadius.x, pointOnRadius.y );
	};

	setCSSPosition( x, y ) {
		this.button.style.left =
		this.halfWidth + x * this.frameRadius - this.buttonRadius + "px";
		this.button.style.top =
		this.halfWidth - y * this.frameRadius - this.buttonRadius + "px";
	};

};

/*
*	Button
*/

class Button extends EventDispatcher {

	constructor( container, size, params ) {

		super();
		var scope = this;
		var id = params && params.id ? params.id : "";
		var label = params.label;
		var template = [
			'<div class="virtualInput-button" id="' + id + '">',
			'<div class="virtualInput-button__inner">',
			label,
			"</div>",
			"</div>"
		].join( "" );

		container.insertAdjacentHTML( "beforeend", template );

		var button = document.getElementById( id );
		button.style.width = size + "px";
		button.style.height = size + "px";

		let start = ["pointerdown", "MSPointerDown", "touchstart", "click"];
		let move = ["pointermove", "MSPointerMove", "touchmove", "mousemove"];
		var fn = function() {
			scope.dispatchEvent( { type: "press" } );
		};
		this.addListenerMulti( button, start, fn, undefined );
		this.addListenerMulti( button, move, function( event ){
			event.preventDefault();
			event.stopPropagation();
		}, undefined );

	};

};

/*
*  square button
*/
class SquareButton extends EventDispatcher{

	constructor( container, size, params ) {

		super();
		var scope = this;
		var id = params && params.id ? params.id : "";
		var label = params.label;
		var template = [
			'<div class="virtualInput-squareButton" id="' + id + '">',
			'<div class="virtualInput-squareButton__inner">',
			label,
			'</div>',
			'</div>'
		].join( "" );

		container.insertAdjacentHTML( "beforeend", template );
		
		var button = document.getElementById( id );
		button.style.width = size + "px";
		button.style.height = size + "px";

		let start = ["pointerdown", "MSPointerDown", "touchstart", "click"];
		let move = ["pointermove", "MSPointerMove", "touchmove", "mousemove"];
		var fn = function() {
			scope.dispatchEvent( { type: "press" } );
		};
		this.addListenerMulti( button, start, fn, undefined );
		this.addListenerMulti( button, move, function( event ){
			event.preventDefault();
			event.stopPropagation();
		}, undefined );

	};

};