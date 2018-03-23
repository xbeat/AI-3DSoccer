// Controls

class ControlPanel {

	constructor( scene3D ){

		this.crossFadeControls = new Array;
		this.settings = new Object;
		this.scene3D = scene3D;
		this.playerId;
		let scope = this;

		let panel = new dat.GUI( { width: 310 } );
		panel.closed = true;

		let folder1 = panel.addFolder( 'Visibility' );
		let folder2 = panel.addFolder( 'Activation/Deactivation' );
		let folder3 = panel.addFolder( 'Pausing/Stepping' );
		let folder4 = panel.addFolder( 'Crossfading' );
		let folder5 = panel.addFolder( 'Blend Weights' );
		let folder6 = panel.addFolder( 'General Speed' );

		this.settings = {
			'show model':            true,
			'show skeleton':         false,
			'use controls':          true,
			'speed by menu':         false,
			'stop animation':        false,
			'deactivate all':        this.deactivateAllActions.bind( this ),
			'activate all':          this.activateAllActions.bind( this ),
			'pause/continue':        this.pauseContinue.bind( this ),
			'make single step':      this.toSingleStepMode.bind( this ),
			'modify step size':      0.05,
			'from walk to idle':     function () { scope.prepareCrossFade( scope.scene3D.walkAction[ scope.playerId ], scope.scene3D.idleAction[ scope.playerId ], 1.0 ) },
			'from idle to walk':     function () { scope.prepareCrossFade( scope.scene3D.idleAction[ scope.playerId ], scope.scene3D.walkAction[ scope.playerId ], 0.5 ) },
			'from walk to run':      function () { scope.prepareCrossFade( scope.scene3D.walkAction[ scope.playerId ], scope.scene3D.runAction[ scope.playerId ], 2.5 ) },
			'from run to walk':      function () { scope.prepareCrossFade( scope.scene3D.runAction[ scope.playerId ], scope.scene3D.walkAction[ scope.playerId ], 5.0 ) },
			'use default duration':  true,
			'set custom duration':   3.5,
			'modify idle weight':    0.0,
			'modify walk weight':    1.0,
			'modify run weight':     0.0,
			'modify time scale':     1.0
		};

		folder1.add( this.settings, 'show model' ).onChange( this.showModel.bind( this ) );
		folder1.add( this.settings, 'show skeleton' ).onChange( this.showSkeleton.bind( this ) );
		folder1.add( this.settings, 'use controls' ).onChange( this.useControls.bind( this ) );
		folder1.add( this.settings, 'speed by menu' );
		folder1.add( this.settings, 'stop animation' );
		folder2.add( this.settings, 'deactivate all' );
		folder2.add( this.settings, 'activate all' );
		folder3.add( this.settings, 'pause/continue' );
		folder3.add( this.settings, 'make single step' );
		folder3.add( this.settings, 'modify step size', 0.01, 0.1, 0.001 );
		this.crossFadeControls.push( folder4.add( this.settings, 'from walk to idle' ) );
		this.crossFadeControls.push( folder4.add( this.settings, 'from idle to walk' ) );
		this.crossFadeControls.push( folder4.add( this.settings, 'from walk to run' ) );
		this.crossFadeControls.push( folder4.add( this.settings, 'from run to walk' ) );
		folder4.add( this.settings, 'use default duration' );
		folder4.add( this.settings, 'set custom duration', 0, 10, 0.01 );
		folder5.add( this.settings, 'modify idle weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) { scope.setWeight( scope.scene3D.idleAction[ scope.playerId ], weight ) } );
		folder5.add( this.settings, 'modify walk weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) { scope.setWeight( scope.scene3D.walkAction[ scope.playerId ], weight ) } );
		folder5.add( this.settings, 'modify run weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) { scope.setWeight( scope.scene3D.runAction[ scope.playerId ], weight ) } );
		folder6.add( this.settings, 'modify time scale', 0.0, 1.5, 0.01 ).onChange( this.modifyTimeScale.bind( this ) );

		folder1.open();
		folder2.open();
		folder3.open();
		folder4.open();
		folder5.open();
		folder6.open();

		this.crossFadeControls.forEach( function ( control ) {

			control.classList1 = control.domElement.parentElement.parentElement.classList;
			control.classList2 = control.domElement.previousElementSibling.classList;

			control.setDisabled = function () {

				control.classList1.add( 'no-pointer-events' );
				control.classList2.add( 'control-disabled' );

			};

			control.setEnabled = function () {

				control.classList1.remove( 'no-pointer-events' );
				control.classList2.remove( 'control-disabled' );

			};

		} );
	};

	setPlayerId( id ){
		this.playerId = id;
	};

	showModel( visibility ) {
		this.scene3D.players[ this.playerId ].visible = visibility;
	};

	showSkeleton( visibility ) {
		this.scene3D.skeleton[ this.playerId ].visible = visibility;
	};

	useControls( useControls ) {
		this.scene3D.controls.enabled = useControls;
	};

	modifyTimeScale( speed ) {
		this.scene3D.mixer[ this.playerId ].timeScale = speed;
	};

	deactivateAllActions() {
		this.scene3D.actions[ this.playerId ].forEach( function ( action ) {
			action.stop();
		} );
	};

	activateAllActions() {
		this.setWeight( this.scene3D.idleAction[ this.playerId ], this.settings[ 'modify idle weight' ] );
		this.setWeight( this.scene3D.walkAction[ this.playerId ], this.settings[ 'modify walk weight' ] );
		this.setWeight( this.scene3D.runAction[ this.playerId ], this.settings[ 'modify run weight' ] );

		this.scene3D.actions[ this.playerId ].forEach( function ( action ) {
			action.play();
		} );
	};

	pauseContinue() {
		if ( this.scene3D.singleStepMode ) {
			this.scene3D.singleStepMode = false;
			this.unPauseAllActions();
		} else {
			if ( this.scene3D.idleAction[ this.playerId ].paused ) {
				this.unPauseAllActions();
			} else {
				this.pauseAllActions();
			};
		};
	};

	pauseAllActions() {
		this.scene3D.actions[ this.playerId ].forEach( function ( action ) {
			action.paused = true;
		} );
	};

	unPauseAllActions() {
		this.scene3D.actions[ this.playerId ].forEach( function ( action ) {
			action.paused = false;
		} );
	};

	toSingleStepMode() {
		this.unPauseAllActions();
		this.scene3D.singleStepMode = true;
		this.scene3D.sizeOfNextStep = this.settings[ 'modify step size' ];
	};

	prepareCrossFade( startAction, endAction, defaultDuration ) {
		// Switch default / custom crossfade duration (according to the user's choice)
		let duration = this.setCrossFadeDuration( defaultDuration );
		// Make sure that we don't go on in singleStepMode, and that all actions are unpaused
		this.scene3D.singleStepMode = false;
		this.unPauseAllActions();

		// If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
		// else wait until the current action has finished its current loop
		if ( startAction === this.scene3D.idleAction[ this.playerId ] ) {
			this.executeCrossFade( startAction, endAction, duration );
		} else {
			this.synchronizeCrossFade( startAction, endAction, duration );
		};
	};

	setCrossFadeDuration( defaultDuration ) {
		// Switch default crossfade duration <-> custom crossfade duration
		if ( this.settings[ 'use default duration' ] ) {
			return defaultDuration;
		} else {
			return this.settings[ 'set custom duration' ];
		};
	};

	synchronizeCrossFade( startAction, endAction, duration ) {
		let scope = this;
		scope.scene3D.mixer[ this.playerId ].addEventListener( 'loop', onLoopFinished );
		function onLoopFinished( event ) {
			if ( event.action === startAction ) {
				scope.scene3D.mixer[ scope.playerId ].removeEventListener( 'loop', onLoopFinished );
				scope.executeCrossFade( startAction, endAction, duration );
			};
		};
	};

	executeCrossFade( startAction, endAction, duration ) {
		// Not only the start action, but also the end action must get a weight of 1 before fading
		// (concerning the start action this is already guaranteed in this place)
		this.setWeight( endAction, 1 );
		endAction.time = 0;
		// Crossfade with warping - you can also try without warping by setting the third parameter to false
		startAction.crossFadeTo( endAction, duration, true );
	};

	// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
	// the start action's timeScale to ((start animation's duration) / (end animation's duration))
	setWeight( action, weight ) {
		action.enabled = true;
		action.setEffectiveTimeScale( 1 );
		action.setEffectiveWeight( weight );
	};

	// Called by the render loop
	updateWeightSliders() {
		this.settings[ 'modify idle weight' ] = this.scene3D.idleWeight[ this.playerId ];
		this.settings[ 'modify walk weight' ] = this.scene3D.walkWeight[ this.playerId ];
		this.settings[ 'modify run weight' ] = this.scene3D.runWeight[ this.playerId ];
	};

	// Called by the render loop
	updateCrossFadeControls() {
		this.crossFadeControls.forEach( function ( control ) {
			control.setDisabled();
		} );

		if ( this.scene3D.idleWeight[ this.playerId ] === 1 && this.scene3D.walkWeight[ this.playerId ] === 0 && this.scene3D.runWeight[ this.playerId ] === 0 ) {
			this.crossFadeControls[ 1 ].setEnabled();
		};

		if ( this.scene3D.idleWeight[ this.playerId ] === 0 && this.scene3D.walkWeight[ this.playerId ] === 1 && this.scene3D.runWeight[ this.playerId ] === 0 ) {
			this.crossFadeControls[ 0 ].setEnabled();
			this.crossFadeControls[ 2 ].setEnabled();
		};

		if ( this.scene3D.idleWeight[ this.playerId ] === 0 && this.scene3D.walkWeight[ this.playerId ] === 0 && this.scene3D.runWeight[ this.playerId ] === 1 ) {
			this.crossFadeControls[ 3 ].setEnabled();
		};
	};
};