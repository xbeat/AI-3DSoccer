
class Scene3D{

	constructor(){

		this.idleAction = new Array();
		this.walkAction = new Array();
		this.runAction = new Array();
		this.idleWeight = new Array();
		this.walkWeight = new Array();
		this.runWeight = new Array();
		this.actions = new Array();
		this.maxPlayers = 18;
		this.CameraLookAt = new THREE.Vector3(0, 0, 0);
		this.followObject = false;
		
		this.scope = this;
		this.mixer = new Array();
		this.clock = new THREE.Clock();
		this.singleStepMode = false;
		this.sizeOfNextStep = 0;
		this.playerController = new Array();
		this.players = new Array();
		this.skeleton = new Array();
		this.playerSelected = 0;

		this.scene = new THREE.Scene();
		this.scene.add ( new THREE.AmbientLight( 0xffffff ) );

		this.lightOffset = new THREE.Vector3( 0, 1000, 1000.0 ); 
		this.light = new THREE.DirectionalLight( 0x888888, 1 );
		this.light.position.copy( this.lightOffset );
		this.light.castShadow = true;
		this.light.shadow.mapSize.width = 2048;
		this.light.shadow.mapSize.height = 2048;
		this.light.shadow.camera.near = 10;
		this.light.shadow.camera.far = 10000;
		this.light.shadow.bias = 0.00001;
		this.light.shadow.camera.right = 3200;
		this.light.shadow.camera.left = -3400;
		this.light.shadow.camera.top = 1500;
		this.light.shadow.camera.bottom = -2500;
		this.scene.add( this.light );

		//let helper = new THREE.CameraHelper( light.shadow.camera );
		//this.scene.add( helper );

		this.scene.add( this.light );
		
		this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		let aspect = window.innerWidth / window.innerHeight;
		//let radius = player.geometry.boundingSphere.radius;
		let radius = 60;

		this.camera = new THREE.PerspectiveCamera( 45, aspect, 1, 20000 );
		this.camera.position.set( 0.0, radius * 6, radius * 6.5 );

		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, radius, 0 );
		this.controls.enabled = true;
		//this.controls.enablePan = true;	
					
		//this.controlPanel = new ControlPanel( this );
		
		let skill = new Skill( this.controlPanel );

		let ctx = this.renderer.context;
		ctx.getShaderInfoLog = function () { return '' };

		document.body.appendChild( this.renderer.domElement );

		// ------------- load Player -------------
		//var url = '../lib/three.js-master/examples/models/skinned/marine/marine_anims_core.json';
		let url = 'models/player/Player.json';
		let scope = this;
		let player;

		new THREE.ObjectLoader().load( url, function ( loadedObject ) {
			loadedObject.traverse( function ( child ) {
				if ( child instanceof THREE.SkinnedMesh ) {
					player = child;
				};
				
			} );

			if ( player === undefined ) {
				alert( 'Unable to find a Player Model in this place:\n\n' + url + '\n\n' );
				return;
			};

			for ( let i = 0; i < scope.maxPlayers; i++ ){ 
				scope.addPlayer( i, player );
			};

		});
		
		//  ------------ Pitch ----------------			
		new THREE.ObjectLoader().load( "models/pitch/stadium.json", function( pitch ) {
			
			// Pitch Base look in the plus			
			//materials[0].side = THREE.DoubleSide;					
			//var ground =  new THREE.Mesh( geometry, materials[0] );
			//ground.scale.set( 20, 20, 20 );
			//ground.receiveShadow = true;
			//scope.scene.add( ground );

			pitch.position.set( -50, -30, -100 );
			pitch.scale.set( 800, 800, 800 );
			scope.scene.add( pitch );
			scope.pitch = pitch;

		});

		// --------- Create Sky Scene -----------
		let path = "models/skyscene/";
		let format = '.jpg';
		let urls = [
			path + 'px' + format, path + 'nx' + format,
			path + 'py' + format, path + 'ny' + format,
			path + 'pz' + format, path + 'nz' + format
		 ];

		let textureLoader = new THREE.CubeTextureLoader();
		let textureCube = textureLoader.load(urls);

		let shader = THREE.ShaderLib["cube"];
		shader.uniforms["tCube"].value = textureCube;

		// We're inside the box, so make sure to render the backsides
		// It will typically be rendered first in the scene and without depth so anything else will be drawn in front
		let material = new THREE.ShaderMaterial( {
			fragmentShader : shader.fragmentShader,
			vertexShader   : shader.vertexShader,
			uniforms       : shader.uniforms,
			depthWrite     : false,
			side           : THREE.BackSide
		} );

		// The box dimension size doesn't matter that much when the camera is in the center.  Experiment with the values.
		let skyMesh = new THREE.Mesh( new THREE.CubeGeometry( 7300, 7300, 7300, 1, 1, 1 ), material );
		//skyMesh.renderDepth = -10;
		skyMesh.position.set( 0, -500, 0)
		this.scene.add( skyMesh );
		
		// --------- Soccer Ball ----------		
     	let buffgeoSphere = new THREE.BufferGeometry();
        buffgeoSphere.fromGeometry( new THREE.SphereGeometry( 1, 20, 10 ) );
	    let ballTexture = new THREE.TextureLoader().load( 'models/ball/ball.png' );			        
        var ballMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffffff, 
            map: ballTexture
        });
        
        this.ball3D = new THREE.Mesh( buffgeoSphere, ballMaterial );
        
        this.ball3D.castShadow = true;
		//ball[i].receiveShadow = true;
		this.scene.add( this.ball3D );
		this.ball3D.scale.set( 6, 6, 6 );
		this.ball3D.position.set( 0, 5, 0 );


		//------------ Ring -------------
		let ringGeom = new THREE.RingGeometry( 30, 70, 32 );
		let ringMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000, transparent: true, opacity: 0.5 } );

		this.ring = new THREE.Mesh( ringGeom, ringMaterial );
		this.ring.name = 'ring';
		this.ring.position.set( 0, 1, 0 );
		this.ring.rotation.x = -0.5 * Math.PI;

		this.scene.add( this.ring );


	};

	// add player
	addPlayer( id, player ){

		let scope = this;

		// Add player and skeleton helper to scene
		this.players[ id ] = player.clone();
		
		player.traverse( function ( child ) {
			if ( child instanceof THREE.SkinnedMesh ) { 
				scope.players[ id ].material = child.material.clone(); 
			};
		} );
		
		this.skeleton[ id ] = new THREE.SkeletonHelper( this.players[ id ] );
		this.skeleton[ id ].visible = false;
		this.scene.add( this.skeleton[ id ] );

	    //player.rotation.y = Math.PI * -135;
		this.players[ id ].castShadow = true;

		//player.rotation.y = - 135 * Math.PI;
		//this.scene.add( player );

		this.scene.add( this.players[ id ] );

		// Create the control panel
		if ( id > ( this.maxPlayers / 2 ) - 1 && id < this.maxPlayers ){
		
			//https://stackoverflow.com/questions/11919694/how-to-clone-an-object3d-in-three-js
			this.players[ id ].material.map = new THREE.TextureLoader().load( 'models/player/BodyDressed_UnitedUniformRed.png' );
		
		};

		// Initialize mixer and clip actions
		this.mixer[ id ] = new THREE.AnimationMixer( this.players[ id ] );

		//this.idleAction[ id ] = this.mixer[ id ].clipAction( 'idle' );
		//this.walkAction[ id ] = this.mixer[ id ].clipAction( 'walk' );
		///this.runAction[ id ] = this.mixer[ id ].clipAction( 'run' );
		//this.actions[ id ] = [ this.idleAction[ id ], this.walkAction[ id ], this.runAction[ id ] ];

		//this.controlPanel.setPlayerId( id );
		//this.controlPanel.activateAllActions();
		
		this.mixer[ id ].clipAction( 'idle' ).play();
		this.mixer[ id ].clipAction( 'walk' ).play();
		this.mixer[ id ].clipAction( 'run' ).play();

		//this.playerController[ id ] = new PlayerController( this.players[ id ], this.actions[ id ], this.controlPanel );

		//window.addEventListener( 'keydown', this.playerController[ id ].onKeyDown.bind( this.playerController[ id ] ), false );
		//window.addEventListener( 'keyup', this.playerController[ id ].onKeyUp.bind( this.playerController[ id ] ), false );
		//window.addEventListener( 'change-duration', this.playerController[ id ].onDurationChange.bind( this.playerController[ id ] ), false );
		
		//wait until all is loaded
		//EXECUTERAF = true;

		//this.Render();

	};

	deepClone( initalObj, finalObj = {} ) {
		var obj = finalObj;
		for ( var i in initalObj ) {
		    var prop = initalObj[i];

		    if( prop === obj ) {
		        continue;
		    };

		    if ( typeof prop === 'object' ) {
		        if( prop.constructor === Array ) {
		            obj[ i ] = this.deepClone( prop, [] );
		        } else {
		            obj[ i ] = Object.create( prop );
		        };
		    } else {
		        obj[ i ] = prop;
		    };
		};
		return obj;
	};

	convertRange( value ) {
		//https://stackoverflow.com/questions/14224535/scaling-between-two-number-ranges
		//https://stats.stackexchange.com/questions/178626/how-to-normalize-data-between-1-and-1/332414#332414

		// Get the real pitch size
		const pitchSize = new THREE.Box3().setFromObject( this.pitch );
		//console.log( bbox );
		const pitchBorder = 1000;

		const rangeMinFrom = {
				x: 0,
				y: 0
			},

			rangeMaxFrom = {
				x: cxClient,
				y: cyClient
			},

			rangeMinTo = {
				x: pitchSize.min.x + pitchBorder,
				y: pitchSize.min.z + pitchBorder
			},

			rangeMaxTo = {
				x: pitchSize.max.x - pitchBorder,
				y: pitchSize.max.z - pitchBorder
			};

    	return {
    		x: ( value.x - rangeMinFrom.x ) * ( rangeMaxTo.x - rangeMinTo.x ) / ( rangeMaxFrom.x - rangeMinFrom.x ) + rangeMinTo.x,
    		y: ( value.y - rangeMinFrom.y ) * ( rangeMaxTo.y - rangeMinTo.y ) / ( rangeMaxFrom.y - rangeMinFrom.y ) + rangeMinTo.y
    	};
	
	};

	getAngle( position, velocity ){
		let angle = Math.atan2( position.y - velocity.y, position.x - velocity.x );
   		//if ( angle < 0 ) angle += 2 * Math.PI;
    	return angle;
	};

	// render
 	Render() {

		// Render loop
		//RAF = requestAnimationFrame( function() { scope.render(); } );

		//for ( let i = 0; i < this.maxPlayers; i++ ){ 
		
		//	this.idleWeight[ i ] = this.idleAction[ i ].getEffectiveWeight();
		//	this.walkWeight[ i ] = this.walkAction[ i ].getEffectiveWeight();
		//	this.runWeight[ i ] = this.runAction[ i ].getEffectiveWeight();
		
		//};

		// Update the panel values if weights are modified from "outside" (by crossfadings)
		//this.controlPanel.updateWeightSliders();

		// Enable/disable crossfade controls according to current weight values
		//this.controlPanel.updateCrossFadeControls();

		// Get the time elapsed since the last frame, used for mixer update (if not in single step mode)
		let mixerUpdateDelta = this.clock.getDelta();

		// If in single step mode, make one step and then do nothing (until the user clicks again)
		//if ( this.singleStepMode ) {
		//	mixerUpdateDelta = this.sizeOfNextStep;
		//	this.sizeOfNextStep = 0;
		//};

		// Update the animation mixer, and render this frame
		for ( let i = 0; i < this.maxPlayers; i++ ){ 
			this.mixer[ i ].update( mixerUpdateDelta );
		};

		//updateCamera();
		
		// update character position
	    //let scale = 1; //gui.getTimeScale();		        
	    //let delta = 0.033; //clock.getDelta();
	    //let stepSize = delta * scale;

		//console.log(`delta ${delta} scale ${scale} stepsize ${stepSize}`);
		
		//for ( let i = 0; i < this.players.length; i++ ){ 
	    
	    //	this.playerController[ i ].update( stepSize, scale );
		
		//};

		this.camera.getWorldDirection( this.CameraLookAt );
		
		if ( this.followObject ){
			this.camera.lookAt( this.ball3D.position );
        } else {
			//this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
			//this.camera.lookAt( this.CameraLookAt );
        };


	    //gui.setSpeed( blendMesh.speed );

	    //THREE.AnimationHandler.update( stepSize );
	    //blendMesh.updateSkeletonHelper();		
		this.renderer.render( this.scene, this.camera );

	};

	// update camera 
	updateCamera(){
	    this.controls.target.copy( this.player.position );
	    this.controls.target.y += this.player.geometry.boundingSphere.radius * 2;
	    this.controls.update();

	    let camOffset = this.camera.position.clone().sub( this.controls.target );
	    camOffset.normalize().multiplyScalar( 750 );
	    this.camera.position.copy( this.controls.target.clone().add( camOffset ) );	

	};

};
