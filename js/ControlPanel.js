// Controls
let crossFadeControls = [];
let idleAction, walkAction, runAction;
let idleWeight, walkWeight, runWeight;
let actions;
let settings;

function createPanel() {

	let panel = new dat.GUI( { width: 310 } );

	let folder1 = panel.addFolder( 'Visibility' );
	let folder2 = panel.addFolder( 'Activation/Deactivation' );
	let folder3 = panel.addFolder( 'Pausing/Stepping' );
	let folder4 = panel.addFolder( 'Crossfading' );
	let folder5 = panel.addFolder( 'Blend Weights' );
	let folder6 = panel.addFolder( 'General Speed' );

	settings = {
		'show model':            true,
		'show skeleton':         false,
		'use controls':          false,
		'speed by menu':         false,
		'deactivate all':        deactivateAllActions,
		'activate all':          activateAllActions,
		'pause/continue':        pauseContinue,
		'make single step':      toSingleStepMode,
		'modify step size':      0.05,
		'from walk to idle':     function () { prepareCrossFade( walkAction, idleAction, 1.0 ) },
		'from idle to walk':     function () { prepareCrossFade( idleAction, walkAction, 0.5 ) },
		'from walk to run':      function () { prepareCrossFade( walkAction, runAction, 2.5 ) },
		'from run to walk':      function () { prepareCrossFade( runAction, walkAction, 5.0 ) },
		'use default duration':  true,
		'set custom duration':   3.5,
		'modify idle weight':    0.0,
		'modify walk weight':    1.0,
		'modify run weight':     0.0,
		'modify time scale':     1.0
	};

	folder1.add( settings, 'show model' ).onChange( showModel );
	folder1.add( settings, 'show skeleton' ).onChange( showSkeleton );
	folder1.add( settings, 'use controls' ).onChange( useControls );
	folder1.add( settings, 'speed by menu' );
	folder2.add( settings, 'deactivate all' );
	folder2.add( settings, 'activate all' );
	folder3.add( settings, 'pause/continue' );
	folder3.add( settings, 'make single step' );
	folder3.add( settings, 'modify step size', 0.01, 0.1, 0.001 );
	crossFadeControls.push( folder4.add( settings, 'from walk to idle' ) );
	crossFadeControls.push( folder4.add( settings, 'from idle to walk' ) );
	crossFadeControls.push( folder4.add( settings, 'from walk to run' ) );
	crossFadeControls.push( folder4.add( settings, 'from run to walk' ) );
	folder4.add( settings, 'use default duration' );
	folder4.add( settings, 'set custom duration', 0, 10, 0.01 );
	folder5.add( settings, 'modify idle weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) { setWeight( idleAction, weight ) } );
	folder5.add( settings, 'modify walk weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) { setWeight( walkAction, weight ) } );
	folder5.add( settings, 'modify run weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) { setWeight( runAction, weight ) } );
	folder6.add( settings, 'modify time scale', 0.0, 1.5, 0.01 ).onChange( modifyTimeScale );

	folder1.open();
	folder2.open();
	folder3.open();
	folder4.open();
	folder5.open();
	folder6.open();

	crossFadeControls.forEach( function ( control ) {

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
}

function showModel( visibility ) {
	soccer3D.mesh.visible = visibility;
}

function showSkeleton( visibility ) {
	soccer3D.skeleton.visible = visibility;
}

function useControls( useControls ) {
	soccer3D.controls.enabled = useControls;
}

function modifyTimeScale( speed ) {
	soccer3D.mixer.timeScale = speed;
}

function deactivateAllActions() {
	actions.forEach( function ( action ) {
		action.stop();
	} );
}


function activateAllActions() {
	setWeight( idleAction, settings[ 'modify idle weight' ] );
	setWeight( walkAction, settings[ 'modify walk weight' ] );
	setWeight( runAction, settings[ 'modify run weight' ] );

	actions.forEach( function ( action ) {
		action.play();
	} );
}

function pauseContinue() {
	if ( soccer3D.singleStepMode ) {
		soccer3D.singleStepMode = false;
		unPauseAllActions();
	} else {
		if ( idleAction.paused ) {
			unPauseAllActions();
		} else {
			pauseAllActions();
		};
	};
};

function pauseAllActions() {
	actions.forEach( function ( action ) {
		action.paused = true;
	} );
};

function unPauseAllActions() {
	actions.forEach( function ( action ) {
		action.paused = false;
	} );
};

function toSingleStepMode() {
	unPauseAllActions();
	soccer3D.singleStepMode = true;
	sizeOfNextStep = settings[ 'modify step size' ];
};

function prepareCrossFade( startAction, endAction, defaultDuration ) {
	// Switch default / custom crossfade duration (according to the user's choice)
	var duration = setCrossFadeDuration( defaultDuration );
	// Make sure that we don't go on in singleStepMode, and that all actions are unpaused
	soccer3D.singleStepMode = false;
	unPauseAllActions();

	// If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
	// else wait until the current action has finished its current loop
	if ( startAction === idleAction ) {
		executeCrossFade( startAction, endAction, duration );
	} else {
		synchronizeCrossFade( startAction, endAction, duration );
	};
};

function setCrossFadeDuration( defaultDuration ) {
	// Switch default crossfade duration <-> custom crossfade duration
	if ( settings[ 'use default duration' ] ) {
		return defaultDuration;
	} else {
		return settings[ 'set custom duration' ];
	};
};

function synchronizeCrossFade( startAction, endAction, duration ) {
	soccer3D.mixer.addEventListener( 'loop', onLoopFinished );
	function onLoopFinished( event ) {
		if ( event.action === startAction ) {
			soccer3D.mixer.removeEventListener( 'loop', onLoopFinished );
			executeCrossFade( startAction, endAction, duration );
		};
	};
};

function executeCrossFade( startAction, endAction, duration ) {
	// Not only the start action, but also the end action must get a weight of 1 before fading
	// (concerning the start action this is already guaranteed in this place)
	setWeight( endAction, 1 );
	endAction.time = 0;
	// Crossfade with warping - you can also try without warping by setting the third parameter to false
	startAction.crossFadeTo( endAction, duration, true );
};

// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
// the start action's timeScale to ((start animation's duration) / (end animation's duration))
function setWeight( action, weight ) {
	action.enabled = true;
	action.setEffectiveTimeScale( 1 );
	action.setEffectiveWeight( weight );
};

// Called by the render loop
function updateWeightSliders() {
	settings[ 'modify idle weight' ] = idleWeight;
	settings[ 'modify walk weight' ] = walkWeight;
	settings[ 'modify run weight' ] = runWeight;
};

// Called by the render loop
function updateCrossFadeControls() {
	crossFadeControls.forEach( function ( control ) {
		control.setDisabled();
	} );

	if ( idleWeight === 1 && walkWeight === 0 && runWeight === 0 ) {
		crossFadeControls[ 1 ].setEnabled();
	};

	if ( idleWeight === 0 && walkWeight === 1 && runWeight === 0 ) {
		crossFadeControls[ 0 ].setEnabled();
		crossFadeControls[ 2 ].setEnabled();
	};

	if ( idleWeight === 0 && walkWeight === 0 && runWeight === 1 ) {
		crossFadeControls[ 3 ].setEnabled();
	};
};