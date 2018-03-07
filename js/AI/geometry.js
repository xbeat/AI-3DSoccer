/**
 * Desc:   useful 2D geometry functions
 *
 */

class geometry {

    /**
     * given a plane and a ray this function determins how far along the ray 
     * an interestion occurs. Returns negative if the ray is parallel
     */
    static DistanceToRayPlaneIntersection( RayOrigin,
                                        RayHeading,
                                        PlanePoint, //any point on the plane
                                        PlaneNormal ) {

        let d = -PlaneNormal.Dot( PlanePoint );
        let numer = PlaneNormal.Dot( RayOrigin ) + d;
        let denom = PlaneNormal.Dot( RayHeading );

        // normal is parallel to vector
        if ( ( denom < 0.000001 ) && ( denom > -0.000001 ) ) {
            return ( -1.0 );
        };

        return -( numer / denom );
    };

    //------------------------- WhereIsPoint --------------------------------------
    static WhereIsPoint( point,
             PointOnPlane, //any point on the plane
             PlaneNormal) {

        let dir = Vector2D.sub( PointOnPlane, point );

        let d = dir.Dot( PlaneNormal );

        if ( d < -0.000001 ) {
            return this.span_type().plane_front;
        } else if (d > 0.000001) {
            return this.span_type().plane_backside;
        };

        return this.span_type().on_plane;
    };

    static span_type() {
        return {    
            plane_backside: "plane_backside",
            plane_front: "plane_front", 
            on_plane: "on_plane"
        };
    };

    /**
     * GetRayCircleIntersec
     */
     static GetRayCircleIntersect( RayOrigin,
                         RayHeading,
                         CircleOrigin,
                         radius ) {
        let ToCircle = Vector2D.sub( CircleOrigin, RayOrigin );
        let length = ToCircle.Length();
        let v = ToCircle.Dot( RayHeading );
        let d = radius * radius - ( length * length - v * v );

        // If there was no intersection, return -1
        if ( d < 0.0 ) {
            return ( -1.0 );
        };

        // Return the distance to the [first] intersecting point
        return ( v - Math.sqrt( d ) );
    };

    /**
     *  DoRayCircleIntersect
     */
     static DoRayCircleIntersect( RayOrigin,
                        RayHeading,
                        CircleOrigin,
                        radius ) {

        let ToCircle = Vector2D.sub( CircleOrigin, RayOrigin );
        let length = ToCircle.Length();
        let v = ToCircle.Dot( RayHeading );
        let d = radius * radius - ( length * length - v * v );

        // If there was no intersection, return -1
        return ( d < 0.0 );
    };

    /**
     *  Given a point P and a circle of radius R centered at C this function
     *  determines the two points on the circle that intersect with the 
     *  tangents from P to the circle. Returns false if P is within the circle.
     *
     *  Thanks to Dave Eberly for this one.
     */
     static GetTangentPoints( C, R, P, T1, T2 ) {
        let PmC = Vector2D.sub( P, C );
        let SqrLen = PmC.LengthSq();
        let RSqr = R * R;
        if ( SqrLen <= RSqr ) {
            // P is inside or on the circle
            return false;
        };

        let InvSqrLen = 1 / SqrLen;
        let Root = Math.sqrt( Math.abs( SqrLen - RSqr ) );

        T1.x = C.x + R * ( R * PmC.x - PmC.y * Root ) * InvSqrLen;
        T1.y = C.y + R * ( R * PmC.y + PmC.x * Root ) * InvSqrLen;
        T2.x = C.x + R * ( R * PmC.x + PmC.y * Root ) * InvSqrLen;
        T2.y = C.y + R * ( R * PmC.y - PmC.x * Root ) * InvSqrLen;

        return true;
    };

    /**
    /* given a line segment AB and a point P, this function calculates the 
    /*  perpendicular distance between them
     */
     static DistToLineSegment( A,
                        B,
                        P ) {
        //if the angle is obtuse between PA and AB is obtuse then the closest
        //vertex must be A
        let dotA = ( P.x - A.x ) * ( B.x - A.x ) + ( P.y - A.y ) * ( B.y - A.y );

        if ( dotA <= 0 ) {
            return Vector2D.Vec2DDistance( A, P );
        };

        //if the angle is obtuse between PB and AB is obtuse then the closest
        //vertex must be B
        let dotB = ( P.x - B.x ) * ( A.x - B.x ) + ( P.y - B.y ) * ( A.y - B.y );

        if ( dotB <= 0 ) {
            return Vector2D.Vec2DDistance( B, P );
        };

        //calculate the point along AB that is the closest to P
        //Vector2D Point = A + ((B - A) * dotA)/(dotA + dotB);
        let Point = add( A, ( div( mul( sub( B, A ), dotA ), ( dotA + dotB ) ) ) );

        //calculate the distance P-Point
        return Vector2D.Vec2DDistance( P, Point );
    };

    /**
     *  as above, but avoiding sqrt
     */
     static DistToLineSegmentSq( A,
                            B,
                            P ) {
        //if the angle is obtuse between PA and AB is obtuse then the closest
        //vertex must be A
        let dotA = ( P.x - A.x ) * ( B.x - A.x ) + ( P.y - A.y ) * ( B.y - A.y );

        if ( dotA <= 0 ) {
            return Vector2D.Vec2DDistanceSq( A, P );
        };

        //if the angle is obtuse between PB and AB is obtuse then the closest
        //vertex must be B
        let dotB = ( P.x - B.x ) * ( A.x - B.x ) + ( P.y - B.y ) * ( A.y - B.y );

        if ( dotB <= 0 ) {
            return Vector2D.Vec2DDistanceSq( B, P );
        };

        //calculate the point along AB that is the closest to P
        //Vector2D Point = A + ((B - A) * dotA)/(dotA + dotB);
        let Point = add( A, ( div( mul( sub( B, A ), dotA ), ( dotA + dotB ) ) ) );

        //calculate the distance P-Point
        return Vector2D.Vec2DDistanceSq( P, Point );
    };

    /**
     *	Given 2 lines in 2D space AB, CD this returns true if an 
     *	intersection occurs. !!overload function manager!!
     */

     static LineIntersection2D( A,
                        B,
                        C,
                        D,
                        dist,
                        point ){


        switch( arguments.length ) {
            case 4:
                return this.LineIntersection2D_4P( A, B, C, D );
                break;
            case 5:
                return this.LineIntersection2D_5P( A, B, C, D, dist );
                break;
            case 6:
                return this.LineIntersection2D_6P( A, B, C, D, dist, point );
                break;
            default:
                console.log( " Geometry line intersection function overload error ");
        };

     };

    /**
     *  Given 2 lines in 2D space AB, CD this returns true if an 
     *  intersection occurs.
     */
     static LineIntersection2D_4P( A,
                         B,
                         C,
                         D ) {
        let rTop = ( A.y - C.y ) * ( D.x - C.x ) - ( A.x - C.x ) * ( D.y - C.y );
        let sTop = ( A.y - C.y ) * ( B.x - A.x ) - ( A.x - C.x ) * ( B.y - A.y );

        let Bot = ( B.x - A.x ) * ( D.y - C.y ) - ( B.y - A.y ) * ( D.x - C.x );

        if ( Bot == 0 )//parallel
        {
            return false;
        }

        let invBot = 1.0 / Bot;
        let r = rTop * invBot;
        let s = sTop * invBot;

        if ( ( r > 0 ) && ( r < 1 ) && ( s > 0 ) && ( s < 1 ) ) {
            //lines intersect
            return true;
        };

        //lines do not intersect
        return false;
    };

    /**
     *  Given 2 lines in 2D space AB, CD this returns true if an 
     *  intersection occurs and sets dist to the distance the intersection
     *  occurs along AB
     */
     LineIntersection2D_5P( A,
            B,
            C,
            D,
            dist ) // double &dist
    {

        let rTop = ( A.y - C.y) * ( D.x - C.x ) - ( A.x - C.x ) * ( D.y - C.y );
        let sTop = ( A.y - C.y) * ( B.x - A.x ) - ( A.x - C.x ) * ( B.y - A.y );

        let Bot = ( B.x - A.x ) * ( D.y - C.y ) - ( B.y - A.y ) * ( D.x - C.x );


        if ( Bot == 0 )//parallel
        {
            if ( utils.isEqual( rTop, 0 ) && utils.isEqual( sTop, 0 ) ) {
                return true;
            }
            return false;
        }

        let r = rTop / Bot;
        let s = sTop / Bot;

        if ( ( r > 0 ) && ( r < 1 ) && ( s > 0 ) && ( s < 1 ) ) {
            //dist.set( Vec2DDistance( A, B ) * r );
            dist = ( Vector2D.Vec2DDistance( A, B ) * r );

            return true;
        } else {
            //dist.set(0.0);
            dist = 0.0;

            return false;
        };
    };

    /**
     *  Given 2 lines in 2D space AB, CD this returns true if an 
     *  intersection occurs and sets dist to the distance the intersection
     *  occurs along AB. Also sets the 2d vector point to the point of
     *  intersection
     */
     LineIntersection2D_6P( A,
                        B,
                        C,
                        D,
                        dist,
                        point ) {

        let rTop = ( A.y - C.y ) * ( D.x - C.x ) - ( A.x - C.x ) * ( D.y - C.y );
        let rBot = ( B.x - A.x ) * ( D.y - C.y ) - ( B.y - A.y ) * ( D.x - C.x );

        let sTop = ( A.y - C.y ) * ( B.x - A.x ) - ( A.x - C.x ) * ( B.y - A.y );
        let sBot = ( B.x - A.x ) * ( D.y - C.y ) - ( B.y - A.y ) * ( D.x - C.x );

        if ( ( rBot == 0 ) || ( sBot == 0 ) ) {
            //lines are parallel
            return false;
        };

        let r = rTop / rBot;
        let s = sTop / sBot;

        if ( ( r > 0 ) && ( r < 1 ) && ( s > 0 ) && ( s < 1 ) ) {
            //dist.set( Vector2D.Vec2DDistance( A, B ) * r );
            dist = ( Vector2D.Vec2DDistance( A, B ) * r );

            point.set( Vector2D.add( A, Vector2D.mul( r, Vector2D.sub( B, A ) ) ) );

            return true;
        } else {
            //dist.set( 0.0 );
            dist =  0.0;

            return false;
        };
    };

    /**
     *  tests two polygons for intersection. *Does not check for enclosure*
     */
     static ObjectIntersection2D( object1,
             object2 ) {
        //test each line segment of object1 against each segment of object2
        for ( let r = 0; r < object1.size() - 1; ++r ) {
            for ( let t = 0; t < object2.size() - 1; ++t ) {
                if ( LineIntersection2D( object2.get( t ),
                        object2.get( t + 1 ),
                        object1.get( r ),
                        object1.get( r + 1 ) ) ) {
                    return true;
                };
            };
        };

        return false;
    };

    /**
     *  tests a line segment against a polygon for intersection
     *  *Does not check for enclosure*
     */
     static SegmentObjectIntersection2D( A,
             B,
             object ) {
        //test AB against each segment of object
        for ( let r = 0; r < object.size() - 1; ++r ) {
            if ( LineIntersection2D( A, B, object.get( r ), object.get( r + 1 ) ) ) {
                return true;
            };
        };

        return false;
    };

     static TwoCirclesOverlapped( A,
                        B,
                        C,
                        D,
                        E,
                        F ){


        switch( arguments.length ) {
            case 4:
                return this.TwoCirclesOverlapped_4P( A, B, C, D );
                break;
            case 6:
                return this.TwoCirclesOverlapped_6P( A, B, C, D, E, F );
                break;
            default:
                console.log( " Geometry line intersection function overload error ");
        };

     };

    /**
     *  Returns true if the two circles overlap
     */
    static TwoCirclesOverlapped_6P( x1,  y1, r1,
             x2,  y2, r2 ) {
        let DistBetweenCenters = Math.sqrt( ( x1 - x2 ) * ( x1 - x2 )
                + ( y1 - y2 ) * ( y1 - y2 ) );

        if ( ( DistBetweenCenters < ( r1 + r2 ) ) || ( DistBetweenCenters < Math.abs( r1 - r2 ) ) ) {
            return true;
        };

        return false;
    };

    /**
     * Returns true if the two circles overlap
     */
     static TwoCirclesOverlapped_4P( c1, r1,
            c2, r2 ) {
        let DistBetweenCenters = Math.sqrt( ( c1.x - c2.x ) * ( c1.x - c2.x )
                + ( c1.y - c2.y ) * ( c1.y - c2.y ) );

        if ( ( DistBetweenCenters < ( r1 + r2 ) ) || ( DistBetweenCenters < Math.abs( r1 - r2 ) ) ) {
            return true;
        };

        return false;
    };

    /**
     *  returns true if one circle encloses the other
     */
     static TwoCirclesEnclosed( x1, y1, r1,
                            x2, y2, r2 ) {
        let DistBetweenCenters = Math.sqrt( ( x1 - x2 ) * ( x1 - x2 )
                + ( y1 - y2 ) * ( y1 - y2 ) );

        if ( DistBetweenCenters < Math.abs( r1 - r2 ) ) {
            return true;
        };

        return false;
    };

    /**
     * Given two circles this function calculates the intersection points
     *  of any overlap.
     *
     *  returns false if no overlap found
     *
     * see http://astronomy.swin.edu.au/~pbourke/geometry/2circle/
     */
     static TwoCirclesIntersectionPoints( x1, y1, r1,
            x2, y2, r2,
            p3X, p3Y,
            p4X, p4Y ) {
        //first check to see if they overlap
        if ( !TwoCirclesOverlapped( x1, y1, r1, x2, y2, r2 ) ) {
            return false;
        };

        //calculate the distance between the circle centers
        let d = Math.sqrt( ( x1 - x2 ) * ( x1 - x2 ) + ( y1 - y2 ) * ( y1 - y2 ) );

        //Now calculate the distance from the center of each circle to the center
        //of the line which connects the intersection points.
        let a = ( r1 - r2 + ( d * d ) ) / ( 2 * d );
        let b = ( r2 - r1 + ( d * d ) ) / ( 2 * d );


        //MAYBE A TEST FOR EXACT OVERLAP? 

        //calculate the point P2 which is the center of the line which 
        //connects the intersection points
        let p2X, p2Y;

        p2X = x1 + a * ( x2 - x1 ) / d;
        p2Y = y1 + a * ( y2 - y1 ) / d;

        //calculate first point
        let h1 = Math.sqrt( ( r1 * r1 ) - ( a * a ) );

        //p3X.set( p2X - h1 * ( y2 - y1 ) / d );
        //p3Y.set( p2Y + h1 * ( x2 - x1 ) / d );

        p3X = ( p2X - h1 * ( y2 - y1 ) / d );
        p3Y = ( p2Y + h1 * ( x2 - x1 ) / d );

        //calculate second point
        let h2 = Math.sqrt( ( r2 * r2 ) - ( a * a ) );

        //p4X.set( p2X + h2 * ( y2 - y1 ) / d );
        //p4Y.set( p2Y - h2 * ( x2 - x1 ) / d );

        p4X = ( p2X + h2 * ( y2 - y1 ) / d );
        p4Y = ( p2Y - h2 * ( x2 - x1 ) / d );

        return true;

    };

    /**
     *  Tests to see if two circles overlap and if so calculates the area
     *  defined by the union
     *
     * see http://mathforum.org/library/drmath/view/54785.html
     */
     static TwoCirclesIntersectionArea( x1, y1, r1,
            x2, y2, r2 ) {
        //first calculate the intersection points
        let iX1 = 0.0, iY1 = 0.0, iX2 = 0.0, iY2 = 0.0;

        if ( !TwoCirclesIntersectionPoints (x1, y1, r1, x2, y2, r2,
                iX1, iY1, iX2, iY2 ) ) {
            return 0.0; //no overlap
        };

        //calculate the distance between the circle centers
        let d = Math.sqrt( ( x1 - x2 ) * ( x1 - x2 ) + ( y1 - y2 ) * ( y1 - y2 ) );

        //find the angles given that A and B are the two circle centers
        //and C and D are the intersection points
        let CBD = 2 * Math.acos( ( r2 * r2 + d * d - r1 * r1 ) / ( r2 * d * 2 ) );

        let CAD = 2 * Math.acos( ( r1 * r1 + d * d - r2 * r2 ) / ( r1 * d * 2 ) );


        //Then we find the segment of each of the circles cut off by the 
        //chord CD, by taking the area of the sector of the circle BCD and
        //subtracting the area of triangle BCD. Similarly we find the area
        //of the sector ACD and subtract the area of triangle ACD.

        let area = 0.5 * CBD * r2 * r2 - 0.5 * r2 * r2 * Math.sin( CBD )
                + 0.5 * CAD * r1 * r1 - 0.5 * r1 * r1 * Math.sin( CAD );

        return area;
    };

    /**
     *  given the radius, calculates the area of a circle
     */
     static CircleArea( radius ) {
        let pi = 3.14159;// Math.PI
        return pi * radius * radius;
    };

    /**
     *  returns true if the point p is within the radius of the given circle
     */
    static PointInCircle( Pos,
             radius,
             p) {
        let DistFromCenterSquared = ( sub( p, Pos ) ).LengthSq();

        if ( DistFromCenterSquared < ( radius * radius ) ) {
            return true;
        };

        return false;
    };

    /**
     * returns true if the line segemnt AB intersects with a circle at
     *  position P with radius radius
     */
    static LineSegmentCircleIntersection( A,
             B,
             P,
             radius ) {
        //first determine the distance from the center of the circle to
        //the line segment (working in distance squared space)
        let DistToLineSq = this.DistToLineSegmentSq( A, B, P );

        if ( DistToLineSq < radius * radius ) {
            return true;
        } else {
            return false;
        };
    };

    /**
     *  given a line segment AB and a circle position and radius, this function
     *  determines if there is an intersection and stores the position of the 
     *  closest intersection in the reference IntersectionPoint
     *
     *  returns false if no intersection point is found
     */
     static GetLineSegmentCircleClosestIntersectionPoint( A,
             B,
             pos,
             radius,
             IntersectionPoint ) {
        let toBNorm = Vector2D.Vec2DNormalize( Vector2D.sub( B, A ) );

        //move the circle into the local space defined by the vector B-A with origin
        //at A
        let LocalPos = Transformation.PointToLocalSpace( pos, toBNorm, toBNorm.Perp(), A );

        let ipFound = false;

        //if the local position + the radius is negative then the circle lays behind
        //point A so there is no intersection possible. If the local x pos minus the 
        //radius is greater than length A-B then the circle cannot intersect the 
        //line segment
        if ( ( LocalPos.x + radius >= 0 )
                && ( ( LocalPos.x - radius ) * ( LocalPos.x - radius ) <= Vector2D.Vec2DDistanceSq( B, A ) ) ) {
            //if the distance from the x axis to the object's position is less
            //than its radius then there is a potential intersection.
            if ( Math.abs( LocalPos.y ) < radius ) {
                //now to do a line/circle intersection test. The center of the 
                //circle is represented by A, B. The intersection points are 
                //given by the formulae x = A +/-sqrt(r^2-B^2), y=0. We only 
                //need to look at the smallest positive value of x.
                let a = LocalPos.x;
                let b = LocalPos.y;

                let ip = a - Math.sqrt( radius * radius - b * b );

                if ( ip <= 0 ) {
                    ip = a + Math.sqrt( radius * radius - b * b );
                };

                ipFound = true;

                IntersectionPoint.set( Vector2D.add( A, Vector2D.mul( toBNorm, ip ) ) );
            };
        };

        return ipFound;
    };
};