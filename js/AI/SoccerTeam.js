/**
 *  Desc:   class to define a team of soccer playing agents. A SoccerTeam
 *          contains several field players and one goalkeeper. A SoccerTeam
 *          is implemented as a finite state machine and has states for
 *          attacking, defending, and KickOff.
 * 
 */

class SoccerTeam {

    /**
     * creates all the players for this team
     */
    CreatePlayers() {
        if ( this.Color() == this.blue ) {
            //goalkeeper
            this.m_Players.push( new GoalKeeper( this,
                    1,
                    TendGoal.Instance(),
                    new Vector2D( 0, 1 ),
                    new Vector2D( 0.0, 0.0 ),
                    Prm.PlayerMass,
                    Prm.PlayerMaxForce,
                    Prm.PlayerMaxSpeedWithoutBall,
                    Prm.PlayerMaxTurnRate,
                    Prm.PlayerScale ) );

            //create the players
            this.m_Players.push( new FieldPlayer( this,
                    6,
                    Wait.Instance(),
                    new Vector2D( 0, 1 ),
                    new Vector2D( 0.0, 0.0 ),
                    Prm.PlayerMass,
                    Prm.PlayerMaxForce,
                    Prm.PlayerMaxSpeedWithoutBall,
                    Prm.PlayerMaxTurnRate,
                    Prm.PlayerScale,
                    PlayerBase.player_role().attacker ) );


            this.m_Players.push( new FieldPlayer( this,
                    8,
                    Wait.Instance(),
                    new Vector2D( 0, 1 ),
                    new Vector2D( 0.0, 0.0 ),
                    Prm.PlayerMass,
                    Prm.PlayerMaxForce,
                    Prm.PlayerMaxSpeedWithoutBall,
                    Prm.PlayerMaxTurnRate,
                    Prm.PlayerScale,
                    PlayerBase.player_role().attacker ) );


            this.m_Players.push( new FieldPlayer( this,
                    3,
                    Wait.Instance(),
                    new Vector2D( 0, 1 ),
                    new Vector2D( 0.0, 0.0 ),
                    Prm.PlayerMass,
                    Prm.PlayerMaxForce,
                    Prm.PlayerMaxSpeedWithoutBall,
                    Prm.PlayerMaxTurnRate,
                    Prm.PlayerScale,
                    PlayerBase.player_role().defender ) );


            this.m_Players.push( new FieldPlayer( this,
                    5,
                    Wait.Instance(),
                    new Vector2D( 0, 1 ),
                    new Vector2D( 0.0, 0.0 ),
                    Prm.PlayerMass,
                    Prm.PlayerMaxForce,
                    Prm.PlayerMaxSpeedWithoutBall,
                    Prm.PlayerMaxTurnRate,
                    Prm.PlayerScale,
                    PlayerBase.player_role().defender ) );

        } else {
            //goalkeeper
           this.m_Players.push( new GoalKeeper( this,
                    16,
                    TendGoal.Instance(),
                    new Vector2D( 0, -1 ),
                    new Vector2D( 0.0, 0.0 ),
                    Prm.PlayerMass,
                    Prm.PlayerMaxForce,
                    Prm.PlayerMaxSpeedWithoutBall,
                    Prm.PlayerMaxTurnRate,
                    Prm.PlayerScale ) );


            //create the players
            this.m_Players.push( new FieldPlayer( this,
                    9,
                    Wait.Instance(),
                    new Vector2D( 0, -1 ),
                    new Vector2D( 0.0, 0.0 ),
                    Prm.PlayerMass,
                    Prm.PlayerMaxForce,
                    Prm.PlayerMaxSpeedWithoutBall,
                    Prm.PlayerMaxTurnRate,
                    Prm.PlayerScale,
                    PlayerBase.player_role().attacker ) );

            this.m_Players.push( new FieldPlayer( this,
                    11,
                    Wait.Instance(),
                    new Vector2D( 0, -1 ),
                    new Vector2D( 0.0, 0.0 ),
                    Prm.PlayerMass,
                    Prm.PlayerMaxForce,
                    Prm.PlayerMaxSpeedWithoutBall,
                    Prm.PlayerMaxTurnRate,
                    Prm.PlayerScale,
                    PlayerBase.player_role().attacker ) );


            this.m_Players.push( new FieldPlayer( this,
                    12,
                    Wait.Instance(),
                    new Vector2D( 0, -1 ),
                    new Vector2D( 0.0, 0.0 ),
                    Prm.PlayerMass,
                    Prm.PlayerMaxForce,
                    Prm.PlayerMaxSpeedWithoutBall,
                    Prm.PlayerMaxTurnRate,
                    Prm.PlayerScale,
                    PlayerBase.player_role().defender ) );


            this.m_Players.push( new FieldPlayer( this,
                    14,
                    Wait.Instance(),
                    new Vector2D( 0, -1 ),
                    new Vector2D( 0.0, 0.0 ),
                    Prm.PlayerMass,
                    Prm.PlayerMaxForce,
                    Prm.PlayerMaxSpeedWithoutBall,
                    Prm.PlayerMaxTurnRate,
                    Prm.PlayerScale,
                    PlayerBase.player_role().defender ) );

        };

        //register the players with the entity manager
        //let it = m_Players.listIterator();
        //while ( it.hasNext() ) {
        //    EntityMgr.RegisterEntity( it.next() );
        //};
        for( let it = 0, size = this.m_Players.length; it < size; it++ ){
           EntityMgr.RegisterEntity( this.m_Players[ it ] );
           Global.AllPlayers.push( this.m_Players[ it ] );
        };

    };

    /**
     * called each frame. Sets m_pClosestPlayerToBall to point to the player
     * closest to the ball. 
     */
    CalculateClosestPlayerToBall() {
        let ClosestSoFar = MaxFloat;

        //let it = this.m_Players.listIterator();

        //while ( it.hasNext() ) {
        //    let cur = it.next();
            //calculate the dist. Use the squared value to avoid sqrt
        //    let dist = Vec2DDistanceSq( cur.Pos(), Pitch().Ball().Pos() );

            //keep a record of this value for each player
        //    cur.SetDistSqToBall( dist );

        //    if ( dist < ClosestSoFar ) {
        //        ClosestSoFar = dist;

        //        this.m_pPlayerClosestToBall = cur;
        //    };
        //};


        for( let it = 0, size = this.m_Players.length; it < size; it++ ){

            let cur = this.m_Players[ it ];
            //calculate the dist. Use the squared value to avoid sqrt
            let dist = Vector2D.Vec2DDistanceSq( cur.Pos(), this.Pitch().Ball().Pos() );

            //keep a record of this value for each player
            cur.SetDistSqToBall( dist );

            if ( dist < ClosestSoFar ) {
                ClosestSoFar = dist;

                this.m_pPlayerClosestToBall = cur;
            };

        };

        this.m_dDistSqToBallOfClosestPlayer = ClosestSoFar;
    };

    //----------------------------- ctor -------------------------------------
    //
    //------------------------------------------------------------------------
    constructor( home_goal,
            opponents_goal,
            pitch,
            color ) {


        let team_color = {

            blue: "blue", red: "red"
        };

        this.blue = team_color.blue;
        this.red = team_color.red;

        this.m_Players = new Array();

        this.m_pOpponentsGoal = opponents_goal;
        this.m_pHomeGoal = home_goal;
        this.m_pOpponents = null;
        this.m_pPitch = pitch;
        this.m_Color = color;
        this.m_dDistSqToBallOfClosestPlayer = 0.0;
        this.m_pSupportingPlayer = null;
        this.m_pReceivingPlayer = null;
        this.m_pControllingPlayer = null;
        this.m_pPlayerClosestToBall = null;

        //setup the state machine
        this.m_pStateMachine = new StateMachine( this );

        this.m_pStateMachine.SetCurrentState( Defending.Instance() );
        this.m_pStateMachine.SetPreviousState( Defending.Instance() );
        this.m_pStateMachine.SetGlobalState( null );

        //create the players and goalkeeper
        this.CreatePlayers();

        //set default steering behaviors
        //let it = this.m_Players.listIterator();
        //while ( it.hasNext() ) {
        //    it.next().Steering().SeparationOn();
        //};

        for( let it = 0, size = this.m_Players.length; it < size; it++ ){
           this.m_Players[ it ].Steering().SeparationOn();
        };

        //create the sweet spot calculator
        this.m_pSupportSpotCalc = new SupportSpotCalculator( Prm.NumSupportSpotsX,
                Prm.NumSupportSpotsY,
                this );
    };

    static blue() {
        return "blue";
    };

    static red() {
        return "red";
    };

    //----------------------- dtor -------------------------------------------
    //
    //------------------------------------------------------------------------
    finalize() {
        super.finalize();
        this.m_pStateMachine = null;

        this.m_Players.clear();

        this.m_pSupportSpotCalc = null;
    };

    /**
     *  renders the players and any team related info
     */
    Render() {
        //let it = this.m_Players.listIterator();

        //while ( it.hasNext() ) {
        //    it.next().Render();
        //};

        for( let it = 0, size = this.m_Players.length; it < size; it++ ){
           this.m_Players[it].Render();
        };

        //show the controlling team and player at the top of the display
        if ( Prm.bShowControllingTeam ) {
            gdi.TextColor( 255, 255, 255 );

            if ( ( this.Color() == this.blue ) && this.InControl() ) {
                gdi.TextAtPos( 20, 13, "Blue in Control" );
            } else if ( ( this.Color() == this.red ) && this.InControl() ) {
                gdi.TextAtPos( 20, 13, "Red in Control" );
            }
            if ( this.m_pControllingPlayer != null ) {
                gdi.TextAtPos( this.Pitch().cxClient() - 150, 13,
                        "Controlling Player: " + ttos( this.m_pControllingPlayer.ID() ) );
            };
        };

        //render the sweet spots
        if ( Prm.bSupportSpots && this.InControl() ) {
            this.m_pSupportSpotCalc.Render();
        };

        //define(SHOW_TEAM_STATE);
        if ( def( SHOW_TEAM_STATE ) ) {
            if ( this.Color() == this.red ) {
                gdi.TextColor( 255, 0, 0 );

                if ( this.m_pStateMachine.CurrentState().constructor.name == Attacking.Instance().constructor.name ) {
                    gdi.TextAtPos( 160, 15, "Attacking" );
                };
                if ( this.m_pStateMachine.CurrentState().constructor.name == Defending.Instance().constructor.name ) {
                    gdi.TextAtPos( 160, 15, "Defending" );
                };
                if ( this.m_pStateMachine.CurrentState().constructor.name == PrepareForKickOff.Instance().constructor.name ) {
                    gdi.TextAtPos( 160, 15, "Kickoff" );
                };
            } else {

                gdi.TextColor( 0, 0, 255 );
                if ( this.m_pStateMachine.CurrentState().constructor.name == Attacking.Instance().constructor.name ) {
                    gdi.TextAtPos( 160, this.Pitch().cyClient() - 10, "Attacking" );
                };
                if ( this.m_pStateMachine.CurrentState().constructor.name == Defending.Instance().constructor.name ) {
                    gdi.TextAtPos( 160, this.Pitch().cyClient() - 10, "Defending" );
                };
                if ( this.m_pStateMachine.CurrentState().constructor.name == PrepareForKickOff.Instance().constructor.name ) {
                    gdi.TextAtPos( 160, this.Pitch().cyClient() - 10, "Kickoff" );
                };
            };
        };

        // define(SHOW_SUPPORTING_PLAYERS_TARGET)
        if ( def( SHOW_SUPPORTING_PLAYERS_TARGET ) ) {
            if ( this.m_pSupportingPlayer != null ) {
                gdi.BlueBrush();
                gdi.RedPen();
                gdi.Circle( this.m_pSupportingPlayer.Steering().Target(), 4 );
            };
        };

    };

    /**
     *  iterates through each player's update function and calculates 
     *  frequently accessed info
     */
    Update() {
        //this information is used frequently so it's more efficient to 
        //calculate it just once each frame
        this.CalculateClosestPlayerToBall();

        //the team state machine switches between attack/defense behavior. It
        //also handles the 'kick off' state where a team must return to their
        //kick off positions before the whistle is blown
        this.m_pStateMachine.Update();

        //now update each player
        //let it = m_Players.listIterator();

        //while ( it.hasNext() ) {
        //    it.next().Update();
        //};

        for( let it = 0, size = this.m_Players.length; it < size; it++ ){
           this.m_Players[ it ].Update();
        };

    };

    /**
     * calling this changes the state of all field players to that of 
     * ReturnToHomeRegion. Mainly used when a goal keeper has
     * possession
     */
    ReturnAllFieldPlayersToHome() {
        //let it = this.m_Players.listIterator();

        //while ( it.hasNext() ) {
        //    let cur = it.next();

        for( let it = 0, size = this.m_Players.length; it < size; it++ ){
            let cur = this.m_Players[ it ];

            if ( cur.Role() != PlayerBase.player_role().goal_keeper ) {
                Dispatcher.DispatchMsg( Dispatcher.SEND_MSG_IMMEDIATELY,
                    1,
                    cur.ID(),
                    Global.MessageTypes.Msg_GoHome,
                    null );
            };
        };
    };

    /**
     *  Given a ball position, a kicking power and a reference to a vector2D
     *  this function will sample random positions along the opponent's goal-
     *  mouth and check to see if a goal can be scored if the ball was to be
     *  kicked in that direction with the given power. If a possible shot is 
     *  found, the function will immediately return true, with the target 
     *  position stored in the vector ShotTarget.
    
     * returns true if player has a clean shot at the goal and sets ShotTarget
     * to a normalized vector pointing in the direction the shot should be
     * made. Else returns false and sets heading to a zero vector
     */
    //CanShoot( BallPos, power ) {
    //    return CanShoot( BallPos, power, new Vector2D() );
    //};

    CanShoot( BallPos,
            power,
            ShotTarget = new Vector2D() ) {
        //the number of randomly created shot targets this method will test 
        let NumAttempts = Prm.NumAttemptsToFindValidStrike;

        while ( NumAttempts-- > 0 ) {
            //choose a random position along the opponent's goal mouth. (making
            //sure the ball's radius is taken into account)
            ShotTarget.set( this.OpponentsGoal().Center() );

            //the y value of the shot position should lay somewhere between two
            //goalposts (taking into consideration the ball diameter)
            let MinYVal = ( this.OpponentsGoal().LeftPost().y + this.Pitch().Ball().BRadius() );
            let MaxYVal = ( this.OpponentsGoal().RightPost().y - this.Pitch().Ball().BRadius() );

            ShotTarget.y = utils.RandInt( MinYVal, MaxYVal );

            //make sure striking the ball with the given power is enough to drive
            //the ball over the goal line.
            let time = this.Pitch().Ball().TimeToCoverDistance( BallPos,
                    ShotTarget,
                    power );

            //if it is, this shot is then tested to see if any of the opponents
            //can intercept it.
            if ( time >= 0 ) {
                if ( this.isPassSafeFromAllOpponents( BallPos, ShotTarget, null, power ) ) {
                    return true;
                };
            };
        };

        return false;
    };

    /**
     * The best pass is considered to be the pass that cannot be intercepted 
     * by an opponent and that is as far forward of the receiver as possible  
     * If a pass is found, the receiver's address is returned in the 
     * reference, 'receiver' and the position the pass will be made to is 
     * returned in the  reference 'PassTarget'
     */
    FindPass( passer,
            receiver,
            PassTarget,
            power,
            MinPassingDistance ) {

        //assert ( receiver != null );
        //assert ( PassTarget != null );

        if ( !( receiver != null ) ) {
            //console.log( "Findpass receiver is null" );
        };
        if ( !( PassTarget != null ) ) {
            //console.log( "Findpass PassTarget is null" );
        };

        //let it = Members().listIterator();
        let it = this.Members();

        let ClosestToGoalSoFar = MaxFloat;
        let Target = new Vector2D();

        let finded = false;
        //iterate through all this player's team members and calculate which
        //one is in a position to be passed the ball 

        for( let iter = 0, size = it.length; iter < size; iter++ ){
            let curPlyr = it[ iter ];

//        while ( it.hasNext() ) {
//            let curPlyr = it.next();


            //make sure the potential receiver being examined is not this player
            //and that it is further away than the minimum pass distance
            if ( ( curPlyr != passer )
                    && ( Vector2D.Vec2DDistanceSq( passer.Pos(), curPlyr.Pos() )
                    > MinPassingDistance * MinPassingDistance ) ) {
                if ( this.GetBestPassToReceiver( passer, curPlyr, Target, power ) ) {
                    //if the pass target is the closest to the opponent's goal line found
                    // so far, keep a record of it
                    let Dist2Goal = Math.abs( Target.x - this.OpponentsGoal().Center().x );

                    if ( Dist2Goal < ClosestToGoalSoFar ) {
                        let ClosestToGoalSoFar = Dist2Goal;


                        //keep a record of this player
                        //receiver.set( curPlyr );
                        Global.objReceiverRef = curPlyr;

                        //and the target
                        PassTarget.set( Target );

                        finded = true;
                    };
                };
            };
        };//next team member

        return finded;
    };

    /**
     *  Three potential passes are calculated. One directly toward the receiver's
     *  current position and two that are the tangents from the ball position
     *  to the circle of radius 'range' from the receiver.
     *  These passes are then tested to see if they can be intercepted by an
     *  opponent and to make sure they terminate within the playing area. If
     *  all the passes are invalidated the function returns false. Otherwise
     *  the function returns the pass that takes the ball closest to the 
     *  opponent's goal area.
     */
    GetBestPassToReceiver( passer,
            receiver,
            PassTarget,
            power ) {
        
        //assert ( PassTarget != null );
        
        //first, calculate how much time it will take for the ball to reach 
        //this receiver, if the receiver was to remain motionless 
        let time = this.Pitch().Ball().TimeToCoverDistance( this.Pitch().Ball().Pos(),
                receiver.Pos(),
                power );

        //return false if ball cannot reach the receiver after having been
        //kicked with the given power
        if ( time < 0 ) {
            return false;
        };

        //the maximum distance the receiver can cover in this time
        let InterceptRange = time * receiver.MaxSpeed();

        //Scale the intercept range
        let ScalingFactor = 0.3;
        InterceptRange *= ScalingFactor;

        //now calculate the pass targets which are positioned at the intercepts
        //of the tangents from the ball to the receiver's range circle.
        let ip1 = new Vector2D(), ip2 = new Vector2D();

        geometry.GetTangentPoints( receiver.Pos(),
                InterceptRange,
                this.Pitch().Ball().Pos(),
                ip1,
                ip2 );

        let Passes = [ ip1, receiver.Pos(), ip2 ];
        let NumPassesToTry = Passes.length;

        // this pass is the best found so far if it is:
        //
        //  1. Further upfield than the closest valid pass for this receiver
        //     found so far
        //  2. Within the playing area
        //  3. Cannot be intercepted by any opponents

        let ClosestSoFar = MaxFloat;
        let bResult = false;

        for ( let pass = 0; pass < NumPassesToTry; ++pass ) {
            let dist = Math.abs( Passes[pass].x - this.OpponentsGoal().Center().x );

            if ( ( dist < ClosestSoFar )
                    && this.Pitch().PlayingArea().Inside( Passes[pass] )
                    && this.isPassSafeFromAllOpponents( this.Pitch().Ball().Pos(),
                    Passes[pass],
                    receiver,
                    power ) ) {
                ClosestSoFar = dist;
                PassTarget.set( Passes[pass] );
                bResult = true;
            };
        };

        return bResult;
    };

    /**
     * test if a pass from positions 'from' to 'target' kicked with force 
     * 'PassingForce'can be intercepted by an opposing player
     */
    isPassSafeFromOpponent( from,
            target,
            receiver,
            opp,
            PassingForce ) {
        //move the opponent into local space.
        let ToTarget = Vector2D.sub( target, from );
        let ToTargetNormalized = Vector2D.Vec2DNormalize( ToTarget );

        let LocalPosOpp = Transformation.PointToLocalSpace( opp.Pos(),
                ToTargetNormalized,
                ToTargetNormalized.Perp(),
                from );

        //if opponent is behind the kicker then pass is considered okay(this is 
        //based on the assumption that the ball is going to be kicked with a 
        //velocity greater than the opponent's max velocity)
        if ( LocalPosOpp.x < 0 ) {
            return true;
        };

        //if the opponent is further away than the target we need to consider if
        //the opponent can reach the position before the receiver.
        if ( Vector2D.Vec2DDistanceSq( from, target ) < Vector2D.Vec2DDistanceSq( opp.Pos(), from ) ) {
            if ( receiver != null ) {
                if ( Vector2D.Vec2DDistanceSq( target, opp.Pos() )
                        > Vector2D.Vec2DDistanceSq( target, receiver.Pos() ) ) {
                    return true;
                } else {
                    return false;
                };

            } else {
                return true;
            };
        };

        //calculate how long it takes the ball to cover the distance to the 
        //position orthogonal to the opponents position
        let TimeForBall =
                this.Pitch().Ball().TimeToCoverDistance( new Vector2D( 0, 0 ),
                new Vector2D( LocalPosOpp.x, 0 ),
                PassingForce );

        //now calculate how far the opponent can run in this time
        let reach = opp.MaxSpeed() * TimeForBall
                + this.Pitch().Ball().BRadius()
                + opp.BRadius();

        //if the distance to the opponent's y position is less than his running
        //range plus the radius of the ball and the opponents radius then the
        //ball can be intercepted
        if ( Math.abs( LocalPosOpp.y ) < reach ) {
            return false;
        };

        return true;
    };

    /**
     * tests a pass from position 'from' to position 'target' against each member
     * of the opposing team. Returns true if the pass can be made without
     * getting intercepted
     */
    isPassSafeFromAllOpponents( from,
            target,
            receiver,
            PassingForce ) {
    
        let opp = this.Opponents().Members();

        for( let it = 0, size = opp.length; it < size; it++ ){
            if ( !this.isPassSafeFromOpponent( from, target, receiver, opp[ it ], PassingForce ) ) {
                //debug_on();

                return false;
            };
        };

        return true;

        /*

        let opp = Opponents().Members().listIterator();

        while ( opp.hasNext() ) {
            if ( !isPassSafeFromOpponent( from, target, receiver, opp.next(), PassingForce ) ) {
                debug_on();

                return false;
            };
        };

        return true;
        */
    };

    /**
     * returns true if an opposing player is within the radius of the position
     * given as a par ameter
     */
    isOpponentWithinRadius( pos, rad ) {
        //let it = Opponents().Members().listIterator();

        //while ( it.hasNext() ) {
        //    if ( Vec2DDistanceSq( pos, it.next().Pos() ) < rad * rad ) {

        let opp = this.Opponents().Members();

        for( let it = 0, size = opp.length; it < size; it++ ){
            if ( Vector2D.Vec2DDistanceSq( pos, opp[ it ].Pos() ) < rad * rad ) {
                return true;
            };
        };

        return false;
    };

    /**
     * this tests to see if a pass is possible between the requester and
     * the controlling player. If it is possible a message is sent to the
     * controlling player to pass the ball asap.
     */
    RequestPass( requester ) {
        //maybe put a restriction here
        if ( utils.RandFloat() > 0.1 ) {
            return;
        };

        if ( this.isPassSafeFromAllOpponents( this.ControllingPlayer().Pos(),
                requester.Pos(),
                requester,
                Prm.MaxPassingForce ) ) {

            //tell the player to make the pass
            //let the receiver know a pass is coming 
            Dispatcher.DispatchMsg( Dispatcher.SEND_MSG_IMMEDIATELY,
                    requester.ID(),
                    this.ControllingPlayer().ID(),
                    Global.MessageTypes.Msg_PassToMe,
                    requester );

        };
    };

    /**
     * calculate the closest player to the SupportSpot
     */
    DetermineBestSupportingAttacker() {
        let ClosestSoFar = MaxFloat;

        let BestPlayer = null;

        //let it = m_Players.listIterator();

        for( let it = 0, size = this.m_Players.length; it < size; it++ ){
            let cur = this.m_Players[it];
        //while ( it.hasNext() ) {
        //   let cur = it.next();
            //only attackers utilize the BestSupportingSpot
            if ( ( cur.Role() == PlayerBase.player_role().attacker ) && ( cur != this.m_pControllingPlayer ) ) {
                //calculate the dist. Use the squared value to avoid sqrt
                let dist = Vector2D.Vec2DDistanceSq(cur.Pos(), this.m_pSupportSpotCalc.GetBestSupportingSpot() );

                //if the distance is the closest so far and the player is not a
                //goalkeeper and the player is not the one currently controlling
                //the ball, keep a record of this player
                if ( ( dist < ClosestSoFar ) ) {
                    ClosestSoFar = dist;
                    BestPlayer = cur;
                };
            };
        };

        return BestPlayer;
    };

    Members() {
        return this.m_Players;
    };

    GetFSM() {
        return this.m_pStateMachine;
    };

    HomeGoal() {
        return this.m_pHomeGoal;
    };

    OpponentsGoal() {
        return this.m_pOpponentsGoal;
    };

    Pitch() {
        return this.m_pPitch;
    };

    Opponents() {
        return this.m_pOpponents;
    };

    SetOpponents( opps ) {
        this.m_pOpponents = opps;
    };

    Color() {
        return this.m_Color;
    };

    SetPlayerClosestToBall( plyr ) {
        this.m_pPlayerClosestToBall = plyr;
    };

    PlayerClosestToBall() {
        return this.m_pPlayerClosestToBall;
    };

    ClosestDistToBallSq() {
        return this.m_dDistSqToBallOfClosestPlayer;
    };

    GetSupportSpot() {
        return new Vector2D( this.m_pSupportSpotCalc.GetBestSupportingSpot() );
    };

    SupportingPlayer() {
        return this.m_pSupportingPlayer;
    };

    SetSupportingPlayer( plyr ) {
        this.m_pSupportingPlayer = plyr;
    };

    Receiver() {
        return this.m_pReceivingPlayer;
    };

    SetReceiver( plyr ) {
        this.m_pReceivingPlayer = plyr;
    };

    ControllingPlayer() {
        return this.m_pControllingPlayer;
    };

    SetControllingPlayer( plyr ) {
        this.m_pControllingPlayer = plyr;

        //rub it in the opponents faces!
        this.Opponents().LostControl();
    };

    InControl() {
        if ( this.m_pControllingPlayer != null ) {
            return true;
        } else {
            return false;
        };
    };

    LostControl() {
        this.m_pControllingPlayer = null;
    };

    GetPlayerFromID( id ) {
        let it = m_Players.listIterator();

        while ( it.hasNext() ) {
            let cur = it.next();
            if ( cur.ID() == id ) {
                return cur;
            };
        };

        return null;
    };

    SetPlayerHomeRegion( plyr, region ) {
        //assert ( ( plyr >= 0 ) && ( plyr < m_Players.size() ) );
        if ( !( plyr >= 0 ) && ( plyr < m_Players.size() ) ){
            console.log ( " SetPlayerHomeRegion plyr index out of range " );
        }

        this.m_Players[ plyr ].SetHomeRegion( region );
    };

    DetermineBestSupportingPosition() {
        this.m_pSupportSpotCalc.DetermineBestSupportingPosition();
    };

    //---------------------- UpdateTargetsOfWaitingPlayers ------------------------
    //
    //  
    UpdateTargetsOfWaitingPlayers() {


        for( let it = 0, size = this.m_Players.length; it < size; it++ ){

            let cur = this.m_Players[ it ];
            if ( cur.Role() != PlayerBase.player_role().goal_keeper ) {
                //cast to a field player
                let plyr = cur;

                if ( plyr.GetFSM().isInState( Wait.Instance() )
                        || plyr.GetFSM().isInState( ReturnToHomeRegion.Instance() ) ) {
                    plyr.Steering().SetTarget( plyr.HomeRegion().Center() );
                };
            };

        };

        //let it = this.m_Players.listIterator();

        //while ( it.hasNext() ) {
        //    let cur = it.next();
        //    if ( cur.Role() != PlayerBase.player_role.goal_keeper ) {
                //cast to a field player
        //        let plyr = cur;

        //        if ( plyr.GetFSM().isInState( Wait.Instance() )
        //                || plyr.GetFSM().isInState( ReturnToHomeRegion.Instance() ) ) {
        //            plyr.Steering().SetTarget( plyr.HomeRegion().Center() );
        //        };
        //    };
        //};

    };

    /**
     * @return false if any of the team are not located within their home region
     */
    AllPlayersAtHome() {
        //let it = this.m_Players.listIterator();

        //while ( it.hasNext() ) {
        //    if ( it.next().InHomeRegion() == false ) {

        for( let it = 0, size = this.m_Players.length; it < size; it++ ){
            if ( this.m_Players[ it ].InHomeRegion() == false ) {            
                return false;
            };
        };

        return true;
    };

    /**
     * @return Name of the team ("Red" or "Blue")
     */
    Name() {
        if ( this.m_Color == SoccerTeam.blue() ) {
            return "Blue";
        };
        return "Red";
    };
};
