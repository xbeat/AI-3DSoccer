/**
 *  Desc: Definition of a soccer player base class. <del>The player inherits
 *        from the autolist class so that any player created will be 
 *        automatically added to a list that is easily accesible by any
 *        other game objects.</del> (mainly used by the steering behaviors and
 *        player state classes)
 * 
 */

class PlayerBase extends MovingEntity {

    //----------------------------- ctor -------------------------------------
    //------------------------------------------------------------------------
    constructor( home_team,
            home_region,
            heading,
            velocity,
            mass,
            max_force,
            max_speed,
            max_turn_rate,
            scale,
            role ) {

        super( home_team.Pitch().GetRegionFromIndex( home_region ).Center(),
                scale * 10.0,
                velocity,
                max_speed,
                heading,
                mass,
                new Vector2D( scale, scale ),
                max_turn_rate,
                max_force );
    
        //the vertex buffer
        this.m_vecPlayerVB = new Array();
        //the buffer for the transformed vertices
        this.m_vecPlayerVBTrans = new Array();

        this.m_pTeam = home_team;
        this.m_dDistSqToBall = MaxFloat;
        this.m_iHomeRegion = home_region;
        this.m_iDefaultRegion = home_region;
        this.m_PlayerRole = role;

        //setup the vertex buffers and calculate the bounding radius
        let player = [
            new Vector2D( -3, 8 ),
            new Vector2D( 3, 10 ),
            new Vector2D( 3, -10 ),
            new Vector2D( -3, -8 )
        ];
        let NumPlayerVerts = player.length;

        for ( let vtx = 0; vtx < NumPlayerVerts; ++vtx ) {
            this.m_vecPlayerVB.push( player[vtx] );

            //set the bounding radius to the length of the 
            //greatest extent
            if ( Math.abs( player[vtx].x) > this.m_dBoundingRadius ) {
                this.m_dBoundingRadius = Math.abs( player[vtx].x );
            };

            if ( Math.abs( player[vtx].y ) > this.m_dBoundingRadius ) {
                this.m_dBoundingRadius = Math.abs( player[vtx].y );
            };
        };

        //set up the steering behavior class
        this.m_pSteering = new SteeringBehaviors( this,
                this.m_pTeam.Pitch(),
                this.Ball() );

        //a player's start target is its start position (because it's just waiting)
        this.m_pSteering.SetTarget( home_team.Pitch().GetRegionFromIndex( home_region ).Center() );
        
        //new AutoList().add( this );
    };

    finalize() {
        super.finalize();
        this.m_pSteering = null;
        //new AutoList().remove( this );
    };

    static player_role(){
        return {
            goal_keeper: "goal_keeper", 
            attacker: "attacker", 
            defender: "defender"
        };
    };

    /**
     *  returns true if there is an opponent within this player's 
     *  comfort zone
     */
    isThreatened() {
        //check against all opponents to make sure non are within this
        //player's comfort zone
        let it;
        it = this.Team().Opponents().Members();
     
        for( let iter = 0, size = it.length; iter < size; iter++ ){

            let curOpp = it[ iter ];
            //calculate distance to the player. if dist is less than our
            //comfort zone, and the opponent is infront of the player, return true
            if ( this.PositionInFrontOfPlayer( curOpp.Pos() )
                    && ( Vector2D.Vec2DDistanceSq( this.Pos(), curOpp.Pos() ) < Prm.PlayerComfortZoneSq ) ) {
                return true;
            };

        };// next opp

        return false;
        

        //it = Team().Opponents().Members().listIterator();

        //while ( it.hasNext() ) {
        //    let curOpp = it.next();
            //calculate distance to the player. if dist is less than our
            //comfort zone, and the opponent is infront of the player, return true
        //    if ( PositionInFrontOfPlayer(curOpp.Pos() )
        //            && ( Vec2DDistanceSq( Pos(), curOpp.Pos() ) < Prm.PlayerComfortZoneSq ) ) {
        //        return true;
        //    };

        //};// next opp

        //return false;
    };

    /**
     *  rotates the player to face the ball
     */
    TrackBall() {
        this.RotateHeadingToFacePosition( this.Ball().Pos() );
    }

    /**
     * sets the player's heading to point at the current target
     */
    TrackTarget() {
        this.SetHeading( Vector2D.Vec2DNormalize( Vector2D.sub( this.Steering().Target(), this.Pos() ) ) );
    };

    /**
     * determines the player who is closest to the SupportSpot and messages him
     * to tell him to change state to SupportAttacker
     */
    FindSupport() {
        //if there is no support we need to find a suitable player.
        if ( this.Team().SupportingPlayer() == null ) {
            let BestSupportPly = this.Team().DetermineBestSupportingAttacker();
            this.Team().SetSupportingPlayer( BestSupportPly );
            Dispatcher.DispatchMsg( Dispatcher.SEND_MSG_IMMEDIATELY,
                    this.ID(),
                    this.Team().SupportingPlayer().ID(),
                    Global.MessageTypes.Msg_SupportAttacker,
                    null );
        };

        let BestSupportPly = this.Team().DetermineBestSupportingAttacker();

        //if the best player available to support the attacker changes, update
        //the pointers and send messages to the relevant players to update their
        //states
        if ( BestSupportPly != null && ( BestSupportPly != this.Team().SupportingPlayer() ) ) {

            if ( this.Team().SupportingPlayer() != null ) {
                Dispatcher.DispatchMsg( Dispatcher.SEND_MSG_IMMEDIATELY,
                        this.ID(),
                        this.Team().SupportingPlayer().ID(),
                        Global.MessageTypes.Msg_GoHome,
                        null );
            };

            this.Team().SetSupportingPlayer( BestSupportPly );

            Dispatcher.DispatchMsg( Dispatcher.SEND_MSG_IMMEDIATELY,
                    this.ID(),
                    this.Team().SupportingPlayer().ID(),
                    Global.MessageTypes.Msg_SupportAttacker,
                    null );
        };
    };

    /** 
     * @return true if the ball can be grabbed by the goalkeeper 
     */
    BallWithinKeeperRange() {
        return ( Vector2D.Vec2DDistanceSq( this.Pos(), this.Ball().Pos() ) < Prm.KeeperInBallRangeSq );
    };

    /**
     * @return true if the ball is within kicking range
     */
    BallWithinKickingRange() {
        return ( Vector2D.Vec2DDistanceSq( this.Ball().Pos(), this.Pos() ) < Prm.PlayerKickingDistanceSq);
    };

    /** 
     * @return true if a ball comes within range of a receiver
     */
    BallWithinReceivingRange() {
        return ( Vector2D.Vec2DDistanceSq( this.Pos(), this.Ball().Pos() ) < Prm.BallWithinReceivingRangeSq);
    };

    /**
     * @return true if the player is located within the boundaries 
     *        of his home region
     */
    InHomeRegion() {
        if ( this.m_PlayerRole == PlayerBase.player_role().goal_keeper ) {
            return this.Pitch().GetRegionFromIndex( this.m_iHomeRegion ).Inside( this.Pos(), Region.region_modifier().normal );
        } else {
            return this.Pitch().GetRegionFromIndex( this.m_iHomeRegion ).Inside( this.Pos(), Region.region_modifier().halfsize );
        };
    };

    /**
     * 
     * @return true if this player is ahead of the attacker
     */
    isAheadOfAttacker() {
        return Math.abs( this.Pos().x - this.Team().OpponentsGoal().Center().x )
                < Math.abs( this.Team().ControllingPlayer().Pos().x - this.Team().OpponentsGoal().Center().x );
    };

    //returns true if a player is located at the designated support spot
    //bool        AtSupportSpot()const;
    /**
     * @return true if the player is located at his steering target
     */
    AtTarget() {
        return ( Vector2D.Vec2DDistanceSq( this.Pos(), this.Steering().Target() ) < Prm.PlayerInTargetRangeSq);
    };

    /**
     * @return true if the player is the closest player in his team to the ball
     */
    isClosestTeamMemberToBall() {
        return this.Team().PlayerClosestToBall() == this;
    };

    /**
     * @param position
     * @return true if the point specified by 'position' is located in
     * front of the player
     */
    PositionInFrontOfPlayer( position ) {
        let ToSubject = Vector2D.sub( position, this.Pos() );

        if ( ToSubject.Dot( this.Heading() ) > 0 ) {
            return true;
        } else {
            return false;
        };
    };

    /**
     * @return true if the player is the closest player on the pitch to the ball
     */
    isClosestPlayerOnPitchToBall() {
        return this.isClosestTeamMemberToBall()
                && ( this.DistSqToBall() < this.Team().Opponents().ClosestDistToBallSq() );
    };

    /** 
     * @return true if this player is the controlling player
     */
    isControllingPlayer() {
        return this.Team().ControllingPlayer() == this;
    };

    /** 
     * @return true if the player is located in the designated 'hot region' --
     * the area close to the opponent's goal 
     */
    InHotRegion() {
        return Math.abs( this.Pos().x - this.Team().OpponentsGoal().Center().x )
                < this.Pitch().PlayingArea().Length() / 3.0;
    };

    Role() {
        return this.m_PlayerRole;
    };

    DistSqToBall() {
        return this.m_dDistSqToBall;
    };

    SetDistSqToBall( val ) {
        this.m_dDistSqToBall = val;
    };

    /**
     *  Calculate distance to opponent's/home goal. Used frequently by the passing methods
     */
    DistToOppGoal() {
        return Math.abs( Pos().x - Team().OpponentsGoal().Center().x );
    };

    DistToHomeGoal() {
        return Math.abs( Pos().x - Team().HomeGoal().Center().x );
    };

    SetDefaultHomeRegion() {
        this.m_iHomeRegion = this.m_iDefaultRegion;
    };

    Ball() {
        return this.Team().Pitch().Ball();
    };

    Pitch() {
        return this.Team().Pitch();
    };

    Steering() {
        return this.m_pSteering;
    };

    HomeRegion() {
        return this.Pitch().GetRegionFromIndex( this.m_iHomeRegion );
    };

    SetHomeRegion( NewRegion ) {
        this.m_iHomeRegion = NewRegion;
    };

    Team() {
        return this.m_pTeam;
    };

    /**
     * binary predicates for std::sort (see CanPassForward/Backward)
     */
    SortByDistanceToOpponentsGoal( p1,
            p2 ) {
        return ( p1.DistToOppGoal() < p2.DistToOppGoal() );
    };

    SortByReversedDistanceToOpponentsGoal( p1,
             p2 ) {
        return ( p1.DistToOppGoal() > p2.DistToOppGoal() );
    };
};
