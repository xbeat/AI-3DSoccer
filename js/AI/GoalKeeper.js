/**
 * Desc:   class to implement a goalkeeper agent
 * 
 */

class GoalKeeper extends PlayerBase {

    //----------------------------- ctor ------------------------------------
    //-----------------------------------------------------------------------
    constructor( home_team,
                home_region,
                start_state,
                heading,
                velocity,
                mass,
                max_force,
                max_speed,
                max_turn_rate,
                scale,
                id ) {

        super( home_team,
                home_region,
                heading,
                velocity,
                mass,
                max_force,
                max_speed,
                max_turn_rate,
                scale,
                PlayerBase.player_role().goal_keeper );


        this.id = id;

        this.m_vLookAt = new Vector2D();

        //set up the state machine
        this.m_pStateMachine = new StateMachine( this );

        this.m_pStateMachine.SetCurrentState( start_state );
        this.m_pStateMachine.SetPreviousState( start_state );
        this.m_pStateMachine.SetGlobalState( GlobalKeeperState.Instance() );

        this.m_pStateMachine.CurrentState().Enter( this );
    };

    finalize() {
        super.finalize();
        this.m_pStateMachine = null;
    };

    //these must be implemented
    Update() {
        //run the logic for the current state
        this.m_pStateMachine.Update();

        //calculate the combined force from each steering behavior 
        this.SteeringForce = this.m_pSteering.Calculate();

        //Acceleration = Force/Mass
        this.Acceleration = Vector2D.div( this.SteeringForce, this.m_dMass );
        //update velocity
        this.m_vVelocity.add( this.Acceleration );

        //make sure player does not exceed maximum velocity
        this.m_vVelocity.Truncate( this.m_dMaxSpeed );

        //update the position
        this.m_vPosition.add( this.m_vVelocity );


        //enforce a non-penetration constraint if desired
        if ( Prm.bNonPenetrationConstraint ) {
            EnforceNonPenetrationContraint( this, Global.AllPlayers );
        };

        //update the heading if the player has a non zero velocity
        if ( !this.m_vVelocity.isZero() ) {
            this.m_vHeading = Vector2D.Vec2DNormalize( this.m_vVelocity );
            this.m_vSide = this.m_vHeading.Perp();
        };

        //look-at vector always points toward the ball
        if ( !this.Pitch().GoalKeeperHasBall() ) {
            this.m_vLookAt = Vector2D.Vec2DNormalize( Vector2D.sub( this.Ball().Pos(), this.Pos() ) );
        };
    };

    //--------------------------- Render -------------------------------------
    //
    //------------------------------------------------------------------------
    Render() {
        if ( this.Team().Color() == SoccerTeam.blue() ) {
            gdi.BluePen();
        } else {
            gdi.RedPen();
        };

        //render the player's body
        this.m_vecPlayerVBTrans = Transformation.WorldTransform( this.m_vecPlayerVB,
                this.Pos(),
                this.m_vLookAt,
                this.m_vLookAt.Perp(),
                this.Scale() );

        gdi.ClosedShape( this.m_vecPlayerVBTrans );

        //anf his head
        gdi.BrownBrush();
        gdi.Circle( this.Pos(), 6 );
        
        const playerPos = scene3D.convertRange( this.Pos() );
        scene3D.players[ this.id ].position.set( playerPos.x, 0, playerPos.y );

        //Ring glow & heatmap ( player selected )
        if ( this.id == scene3D.playerSelected ){
            scene3D.ring.position.set( playerPos.x, 0, playerPos.y );

        	//heatMap.addData( [this.m_vPosition.x, this.m_vPosition.y, 1] );
        	//heatMap.draw();

        };

        // Get two point from body to get angle of rotation
        let angleRotation = Math.atan2( this.m_vecPlayerVBTrans[2].y - this.m_vecPlayerVBTrans[1].y, 
                                        this.m_vecPlayerVBTrans[2].x - this.m_vecPlayerVBTrans[1].x );

        //Player Rotation
        if ( this.Team().Color() == SoccerTeam.blue() ) {
            scene3D.players[ this.id ].rotation.y = angleRotation * -1;
        } else {
            scene3D.players[ this.id ].rotation.y = angleRotation * -1;
        };

       	//find speed
		let speed = Math.sqrt( this.m_vVelocity.y * this.m_vVelocity.y  + this.m_vVelocity.x * this.m_vVelocity.x );

		//convert rvelocity range
		let speedMinFrom = 0;
		let speedMaxFrom = this.m_dMaxSpeed;

		let speedMinTo = 0 
		let speedMaxTO = 1;

		if ( speed != 0 ) {
			speed = Math.abs( ( speed - speedMinFrom ) * ( speedMaxTO - speedMinTo ) / ( speedMinFrom - speedMaxFrom ) + speedMinTo );
		};

		// animate player
		if( speed == 0 ) {  //idle
			scene3D.mixer[ this.id ].clipAction( 'idle' ).setEffectiveWeight( 1 );    				
			scene3D.mixer[ this.id ].clipAction( 'walk' ).setEffectiveWeight( 0 );
			scene3D.mixer[ this.id ].clipAction( 'run' ).setEffectiveWeight( 0 );
		};

		if( speed == 1 ) {  //run
			scene3D.mixer[ this.id ].clipAction( 'idle' ).setEffectiveWeight( 0 );    				
			scene3D.mixer[ this.id ].clipAction( 'walk' ).setEffectiveWeight( 0 );
			scene3D.mixer[ this.id ].clipAction( 'run' ).setEffectiveWeight( 1 );
		};

		if( speed > 0 && speed <= 0.5 ) { // from idle to walk < - > from walk to idle
			scene3D.mixer[ this.id ].clipAction( 'idle' ).setEffectiveWeight( 1 - ( speed / 0.5 ) );    				
			scene3D.mixer[ this.id ].clipAction( 'walk' ).setEffectiveWeight( speed / 0.5  );
			scene3D.mixer[ this.id ].clipAction( 'run' ).setEffectiveWeight( 0 );
		};

		if( speed > 0.5 && speed < 1 ) { // from walk to run < - > from run to walk
			scene3D.mixer[ this.id ].clipAction( 'idle' ).setEffectiveWeight( 0 );    				
			scene3D.mixer[ this.id ].clipAction( 'walk' ).setEffectiveWeight( 1 - ( ( speed - 0.5 ) / 0.5 ) );
			scene3D.mixer[ this.id ].clipAction( 'run' ).setEffectiveWeight( ( speed - 0.5 ) / 0.5 );
		};        

        //draw the ID
        if ( Prm.bIDs ) {
            gdi.TextColor( 250, 250, 250 );
            gdi.TextAtPos( this.Pos().x - 20, this.Pos().y - 25, ttos( this.ID() ) );
        };

        //draw the state
        if ( Prm.bStates ) {
			gdi.TextColor( 250, 250, 250 );
			gdi.TransparentText();
			gdi.TextAtPos( this.m_vPosition.x, this.m_vPosition.y - 25,
                    new String( this.m_pStateMachine.GetNameOfCurrentState() ) );
        };
    };

    /**
     * routes any messages appropriately
     */
    HandleMessage( msg ) {
        return this.m_pStateMachine.HandleMessage( msg );
    };

    /**
     * @return true if the ball comes close enough for the keeper to 
     *         consider intercepting
     */
    BallWithinRangeForIntercept() {
        return ( Vector2D.Vec2DDistanceSq( this.Team().HomeGoal().Center(), this.Ball().Pos() )
                <= Prm.GoalKeeperInterceptRangeSq );
    };

    /**
     * @return true if the keeper has ventured too far away from the goalmouth
     */
    TooFarFromGoalMouth() {
        return ( Vector2D.Vec2DDistanceSq( this.Pos(), this.GetRearInterposeTarget() )
                > Prm.GoalKeeperInterceptRangeSq );
    };

    /**
     * this method is called by the Intercept state to determine the spot
     * along the goalmouth which will act as one of the interpose targets
     * (the other is the ball).
     * the specific point at the goal line that the keeper is trying to cover
     * is flexible and can move depending on where the ball is on the field.
     * To achieve this we just scale the ball's y value by the ratio of the
     * goal width to playingfield width
     */
    GetRearInterposeTarget() {
        let xPosTarget = this.Team().HomeGoal().Center().x;

        let yPosTarget = this.Pitch().PlayingArea().Center().y
                - Prm.GoalWidth * 0.5 + ( this.Ball().Pos().y * Prm.GoalWidth )
                / this.Pitch().PlayingArea().Height();

        return new Vector2D( xPosTarget, yPosTarget );
    };

    GetFSM() {
        return this.m_pStateMachine;
    };

    LookAt() {
        return new Vector2D( this.m_vLookAt );
    };

    SetLookAt( v ) {
        this.m_vLookAt = new Vector2D( v );
    };
};