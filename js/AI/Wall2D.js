/**
 * 
 *  Desc:   class to create and render 2D walls. Defined as the two 
 *          vectors A - B with a perpendicular normal. 
 *
 */

class Wall2D {

    CalculateNormal() {
        let temp = Vector2D.Vec2DNormalize( Vector2D.sub( this.m_vB, this.m_vA ) );

        this.m_vN.x = -temp.y;
        this.m_vN.y = temp.x;
    };

    constructor( A, B, N ) {
        if ( N === undefined ){

            this.m_vA = A;
            this.m_vB = B;
            this.m_vN = new Vector2D( 0, 0);

            this.CalculateNormal();

        } else {
            this.m_vA = A;
            this.m_vB = B;
            this.m_vN = N;
        };

    };

    Render( RenderNormals = false ) {
        gdi.Line( this.m_vA.x, this.m_vA.y, this.m_vB.x, this.m_vB.y );

        //render the normals if rqd
        if ( RenderNormals ) {
            let MidX = ( ( this.m_vA.x + this.m_vB.x ) / 2 );
            let MidY = ( ( this.m_vA.y + this.m_vB.y ) / 2 );

            gdi.Line( MidX, MidY, ( MidX + ( this.m_vN.x * 5 ) ), ( this.MidY + ( this.m_vN.y * 5 ) ) );
        };
    };

    From() {
        return this.m_vA;
    };

    SetFrom( v ) {
        this.m_vA = v;
        CalculateNormal();
    };

    To() {
        return this.m_vB;
    };

    SetTo( v ) {
        this.m_vB = v;
        CalculateNormal();
    };

    Normal() {
        return this.m_vN;
    };

    SetNormal( n ) {
        this.m_vN = n;
    };

    Center() {
        return div( add( this.m_vA, this.m_vB ), 2.0 );
    };

};