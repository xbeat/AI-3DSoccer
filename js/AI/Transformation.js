/**
 *  Desc:   Functions for converting 2D vectors between World and Local
 *          space.
 *
 */

class Transformation {
    //--------------------------- WorldTransform -----------------------------
    //
    //  given a std::vector of 2D vectors, a position, orientation and scale,
    //  this function transforms the 2D vectors into the object's world space
    //------------------------------------------------------------------------
     static WorldTransform( A,
                        B,
                        C,
                        D,
                        scale ){


        switch( arguments.length ) {
            case 4:
                return this.WorldTransform_4P( A, B, C, D );
                break;
            case 5:
                return this.WorldTransform_5P( A, B, C, D, scale );
                break;
            default:
                console.log( " WorldTransform function overload error ");
        };

     };

    static WorldTransform_5P( points,
            pos,
            forward,
            side,
            scale = new Vector2D( 1.0, 1.0 ) ) {
        //copy the original vertices into the buffer about to be transformed
        let TranVector2Ds = CppToJava.clone( points );

        //create a transformation matrix
        let matTransform = new C2DMatrix();

        //scale
        if ( ( scale.x != 1.0 ) || ( scale.y != 1.0 ) ) {
            matTransform.Scale( scale.x, scale.y );
        }

        //rotate
        matTransform.Rotate( forward, side );

        //and translate
        matTransform.Translate( pos.x, pos.y );

        //now transform the object's vertices
        matTransform.TransformVector2Ds( TranVector2Ds );

        return TranVector2Ds;
    };

    /**
    *  given a std::vector of 2D vectors, a position and  orientation
    *  this function transforms the 2D vectors into the object's world space
    */
    static WorldTransform_4P( points,
            pos,
            forward,
            side ) {
        //copy the original vertices into the buffer about to be transformed
        let TranVector2Ds = CppToJava.clone( points );
        
        //for( Vector2D v: points ) {
        //    TranVector2Ds.add( v );
        //};

        for ( let i = 0, len = points.length; i < len; i++ ) {
            TranVector2Ds.push( points[i] );
        };

        //create a transformation matrix
        let matTransform = new C2DMatrix();

        //rotate
        matTransform.Rotate( forward, side );

        //and translate
        matTransform.Translate( pos.x, pos.y );

        //now transform the object's vertices
        matTransform.TransformVector2Ds( TranVector2Ds );

        return TranVector2Ds;
    };

    //--------------------- PointToWorldSpace --------------------------------
    //
    //  Transforms a point from the agent's local space into world space
    //------------------------------------------------------------------------
    static PointToWorldSpace( point,
                        AgentHeading,
                        AgentSide,
                        AgentPosition ) {
        //make a copy of the point
        let TransPoint = new Vector2D( point );

        //create a transformation matrix
        let matTransform = new C2DMatrix();

        //rotate
        matTransform.Rotate( AgentHeading, AgentSide );

        //and translate
        matTransform.Translate(AgentPosition.x, AgentPosition.y);

        //now transform the vertices
        matTransform.TransformVector2Ds(TransPoint);

        return TransPoint;
    };

    //--------------------- VectorToWorldSpace --------------------------------
    //
    //  Transforms a vector from the agent's local space into world space
    //------------------------------------------------------------------------
    static VectorToWorldSpace( vec,
                        AgentHeading,
                        AgentSide ) {
        //make a copy of the point
        let TransVec = new Vector2D( vec );

        //create a transformation matrix
        let matTransform = new C2DMatrix();

        //rotate 
        matTransform.Rotate( AgentHeading, AgentSide );

        //now transform the vertices
        matTransform.TransformVector2Ds( TransVec );

        return TransVec;
    };

    //--------------------- PointToLocalSpace --------------------------------
    //
    //------------------------------------------------------------------------
    static PointToLocalSpace( point,
                        AgentHeading,
                        AgentSide,
                        AgentPosition ) {

        //make a copy of the point
        let TransPoint = new Vector2D( point );

        //create a transformation matrix
        let matTransform = new C2DMatrix();

        let Tx = -AgentPosition.Dot( AgentHeading );
        let Ty = -AgentPosition.Dot( AgentSide );

        //create the transformation matrix
        matTransform._11( AgentHeading.x );   matTransform._12( AgentSide.x );
        matTransform._21( AgentHeading.y );   matTransform._22( AgentSide.y );
        matTransform._31( Tx );               matTransform._32( Ty );

        //now transform the vertices
        matTransform.TransformVector2Ds( TransPoint );

        return TransPoint;
    };

    //--------------------- VectorToLocalSpace --------------------------------
    //
    //------------------------------------------------------------------------
    static VectorToLocalSpace( vec,
                        AgentHeading,
                        AgentSide ) {

        //make a copy of the point
        let TransPoint = new Vector2D(vec);

        //create a transformation matrix
        let matTransform = new C2DMatrix();

        //create the transformation matrix
        matTransform._11( AgentHeading.x );   matTransform._12( AgentSide.x );
        matTransform._21( AgentHeading.y );   matTransform._22( AgentSide.y );

        //now transform the vertices
        matTransform.TransformVector2Ds( TransPoint );

        return TransPoint;
    };

    //-------------------------- Vec2DRotateAroundOrigin --------------------------
    //
    //  rotates a vector ang rads around the origin
    //-----------------------------------------------------------------------------
    static Vec2DRotateAroundOrigin( v, ang ) {
        //create a transformation matrix
        let mat = new C2DMatrix();

        //rotate
        mat.Rotate( ang );

        //now transform the object's vertices
        mat.TransformVector2Ds( v );
    };

    //------------------------ CreateWhiskers ------------------------------------
    //
    //  given an origin, a facing direction, a 'field of view' describing the 
    //  limit of the outer whiskers, a whisker length and the number of whiskers
    //  this method returns a vector containing the end positions of a series
    //  of whiskers radiating away from the origin and with equal distance between
    //  them. (like the spokes of a wheel clipped to a specific segment size)
    //----------------------------------------------------------------------------
    static CreateWhiskers( NumWhiskers,
            WhiskerLength,
            fov,
            facing,
            origin ) {
        //this is the magnitude of the angle separating each whisker
        let SectorSize = fov / (double) (NumWhiskers - 1);

        let whiskers = new Array( NumWhiskers );
        let temp;
        let angle = -fov * 0.5;

        for ( let w = 0; w < NumWhiskers; ++w ) {
            //create the whisker extending outwards at this angle
            temp = facing;
            Vec2DRotateAroundOrigin( temp, angle );
            whiskers.add( add( origin, mul( WhiskerLength, temp ) ) );

            angle += SectorSize;
        };

        return whiskers;
    };
};