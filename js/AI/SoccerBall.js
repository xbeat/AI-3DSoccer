/**
 *  Desc: Class to implement a soccer ball. This class inherits from
 *        MovingEntity and provides further functionality for collision
 *        testing and position prediction.
 * 
 */

class SoccerBall extends MovingEntity {

    constructor( pos,
                BallSize,
                mass,
                PitchBoundary ) {

        //set up the base class
        super( pos,
                BallSize,
                new Vector2D( 0, 0 ),
                -1.0, //max speed - unused
                new Vector2D( 0, 1 ),
                mass,
                new Vector2D( 1.0, 1.0 ), //scale     - unused
                0, //turn rate - unused
                0 );                  //max force - unused

        this.m_PitchBoundary;
        this.m_PitchBoundary = PitchBoundary;
        //keeps a record of the ball's position at the last update
        this.m_vOldPos;
        //a local reference to the Walls that make up the pitch boundary

    };

    /**
     * tests to see if the ball has collided with a ball and reflects 
     * the ball's velocity accordingly
     */
    TestCollisionWithWalls( walls ) {
        //test ball against each wall, find out which is closest
        let idxClosest = -1;

        let VelNormal = Vector2D.Vec2DNormalize( this.m_vVelocity );

        let IntersectionPoint,
                CollisionPoint = new Vector2D();

        let DistToIntersection = MaxFloat;

        /**
         * iterate through each wall and calculate if the ball intersects.
         * If it does then store the index into the closest intersecting wall
         */
        for ( let w = 0; w < walls.length; ++w ) {
            //assuming a collision if the ball continued on its current heading 
            //calculate the point on the ball that would hit the wall. This is 
            //simply the wall's normal(inversed) multiplied by the ball's radius
            //and added to the balls center (its position)
            let ThisCollisionPoint = Vector2D.sub( this.Pos(), ( Vector2D.mul( walls[ w ].Normal(), this.BRadius() ) ) );

            //calculate exactly where the collision point will hit the plane    
            if ( geometry.WhereIsPoint( ThisCollisionPoint,
                    walls[ w ].From(),
                    walls[ w ].Normal() ) == geometry.span_type().plane_backside ) {
                let DistToWall = geometry.DistanceToRayPlaneIntersection( ThisCollisionPoint,
                        walls[ w ].Normal(),
                        walls[ w ].From(),
                        walls[ w ].Normal() );

                IntersectionPoint = Vector2D.add( ThisCollisionPoint, ( Vector2D.mul( DistToWall, walls[ w ].Normal() ) ) );

            } else {
                let DistToWall = geometry.DistanceToRayPlaneIntersection( ThisCollisionPoint,
                        VelNormal,
                        walls[ w ].From(),
                        walls[ w ].Normal() );

                IntersectionPoint = Vector2D.add( ThisCollisionPoint, ( Vector2D.mul( DistToWall, VelNormal ) ) );
            };

            //check to make sure the intersection point is actually on the line
            //segment
            let OnLineSegment = false;

            if ( geometry.LineIntersection2D( walls[ w ].From(),
                    walls[ w ].To(),
                    Vector2D.sub( ThisCollisionPoint, Vector2D.mul( walls[ w ].Normal(), 20.0 ) ),
                    Vector2D.add( ThisCollisionPoint, Vector2D.mul( walls[ w ].Normal(), 20.0 ) ) ) ) {

                OnLineSegment = true;
            };


            //Note, there is no test for collision with the end of a line segment

            //now check to see if the collision point is within range of the
            //velocity vector. [work in distance squared to avoid sqrt] and if it
            //is the closest hit found so far. 
            //If it is that means the ball will collide with the wall sometime
            //between this time step and the next one.
            let distSq = Vector2D.Vec2DDistanceSq( ThisCollisionPoint, IntersectionPoint );

            if ( ( distSq <= this.m_vVelocity.LengthSq() ) && ( distSq < DistToIntersection) && OnLineSegment ) {
                DistToIntersection = distSq;
                idxClosest = w;
                CollisionPoint = IntersectionPoint;
            };
        };//next wall


        //to prevent having to calculate the exact time of collision we
        //can just check if the velocity is opposite to the wall normal
        //before reflecting it. This prevents the case where there is overshoot
        //and the ball gets reflected back over the line before it has completely
        //reentered the playing area.
        if ( ( idxClosest >= 0 ) && VelNormal.Dot( walls[ idxClosest ].Normal() ) < 0 ) {
            this.m_vVelocity.Reflect( walls[ idxClosest ].Normal() );
        };
    };

    /**
     * updates the ball physics, tests for any collisions and adjusts
     * the ball's velocity accordingly
     */
    Update () {
        //keep a record of the old position so the goal::scored method
        //can utilize it for goal testing
        this.m_vOldPos = new Vector2D( this.m_vPosition );

        //Test for collisions
        this.TestCollisionWithWalls( this.m_PitchBoundary );

        //Simulate Prm.Friction. Make sure the speed is positive 
        //first though
        if ( this.m_vVelocity.LengthSq() > Prm.Friction * Prm.Friction ) {
            this.m_vVelocity.add( Vector2D.mul( Vector2D.Vec2DNormalize( this.m_vVelocity ), Prm.Friction ) );
            this.m_vPosition.add( this.m_vVelocity );

            //update heading
            this.m_vHeading = Vector2D.Vec2DNormalize( this.m_vVelocity );
        };
    };

    /**
     * Renders the ball
     */
    Render() {
        gdi.BlackBrush();

        gdi.Circle( this.m_vPosition, this.m_dBoundingRadius );

        /*
        gdi.GreenBrush();
        for (int i=0; i<IPPoints.size(); ++i)
        {
        gdi.Circle(IPPoints[i], 3);
        }
         */
    }

    //a soccer ball doesn't need to handle messages
    HandleMessage( msg ) {
        return false;
    }

    /**
     * applys a force to the ball in the direction of heading. Truncates
     * the new velocity to make sure it doesn't exceed the max allowable.
     */
    Kick( direction, force ) {
        //ensure direction is normalized
        direction.Normalize();

        //calculate the acceleration
        let acceleration = Vector2D.div( Vector2D.mul( direction, force ), this.m_dMass );

        //update the velocity
        this.m_vVelocity = acceleration;
    };

    /**
     * Given a force and a distance to cover given by two vectors, this
     * method calculates how long it will take the ball to travel between
     * the two points
     */
    TimeToCoverDistance( A,
            B,
            force ) {
        //this will be the velocity of the ball in the next time step *if*
        //the player was to make the pass. 
        let speed = force / this.m_dMass;

        //calculate the velocity at B using the equation
        //
        //  v^2 = u^2 + 2as
        //

        //first calculate s (the distance between the two positions)
        let DistanceToCover = Vector2D.Vec2DDistance( A, B );

        let term = speed * speed + 2.0 * DistanceToCover * Prm.Friction;

        //if  (u^2 + 2as) is negative it means the ball cannot reach point B.
        if ( term <= 0.0 ) {
            return -1.0;
        };

        let v = Math.sqrt( term );

        //it IS possible for the ball to reach B and we know its speed when it
        //gets there, so now it's easy to calculate the time using the equation
        //
        //    t = v-u
        //        ---
        //         a
        //
        return ( v - speed ) / Prm.Friction;
    };

    /**
     * given a time this method returns the ball position at that time in the
     *  future
     */
    FuturePosition( time ) {
        //using the equation s = ut + 1/2at^2, where s = distance, a = friction
        //u=start velocity

        //calculate the ut term, which is a vector
        let ut = Vector2D.mul( this.m_vVelocity, time );

        //calculate the 1/2at^2 term, which is scalar
        let half_a_t_squared = 0.5 * Prm.Friction * time * time;

        //turn the scalar quantity into a vector by multiplying the value with
        //the normalized velocity vector (because that gives the direction)
        let ScalarToVector = Vector2D.mul( half_a_t_squared, Vector2D.Vec2DNormalize( this.m_vVelocity ) );

        //the predicted position is the balls position plus these two terms
        return Vector2D.add( this.Pos(), ut ).add( ScalarToVector );
    };

    /**
     * this is used by players and goalkeepers to 'trap' a ball -- to stop
     * it dead. That player is then assumed to be in possession of the ball
     * and m_pOwner is adjusted accordingly
     */
    Trap() {
        this.m_vVelocity.Zero();
    }

    OldPos() {
        return new Vector2D( this.m_vOldPos );
    };

    /**
     * positions the ball at the desired location and sets the ball's velocity to
     *  zero
     */
    PlaceAtPosition( NewPos ) {
        this.m_vPosition = new Vector2D( NewPos );

        this.m_vOldPos = new Vector2D( this.m_vPosition );

        this.m_vVelocity.Zero();
    };

    /**
     *  this can be used to vary the accuracy of a player's kick. Just call it 
     *  prior to kicking the ball using the ball's position and the ball target as
     *  parameters.
     */
    static AddNoiseToKick( BallPos,  BallTarget ) {

        let displacement = ( Pi - Pi * Prm.PlayerKickingAccuracy ) * utils.RandomClamped();

        let toTarget = Vector2D.sub( BallTarget, BallPos );

        Transformation.Vec2DRotateAroundOrigin( toTarget, displacement );

        return Vector2D.add( toTarget, BallPos );
    };
};
