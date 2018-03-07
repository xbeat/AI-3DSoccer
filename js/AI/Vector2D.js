/**
 *   2D vector struct
 *   Vector2D
 */

class POINT {

    constructor( a = 0.0, b = 0.0 ) {
        this.x = a;
        this.y = b;
    };
};

class Vector2D {

    constructor( a = 0.0, b = 0.0 ) {

        if ( typeof a  === 'object' ){
            this.x = a.x;
            this.y = a.y;
        } else {
            this.x = a;
            this.y = b;
        };    
    };

    //Vector2D( v ) {        
    //    this.set(v);
    //};

    set( v ) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    
    //sets x and y to zero
    Zero() {
        this.x = 0.0;
        this.y = 0.0;
    };

    //returns true if both x and y are zero
    isZero() {
        return ( this.x * this.x + this.y * this.y ) < MinDouble;
    };

    /**
     *   returns the length of a 2D vector
     */
    Length() {
        return Math.sqrt( this.x * this.x + this.y * this.y );
    };

    //returns the squared length of the vector (thereby avoiding the sqrt)
    LengthSq() {
        return ( this.x * this.x + this.y * this.y );
    };

    /**
     *   normalizes a 2D Vector
     */
    Normalize() {
        let vector_length = this.Length();

        if ( vector_length > EpsilonDouble ) {
            this.x /= vector_length;
            this.y /= vector_length;
        };
    };

    /**
     * calculates the dot product
     * @param v2
     * @return  dot product
     */
    Dot( v2 ) {
        return this.x * v2.x + this.y * v2.y;
    };

    /**
    /* returns positive if v2 is clockwise of this vector,
    /* negative if anticlockwise (assuming the Y axis is pointing down,
    /* X axis to right like a Window app)
     */
    Sign( v2 ) {

        let clockwise = 1;
        let anticlockwise = -1;

        if ( this.y * v2.x > this.x * v2.y ) {
            return anticlockwise;
        } else {
            return clockwise;
        };
    };

    /**
     * returns the vector that is perpendicular to this one.
     */
    Perp() {
        return new Vector2D( -this.y, this.x );
    };

    /**
     * adjusts x and y so that the length of the vector does not exceed max
     * truncates a vector so that its length does not exceed max
     * @param max 
     */
    Truncate( max ) {

        if ( this.Length() > max ) {
            this.Normalize();
            this.mul(max);
        };
    };

    /**
     * calculates the euclidean distance between two vectors
     * 
     * @param v2
     * @return the distance between this vector and th one passed as a parameter
     */
    Distance( v2 ) {
        let ySeparation = v2.y - this.y;
        let xSeparation = v2.x - this.x;

        return Math.sqrt( ySeparation * ySeparation + xSeparation * xSeparation );
    };

    /** 
     * squared version of distance.
     * calculates the euclidean distance squared between two vectors 
     * @param v2
     * @return 
     */
    DistanceSq( v2 ) {
        let ySeparation = v2.y - this.y;
        let xSeparation = v2.x - this.x;

        return ySeparation * ySeparation + xSeparation * xSeparation;
    };

    /**
     *  given a normalized vector this method reflects the vector it
     *  is operating upon. (like the path of a ball bouncing off a wall)
     * @param norm 
     */
    Reflect( norm ) {
        this.add( norm.GetReverse().mul( 2.0 * this.Dot( norm ) ) );
    };

    /**
     * @return the vector that is the reverse of this vector 
     */
    GetReverse() {
        return new Vector2D( -this.x, -this.y );
    };

    //we need some overloaded operators
    add( rhs ) {
        this.x += rhs.x;
        this.y += rhs.y;

        return this;
    };

    sub( rhs ) {
        this.x -= rhs.x;
        this.y -= rhs.y;

        return this;
    };

    mul( rhs ) {
        this.x *= rhs;
        this.y *= rhs;

        return this;
    };

    div( rhs ) {
        this.x /= rhs;
        this.y /= rhs;

        return this;
    };

    static isEqual( rhs ) {
        return ( utils.isEqual( this.x, rhs.x ) && utils.isEqual( this.y, rhs.y ) );
    };
    // operator !=

    static notEqual( rhs ) {
        return ( this.x != rhs.x ) || ( this.y != rhs.y );
    };

    //------------------------------------------------------------------------some more operator overloads
    /*
    static mul( lhs,  rhs ) {
        let result = new Vector2D( lhs );
        result.mul( rhs );
        return result;
    };

    static mul( lhs, rhs ) {
        let result = new Vector2D( rhs );
        result.mul( lhs );
        return result;
    };
    */

    static mul( lhs, rhs ) {
        if ( typeof lhs  === 'object' ){

            let result = new Vector2D( lhs );
            result.mul( rhs );
            return result;

        } else {

            let result = new Vector2D( rhs );
            result.mul( lhs );
            return result;

        }; 
    };

    //overload the - operator
    static sub( lhs,  rhs ) {
        let result = new Vector2D( lhs );
        result.x -= rhs.x;
        result.y -= rhs.y;

        return result;
    };

    //overload the + operator
    static add( lhs,  rhs ) {
        let result = new Vector2D( lhs );
        result.x += rhs.x;
        result.y += rhs.y;

        return result;
    };

    //overload the / operator
    static div( lhs,  val ) {
        let result = new Vector2D( lhs );
        result.x /= val;
        result.y /= val;

        return result;
    };

    //std::ostream& operator<<(std::ostream& os, const Vector2D& rhs)
    //toString() {
        //return " " + ttos( this.x, 2 ) + " " + ttos( this.y, 2 );
    //    return " " + parseFloat( this.x ).toFixed( 2 ) + " " + parseFloat( this.y ).toFixed( 2 );
    //};

    //------------------------------------------------------------------------non member functions
    static Vec2DNormalize( v ) {
        let vec = new Vector2D( v );

        let vector_length = vec.Length();

        if ( vector_length > EpsilonDouble ) {
            vec.x /= vector_length;
            vec.y /= vector_length;
        };

        return vec;
    };

    static Vec2DDistance( v1,  v2 ) {

        let ySeparation = v2.y - v1.y;
        let xSeparation = v2.x - v1.x;

        return Math.sqrt( ySeparation * ySeparation + xSeparation * xSeparation );
    };

    static Vec2DDistanceSq( v1,  v2 ) {

        let ySeparation = v2.y - v1.y;
        let xSeparation = v2.x - v1.x;

        return ySeparation * ySeparation + xSeparation * xSeparation;
    };

    static Vec2DLength( v ) {
        return Math.sqrt( v.x * v.x + v.y * v.y );
    };

    static Vec2DLengthSq( v ) {
        return ( v.x * v.x + v.y * v.y );
    };

    static POINTStoVector( p ) {
        return new Vector2D( p.x, p.y );
    };

    static POINTtoVector( p ) {
        return new Vector2D( p.x, p.y );
    };

    static VectorToPOINTS( v ) {
        let p = new POINT();
        p.x = v.x;
        p.y = v.y;

        return p;
    };

    static VectorToPOINT( v ) {
        let p = new POINT();
        p.x = v.x;
        p.y = v.y;

        return p;
    };

    ///////////////////////////////////////////////////////////////////////////////
    //treats a window as a toroid
    static WrapAround( pos, MaxX, MaxY ) {
        if ( pos.x > MaxX ) {
            pos.x = 0.0;
        };

        if ( pos.x < 0 ) {
            pos.x = MaxX;
        };

        if ( pos.y < 0 ) {
            pos.y = MaxY;
        };

        if ( pos.y > MaxY ) {
            pos.y = 0.0;
        };
    };

    /**
     * returns true if the point p is not inside the region defined by top_left
     * and bot_rgt
     * @param p
     * @param top_left
     * @param bot_rgt
     * @return 
     */
    static NotInsideRegion( p,
                    top_left,
                    bot_rgt ) {
        return ( p.x < top_left.x) || ( p.x > bot_rgt.x )
                || ( p.y < top_left.y ) || ( p.y > bot_rgt.y );
    };

    static InsideRegion( A,
                        B,
                        C,
                        D ){

        switch( arguments.length ) {
            case 3:
                return this.InsideRegion_3P( A, B, C );
                break;
            case 4:
                return this.InsideRegion_4P( A, B, C, D );
                break;
            default:
                console.log( " InsideRegion function overload error ");
        };

    };

    static InsideRegion_3P( p,
            top_left,
            bot_rgt ) {
        return !( ( p.x < top_left.x ) || ( p.x > bot_rgt.x )
                || ( p.y < top_left.y ) || ( p.y > bot_rgt.y ) );
    };

    static InsideRegion_4P( p, left, top, right, bottom ) {
        return !( ( p.x < left ) || ( p.x > right ) || ( p.y < top ) || ( p.y > bottom ) );
    };

    /**
    * @return true if the target position is in the field of view of the entity
    *         positioned at posFirst facing in facingFirst
    */
    static isSecondInFOVOfFirst( posFirst,
                    facingFirst,
                    posSecond,
                    fov) {
        let toTarget = Vec2DNormalize( sub( posSecond, posFirst ) );
        return facingFirst.Dot( toTarget ) >= Math.cos( fov / 2.0 );
    };
};