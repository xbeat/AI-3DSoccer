/**
 * Scene3d.js
 * Class to manage 3D
 */

class Scene3D{

	constructor(){
		
		this.scope = this;
		this.scene = null;
		this.camera = null;
		this.controls = null; 
		this.renderer = null;
		this.player = null;
		this.skeleton = null;
		this.mixer = null;
		this.clock = new THREE.Clock();
		this.singleStepMode = false;
		this.sizeOfNextStep = 0;
		this.characterController = null;

		this.scene = new THREE.Scene();
		this.scene.add ( new THREE.AmbientLight( 0xffffff ) );

		let lightOffset = new THREE.Vector3( 0, 1000, 1000.0 );	
		let light = new THREE.DirectionalLight( 0x666666, 1.5 );
		light.position.copy( lightOffset );
		light.castShadow = true;
		light.shadow.mapSize.width = 4096;
		light.shadow.mapSize.height = 2048;
		light.shadow.camera.near = 10;
		light.shadow.camera.far = 10000;
		light.shadow.bias = 0.00001;
		light.shadow.camera.right = 4000;
		light.shadow.camera.left = -4000;
		light.shadow.camera.top = 4000;
		light.shadow.camera.bottom = -4000;

		let helper = new THREE.CameraHelper( light.shadow.camera );

		this.scene.add( light );
		this.scene.add( helper );

		this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		this.renderer.setClearColor( "#dddddd", 1 );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.autoClear = false;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
					
		let ctx = this.renderer.context;
		ctx.getShaderInfoLog = function () { return '' };

		let container = document.getElementById( 'container' );
		container.appendChild( this.renderer.domElement );

		// load mesh
		//var url = '../lib/three.js-master/examples/models/skinned/marine/marine_anims_core.json';
		let url = 'models/player/Player.json';
		let scope = this;
		new THREE.ObjectLoader().load( url, function ( loadedObject ) {
			loadedObject.traverse( function ( child ) {
				if ( child instanceof THREE.SkinnedMesh ) {
					scope.player = child;
				}
			} );

			if ( scope.player === undefined ) {
				alert( 'Unable to find a Player Model in this place:\n\n' + url + '\n\n' );
				return;
			};

			//for ( let i = 0; i < 22; i++){ 
				scope.addPlayer();
			//};

		});
		
		//  ------- Pitch ---------
			
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

		// Create Sky Scene
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
		let skyMesh = new THREE.Mesh( new THREE.CubeGeometry( 10000, 10000, 10000, 1, 1, 1 ), material );
		skyMesh.renderDepth = -10;
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

		this.addVirtualJoystick();     

	};

	// add player
	addPlayer(){
		// Add player and skeleton helper to scene
		//player.rotation.y = - 135 * Math.PI;
		this.scene.add( this.player );

		this.skeleton = new THREE.SkeletonHelper( this.player );
		this.skeleton.visible = false;
		this.scene.add( this.skeleton );

	    //player.rotation.y = Math.PI * -135;
		this.player.castShadow = true;

		this.scene.add( this.player );

		let aspect = window.innerWidth / window.innerHeight;
		let radius = this.player.geometry.boundingSphere.radius;

		this.camera = new THREE.PerspectiveCamera( 45, aspect, 1, 20000 );
		this.camera.position.set( 0.0, radius * 3, radius * 3.5 );

		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, radius, 0 );
		this.controls.enabled = false;
		//controls.enablePan = true;

		// Create the control panel
		createPanel();

		// Initialize mixer and clip actions
		this.mixer = new THREE.AnimationMixer( this.player );

		idleAction = this.mixer.clipAction( 'idle' );
		walkAction = this.mixer.clipAction( 'walk' );
		runAction = this.mixer.clipAction( 'run' );
		actions = [ idleAction, walkAction, runAction ];

		activateAllActions();
		this.characterController = new CharacterController( this.player );

		window.addEventListener( 'keydown', this.characterController.onKeyDown.bind( this.characterController ), false );
		window.addEventListener( 'keyup', this.characterController.onKeyUp.bind( this.characterController ), false );
		window.addEventListener( 'change-duration', this.characterController.onDurationChange.bind( this.characterController ), false );

		//wait until all is loaded
		EXECUTERAF = true;

		//this.Render();

	};

    addVirtualJoystick(){
		this.joystick1 = new Joystick( document.body, 120, { id: 'joystick1' } );
		this.joystick2 = new Joystick( document.body, 120, { id: 'joystick2' } );
		this.button1 = new Button( document.body, 70, { id: "button1", label: "button1" } );
		this.button2 = new Button( document.body, 70, { id: "button2", label: "button2" } );
		this.button3 = new SquareButton( document.body, 70, { id: "button3", label: "button3" } );

		this.xSpeed = 0.01;
		this.ySpeed = 0.01;
		this.zoomFactor = 0.01;

		this.button1.addEventListener( "press", function() {
		    console.log("button1");
		});

		this.button2.addEventListener( "press", function() {
		    console.log("button2");
		});

		this.button3.addEventListener( "press", function() {
		    console.log("button3");
		});
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
		            obj[i] = deepClone( prop, [] );
		        } else {
		            obj[i] = Object.create( prop );
		        };
		    } else {
		        obj[i] = prop;
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

	// render
 	Render() {

		// Render loop
		//RAF = requestAnimationFrame( function() { scope.render(); } );

		idleWeight = idleAction.getEffectiveWeight();
		walkWeight = walkAction.getEffectiveWeight();
		runWeight = runAction.getEffectiveWeight();

		// Update the panel values if weights are modified from "outside" (by crossfadings)
		updateWeightSliders();

		// Enable/disable crossfade controls according to current weight values
		updateCrossFadeControls();

		// Get the time elapsed since the last frame, used for mixer update (if not in single step mode)
		let mixerUpdateDelta = this.clock.getDelta();

		// If in single step mode, make one step and then do nothing (until the user clicks again)
		if ( this.singleStepMode ) {
			mixerUpdateDelta = sizeOfNextStep;
			sizeOfNextStep = 0;
		};

		// Update the animation mixer, and render this frame
		this.mixer.update( mixerUpdateDelta );
		
		//updateCamera();
		
		// update character position
	    let scale = 1; //gui.getTimeScale();		        
	    let delta = 0.033; //clock.getDelta();
	    let stepSize = delta * scale;

		//console.log(`delta ${delta} scale ${scale} stepsize ${stepSize}`);

	    this.characterController.update( stepSize, scale );
	    //gui.setSpeed( blendMesh.speed );

	    //THREE.AnimationHandler.update( stepSize );
	    //blendMesh.updateSkeletonHelper();		
		this.renderer.render( this.scene, this.camera );



		if ( this.joystick1.isActive == true ){

		    let characterFrontAngle = this.joystick1.getAngle() + THREE.Math.degToRad( -90 );
		    let cameraFrontAngle = 10;
		    let direction = THREE.Math.degToRad( 360 ) - cameraFrontAngle + characterFrontAngle;

		    /*
		    if ( Math.sign( this.position.y ) == 1 )  {
		        neck.rotation.y += degInRad(1);
		    } else if ( Math.sign( this.position.y ) == -1 ) {
		        neck.rotation.y -= degInRad(1);
		    };

		    if ( Math.sign( this.position.x ) == 1 ) {
		        neck.rotation.x += degInRad(1);
		    } else if ( Math.sign( this.position.x ) == -1 ) {
		        neck.rotation.x -= degInRad(1);
		    };
		    */

		    if ( Math.sign( this.joystick1.position.y ) == 1 || Math.sign( this.joystick1.position.x ) == 1 )  {
		        this.camera.zoom += this.zoomFactor;
		        this.camera.updateProjectionMatrix();
		    } else if ( Math.sign( this.joystick1.position.y ) == -1 || Math.sign( this.joystick1.position.x ) == -1 ) {
		        this.camera.zoom -= this.zoomFactor;
		        this.camera.updateProjectionMatrix();
		    };

		};

		if ( this.joystick2.isActive == true ){
			//let xt = this.joystick2.position.x ;
			//let xy = this.joystick2.position.y * .5;
			//this.cube.rotation.x += this.xSpeed;
			//this.cube.rotation.y += this.ySpeed;
		};

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
