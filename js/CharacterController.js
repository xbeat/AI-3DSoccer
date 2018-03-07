//==============================================================================
class CharacterController{

	constructor( speedBlendCharacter ) {

		this.scope = this;
		this.duration = 2;
		this.keys = {
			LEFT:  { code: 37, isPressed: false },
			UP:    { code: 38, isPressed: false },
			RIGHT: { code: 39, isPressed: false },
			A:     { code: 65, isPressed: false },
			D:     { code: 68, isPressed: false },
			W:     { code: 87, isPressed: false }
		};

		this.character = speedBlendCharacter;
		this.walkSpeed = 3;
		this.runSpeed = 7;
		this.forward = new THREE.Vector3(); 
		this.newSpeed = 0;
		this.lastSpeed = 0;

	};

	// ---------------------------------------------------------------------------
	update( dt ) {

		if ( settings[ 'speed by menu' ] == true ) return;

		if ( this.keys.UP.isPressed || this.keys.W.isPressed )
			this.newSpeed += dt / this.duration;
		else
			this.newSpeed -= dt / this.duration;

		this.newSpeed = Math.min( 1, Math.max( this.newSpeed, 0 ) );

		if ( this.keys.LEFT.isPressed || this.keys.A.isPressed )
			this.character.rotation.y += dt * 2;
		else if ( this.keys.RIGHT.isPressed || this.keys.D.isPressed )
			this.character.rotation.y -= dt * 2;


		this.forward.set(
			this.character.matrixWorld.elements[ 8 ],
			this.character.matrixWorld.elements[ 9 ],
			this.character.matrixWorld.elements[ 10 ]
		);

		let finalSpeed = ( this.newSpeed > 0.5 ) ? this.newSpeed * this.runSpeed : ( this.newSpeed / 0.5 ) * this.walkSpeed;

		if( this.newSpeed == 0 ) {   //idle
			idleAction.setEffectiveWeight( 1 );    				
			walkAction.setEffectiveWeight( 0 );
			runAction.setEffectiveWeight( 0 );
		};

		if( this.newSpeed == 1 ) {   //max
			idleAction.setEffectiveWeight( 0 );    				
			walkAction.setEffectiveWeight( 0 );
			runAction.setEffectiveWeight( 1 );
		};

		document.getElementById("data").innerText = this.newSpeed;

		if( this.newSpeed > 0 && this.newSpeed <= 0.5 ) { // from idle to walk < - > from walk to idle
			idleAction.setEffectiveWeight( 1 - ( this.newSpeed / 0.5 ) );    				
			walkAction.setEffectiveWeight( this.newSpeed / 0.5  );
			runAction.setEffectiveWeight( 0 );
		};

		if( this.newSpeed > 0.5 && this.newSpeed < 1 ) {  // from walk to run < - > from run to walk
			idleAction.setEffectiveWeight( 0 );    				
			walkAction.setEffectiveWeight( 1 - ( ( this.newSpeed - 0.5 ) / 0.5 ) );
			runAction.setEffectiveWeight(( this.newSpeed - 0.5 ) / 0.5 );
		};

		this.lastSpeed = this.newSpeed;

		//this.character.setSpeed( newSpeed );    
		this.character.position.add( this.forward.multiplyScalar( finalSpeed ) );
	};

	onKeyDown( event ) {
		let scope = this;
		for ( var k in this.keys ) {
			if ( event.keyCode === scope.keys[ k ].code ) {
				scope.keys[ k ].isPressed = true; 
			};
		};
	};

	onKeyUp( event ) {
		let scope = this;
		for ( var k in this.keys ) {
			if ( event.keyCode === scope.keys[ k ].code ) {
				scope.keys[ k ].isPressed = false;
			};
		};
	};

	onDurationChange( event ) {
		this.duration = event.detail.duration;
	};

};