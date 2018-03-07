/**
 * InvertedAABBox2D.js
 */

class InvertedAABBox2D {

    constructor( tl,  br ) {
        this.m_vTopLeft = tl;
        this.m_vBottomRight = br;
        this.m_vCenter = add( tl, br ).div( 2.0 );
    }

    //returns true if the bbox described by other intersects with this one
    isOverlappedWith( other ) {
        return !(( other.Top() > this.Bottom() )
                || ( other.Bottom() < this.Top() )
                || ( other.Left() > this.Right() )
                || ( other.Right() < this.Left()) );
    };

    TopLeft() {
        return this.m_vTopLeft;
    };

    BottomRight() {
        return this.m_vBottomRight;
    };

    Top() {
        return this.m_vTopLeft.y;
    };

    Left() {
        return this.m_vTopLeft.x;
    };

    Bottom() {
        return this.m_vBottomRight.y;
    };

    Right() {
        return this.m_vBottomRight.x;
    };

    Center() {
        return this.m_vCenter;
    };

    //Render() {
    //    Render( false );
    //};

    Render( RenderCenter ) {
        gdi.Line( Left(), Top(), Right(), Top() );
        gdi.Line( Left(), Bottom(), Right(), Bottom() );
        gdi.Line( Left(), Top(), Left(), Bottom() );
        gdi.Line( Right(), Top(), Right(), Bottom() );

        if ( RenderCenter ) {
            gdi.Circle( this.m_vCenter, 5 );
        };
    };
};