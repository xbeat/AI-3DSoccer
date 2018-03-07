/**
 * 
 *  Desc:   class to encapsulate steering behaviors for a soccer player
 * 
 */

class SteeringBehaviors {

    /**
     * Given a target, this behavior returns a steering force which will
     * allign the agent with the target and move the agent in the desired
     * direction
     */
    Seek( target ) {

        let DesiredVelocity = Vector2D.Vec2DNormalize( Vector2D.mul( Vector2D.sub( target, this.m_pPlayer.Pos() ),
                this.m_pPlayer.MaxSpeed() ) );

        return ( Vector2D.sub( DesiredVelocity, this.m_pPlayer.Velocity() ) );
    };

    /**
     * This behavior is similar to seek but it attempts to arrive at the
     *  target with a zero velocity
     */
    Arrive( TargetPos, deceleration ) {
        let ToTarget = Vector2D.sub( TargetPos, this.m_pPlayer.Pos() );

        //calculate the distance to the target
        let dist = ToTarget.Length();

        if ( dist > 0 ) {
            //because Deceleration is enumerated as an int, this value is required
            //to provide fine tweaking of the deceleration..
            let DecelerationTweaker = 0.3;

            //calculate the speed required to reach the target given the desired
            //deceleration
            let speed = dist / ( deceleration * DecelerationTweaker );

            //make sure the velocity does not exceed the max
            speed = Math.min( speed, this.m_pPlayer.MaxSpeed() );

            //from here proceed just like Seek except we don't need to normalize 
            //the ToTarget vector because we have already gone to the trouble
            //of calculating its length: dist. 
            let DesiredVelocity = Vector2D.mul( ToTarget, speed / dist );

            return Vector2D.sub( DesiredVelocity, this.m_pPlayer.Velocity() );
        };

        return new Vector2D( 0, 0 );
    };

    /**
     * This behavior predicts where its prey will be and seeks
     * to that location
     * This behavior creates a force that steers the agent towards the 
     * ball
     */
    Pursuit( ball ) {
        let ToBall = Vector2D.sub( ball.Pos(), this.m_pPlayer.Pos() );

        //the lookahead time is proportional to the distance between the ball
        //and the pursuer; 
        let LookAheadTime = 0.0;

        if ( ball.Speed() != 0.0 ) {
            LookAheadTime = ToBall.Length() / ball.Speed();
        };

        //calculate where the ball will be at this time in the future
        this.m_vTarget = ball.FuturePosition( LookAheadTime );

        //now seek to the predicted future position of the ball
        return this.Arrive( this.m_vTarget, this.Deceleration.fast );
    };

    /**
     *
     * this calculates a force repelling from the other neighbors
     */
    Separation() {
        //iterate through all the neighbors and calculate the vector from them
        let SteeringForce = new Vector2D();

        //let AllPlayers = new AutoList<PlayerBase>().GetAllMembers();
        //let it = AllPlayers.listIterator();
        //while ( it.hasNext() ) {
        //    let curPlyr = it.next();

        for( let it = 0, size = Global.AllPlayers.length; it < size; it++ ){
            
            let curPlyr = Global.AllPlayers[ it ];      
            //make sure this agent isn't included in the calculations and that
            //the agent is close enough
            if ( ( curPlyr != this.m_pPlayer ) && curPlyr.Steering().Tagged() ) {
                let ToAgent = Vector2D.sub( this.m_pPlayer.Pos(), curPlyr.Pos() );

                //scale the force inversely proportional to the agents distance  
                //from its neighbor.
                SteeringForce.add( Vector2D.div( Vector2D.Vec2DNormalize( ToAgent ), ToAgent.Length() ) );
            };
        };

        return SteeringForce;
    };

    /**
     * Given an opponent and an object position this method returns a 
     * force that attempts to position the agent between them
     */
    Interpose( ball,
            target,
            DistFromTarget ) {
        return this.Arrive( Vector2D.add( target, Vector2D.mul( Vector2D.Vec2DNormalize( Vector2D.sub( ball.Pos(), target ) ),
                DistFromTarget) ), this.Deceleration.normal );
    }

    /**
     *  tags any vehicles within a predefined radius
     */
    FindNeighbours() {
        //let AllPlayers = new AutoList<PlayerBase>().GetAllMembers();
        //let it = AllPlayers.listIterator();
        //while ( it.hasNext() ) {
        //    let curPlyr = it.next();

        for( let it = 0, size = Global.AllPlayers.length; it < size; it++ ){
            
            let curPlyr = Global.AllPlayers[ it ];

            //first clear any current tag
            curPlyr.Steering().UnTag();

            //work in distance squared to avoid sqrts
            let to = Vector2D.sub( curPlyr.Pos(), this.m_pPlayer.Pos() );

            if ( to.LengthSq() < ( this.m_dViewDistance * this.m_dViewDistance ) ) {
                curPlyr.Steering().Tag();
            };
        };//next
    };

    /**
     * this function tests if a specific bit of m_iFlags is set
     */
    On( bt ) {
        //return ( this.m_iFlags & bt.flag() ) == bt.flag();
        return ( this.m_iFlags & ( 1 << bt.flag() ) ) == ( 1 << bt.flag() );

    };

    /**
     *  This function calculates how much of its max steering force the 
     *  vehicle has left to apply and then applies that amount of the
     *  force to add.
     */
    AccumulateForce( sf, ForceToAdd ) {
        //first calculate how much steering force we have left to use
        let MagnitudeSoFar = sf.Length();

        let magnitudeRemaining = this.m_pPlayer.MaxForce() - MagnitudeSoFar;

        //return false if there is no more force left to use
        if ( magnitudeRemaining <= 0.0 ) {
            return false;
        };

        //calculate the magnitude of the force we want to add
        let MagnitudeToAdd = ForceToAdd.Length();

        //now calculate how much of the force we can really add  
        if ( MagnitudeToAdd > magnitudeRemaining ) {
            MagnitudeToAdd = magnitudeRemaining;
        };

        //add it to the steering force
        sf.add( Vector2D.mul( Vector2D.Vec2DNormalize( ForceToAdd ), MagnitudeToAdd ) );

        return true;
    };

    /**
     * this method calls each active steering behavior and acumulates their
     *  forces until the max steering force magnitude is reached at which
     *  time the function returns the steering force accumulated to that 
     *  point
     */
    SumForces() {
        let force = new Vector2D();

        //the soccer players must always tag their neighbors
        this.FindNeighbours();

        if ( this.On( this.behavior_type.separation ) ) {
            force.add( Vector2D.mul( this.Separation(), this.m_dMultSeparation ) );

            if ( !this.AccumulateForce( this.m_vSteeringForce, force ) ) {
                return this.m_vSteeringForce;
            };
        };

        if ( this.On( this.behavior_type.seek ) ) {
            force.add( this.Seek( this.m_vTarget ) );

            if ( !this.AccumulateForce( this.m_vSteeringForce, force ) ) {
                return this.m_vSteeringForce;
            };
        };

        if ( this.On( this.behavior_type.arrive ) ) {
            force.add( this.Arrive( this.m_vTarget, this.Deceleration.fast ) );

            if ( !this.AccumulateForce( this.m_vSteeringForce, force ) ) {
                return this.m_vSteeringForce;
            };
        };

        if ( this.On( this.behavior_type.pursuit ) ) {
            force.add( this.Pursuit( this.m_pBall ) );

            if ( !this.AccumulateForce( this.m_vSteeringForce, force ) ) {
                return this.m_vSteeringForce;
            };
        };

        if ( this.On( this.behavior_type.interpose ) ) {
            force.add( this.Interpose( this.m_pBall, this.m_vTarget, this.m_dInterposeDist ) );

            if ( !this.AccumulateForce( this.m_vSteeringForce, force ) ) {
                return this.m_vSteeringForce;
            };
        };

        return this.m_vSteeringForce;
    };

    //------------------------- ctor -----------------------------------------
    //
    //------------------------------------------------------------------------
    constructor( agent,
            world,
            ball ) {

        this.m_pPlayer;
        this.m_pBall;
        //the steering force created by the combined effect of all
        //the selected behaviors
        this.m_vSteeringForce = new Vector2D();
        //the current target (usually the ball or predicted ball position)
        this.m_vTarget = new Vector2D();
        //the distance the player tries to interpose from the target
        this.m_dInterposeDist;
        //multipliers. 
        this.m_dMultSeparation;
        //how far it can 'see'
        this.m_dViewDistance;
        //binary flags to indicate whether or not a behavior should be active
        this.m_iFlags;

        this.behavior_type = {

            none: {

                flag: function() {
                    return 0;
                }
            },

            seek: {

                flag: function() {
                    return 1;
                }
            },

            arrive: {

                flag: function() {
                    return 2;
                }
            },

            separation: {

                flag: function() {
                    return 4;
                }
            },

            pursuit: {

                flag: function() {
                    return 8;
                }
            },

            interpose: {

                flag: function() {
                    return 16;
                }
            }
        };

        //used by group behaviors to tag neighbours
        this.m_bTagged;

        //Arrive makes use of these to determine how quickly a vehicle
        //should decelerate to its target
        this.Deceleration = {
            slow: 3, normal: 2, fast: 1,
        };

        this.m_pPlayer = agent;
        this.m_iFlags = 0;
        this.m_dMultSeparation = Prm.SeparationCoefficient;
        this.m_bTagged = false;
        this.m_dViewDistance = Prm.ViewDistance;
        this.m_pBall = ball;
        this.m_dInterposeDist = 0.0;
        this.m_Antenna = new Array();
    };

    finalize() {
        super.finalize();
    };

    /**
     * calculates the overall steering force based on the currently active
     * steering behaviors. 
     */
    Calculate() {
        //reset the force
        this.m_vSteeringForce.Zero();

        //this will hold the value of each individual steering force
        this.m_vSteeringForce = this.SumForces();

        //make sure the force doesn't exceed the vehicles maximum allowable
        this.m_vSteeringForce.Truncate( this.m_pPlayer.MaxForce() );

        return new Vector2D( this.m_vSteeringForce );
    };

    /**
     * calculates the component of the steering force that is parallel
     * with the vehicle heading
     */
    ForwardComponent() {
        return this.m_pPlayer.Heading().Dot( this.m_vSteeringForce );
    };

    /**
     * calculates the component of the steering force that is perpendicuar
     * with the vehicle heading
     */
    SideComponent() {
        return this.m_pPlayer.Side().Dot( this.m_vSteeringForce ) * this.m_pPlayer.MaxTurnRate();
    };

    Force() {
        return this.m_vSteeringForce;
    };

    /**
     * renders visual aids and info for seeing how each behavior is
     * calculated
     */
    RenderAids() {
        //render the steering force
        gdi.RedPen();
        gdi.Line( this.m_pPlayer.Pos(), add( this.m_pPlayer.Pos(), mul( this.m_vSteeringForce, 20) ) );
    };

    Target() {
        return new Vector2D( this.m_vTarget );
    };

    SetTarget( t ) {
        this.m_vTarget = new Vector2D( t );
    };

    InterposeDistance() {
        return this.m_dInterposeDist;
    };

    SetInterposeDistance( d ) {
        this.m_dInterposeDist = d;
    };

    Tagged() {
        return this.m_bTagged;
    };

    Tag() {
        this.m_bTagged = true;
    };

    UnTag() {
        this.m_bTagged = false;
    };

    SeekOn() {
        this.m_iFlags |= ( 1 << this.behavior_type.seek.flag() );
    };

    ArriveOn() {
        this.m_iFlags |= ( 1 << this.behavior_type.arrive.flag() );
    };

    PursuitOn() {
        this.m_iFlags |= ( 1 << this.behavior_type.pursuit.flag() );
    };

    SeparationOn() {
        this.m_iFlags |= ( 1 << this.behavior_type.separation.flag() );
    };

    InterposeOn( d ) {
        this.m_iFlags |= ( 1 << this.behavior_type.interpose.flag() );
        this.m_dInterposeDist = d;
    };

    SeekOff() {
        if ( this.On( this.behavior_type.seek ) ) {
            this.m_iFlags ^= ( 1 << this.behavior_type.seek.flag() );
        };
    };

    ArriveOff() {
        if ( this.On( this.behavior_type.arrive ) ) {
            this.m_iFlags ^= ( 1 << this.behavior_type.arrive.flag() );
        };
    };

    PursuitOff() {
        if ( this.On( this.behavior_type.pursuit ) ) {
            this.m_iFlags ^= ( 1 << this.behavior_type.pursuit.flag() );
        };
    };

    SeparationOff() {
        if ( this.On( this.behavior_type.separation ) ) {
            this.m_iFlags ^= ( 1 << this.behavior_type.separation.flag() );
        };
    };

    InterposeOff() {
        if ( this.On( this.behavior_type.interpose ) ) {
            this.m_iFlags ^= ( 1 << this.behavior_type.interpose.flag() );
        };
    };

    SeekIsOn() {
        return this.On( this.behavior_type.seek );
    };

    ArriveIsOn() {
        return this.On( this.behavior_type.arrive );
    };

    PursuitIsOn() {
        return this.On( this.behavior_type.pursuit );
    };

    SeparationIsOn() {
        return this.On( this.behavior_type.separation );
    };

    InterposeIsOn() {
        return this.On( this.behavior_type.interpose );
    };
};