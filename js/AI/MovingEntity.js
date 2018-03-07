/**
 *  Desc:   A base class defining an entity that moves. The entity has 
 *          a local coordinate system and members for defining its
 *          mass and velocity.
 * 
 */

class MovingEntity extends BaseGameEntity {

    constructor( position,
            radius,
            velocity,
            max_speed,
            heading,
            mass,
            scale,
            turn_rate,
            max_force ) {

        super( BaseGameEntity.GetNextValidID() );

        this.m_vHeading = new Vector2D( heading );
        this.m_vVelocity = new Vector2D( velocity );
        this.m_dMass = mass;
        this.m_vSide = this.m_vHeading.Perp();
        this.m_dMaxSpeed = max_speed;
        this.m_dMaxTurnRate = turn_rate;
        this.m_dMaxForce = max_force;
        
        this.m_vPosition = new Vector2D( position );
        this.m_dBoundingRadius = radius; 
        this.m_vScale = new Vector2D( scale );
    };

    finalize() {
        super.finalize();
    };

    //accessors
    Velocity() {
        return new Vector2D( this.m_vVelocity );
    };

    SetVelocity( NewVel ) {
        this.m_vVelocity = NewVel;
    };

    Mass() {
        return this.m_dMass;
    };

    Side() {
        return this.m_vSide;
    };

    MaxSpeed() {
        return this.m_dMaxSpeed;
    };

    SetMaxSpeed( new_speed ) {
        this.m_dMaxSpeed = new_speed;
    };

    MaxForce() {
        return this.m_dMaxForce;
    };

    SetMaxForce( mf ) {
        this.m_dMaxForce = mf;
    };

    IsSpeedMaxedOut() {
        return this.m_dMaxSpeed * this.m_dMaxSpeed >= this.m_vVelocity.LengthSq();
    };

    Speed() {
        return this.m_vVelocity.Length();
    };

    SpeedSq() {
        return this.m_vVelocity.LengthSq();
    };

    Heading() {
        return this.m_vHeading;
    };

    MaxTurnRate() {
        return this.m_dMaxTurnRate;
    };

    SetMaxTurnRate( val ) {
        this.m_dMaxTurnRate = val;
    };

    /**
     *  given a target position, this method rotates the entity's heading and
     *  side vectors by an amount not greater than m_dMaxTurnRate until it
     *  directly faces the target.
     *
     *  @return true when the heading is facing in the desired direction
     */
    RotateHeadingToFacePosition( target ) {
        let toTarget = Vector2D.Vec2DNormalize( Vector2D.sub( target, this.m_vPosition ) );

        //first determine the angle between the heading vector and the target
        let angle = Math.acos( this.m_vHeading.Dot( toTarget ) );
        
        //sometimes m_vHeading.Dot(toTarget) == 1.000000002
        if( Number.isNaN( angle ) ) { 
            angle = 0;
        };
        //return true if the player is facing the target
        if ( angle < 0.00001 ) {
            return true;
        };

        //clamp the amount to turn to the max turn rate
        if ( angle > this.m_dMaxTurnRate ) {
            angle = this.m_dMaxTurnRate;
        };

        //The next few lines use a rotation matrix to rotate the player's heading
        //vector accordingly
        let RotationMatrix = new C2DMatrix();

        //notice how the direction of rotation has to be determined when creating
        //the rotation matrix
        RotationMatrix.Rotate( angle * this.m_vHeading.Sign( toTarget ) );
        RotationMatrix.TransformVector2Ds( this.m_vHeading );
        RotationMatrix.TransformVector2Ds( this.m_vVelocity );

        //finally recreate m_vSide
        this.m_vSide = this.m_vHeading.Perp();

        return false;
    };

    /**
     *  first checks that the given heading is not a vector of zero length. If the
     *  new heading is valid this fumction sets the entity's heading and side 
     *  vectors accordingly
     */
    SetHeading( new_heading ) {
        assert ( ( new_heading.LengthSq() - 1.0 ) < 0.00001 );

        this.m_vHeading = new_heading;

        //the side vector must always be perpendicular to the heading
        this.m_vSide = m_vHeading.Perp();
    };
};