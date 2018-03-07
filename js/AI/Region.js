/**
 *  Desc:   Defines a rectangular region. A region has an identifying
 *          number, and four corners.
 * 
 * Region.js
 */

class Region {

    constructor( left,
            top,
            right,
            bottom,
            id ) {
      
        this.m_dTop = top;
        this.m_dRight = right;
        this.m_dLeft = left;
        this.m_dBottom = bottom;
        this.m_iID = id;

        //calculate center of region
        this.m_vCenter = new Vector2D( ( left + right ) * 0.5, ( top + bottom ) * 0.5 );

        this.m_dWidth = Math.abs( right - left );
        this.m_dHeight = Math.abs( bottom - top );
    };

    static region_modifier() {
        return {
            halfsize: "halfsize",
            normal: "normal"
        };
    };

    Render( ShowID ) {
        gdi.HollowBrush();
        gdi.LightGreyPen();
        gdi.Rect( this.m_dLeft, this.m_dTop, this.m_dRight, this.m_dBottom );

        if ( ShowID ) {
            gdi.TextColor( 250, 250, 250 );
            gdi.TextAtPos( this.Center(), ttos( this.ID() ) );
        };
    };

    /**
     * returns true if the given position lays inside the region. The
     * region modifier can be used to contract the region bounderies
     */
    //Inside( pos ) {
    //    return Inside( pos, Region.region_modifier().normal );
    //};

    Inside( pos, r = Region.region_modifier().normal  ) {
        if ( r == Region.region_modifier().normal ) {
            return ( ( pos.x > this.m_dLeft ) && ( pos.x < this.m_dRight )
                    && (pos.y > this.m_dTop ) && ( pos.y < this.m_dBottom ) );
        } else {
            let marginX = this.m_dWidth * 0.25;
            let marginY = this.m_dHeight * 0.25;

            return ( ( pos.x > ( this.m_dLeft + marginX ) ) && ( pos.x < ( this.m_dRight - marginX ) )
                    && ( pos.y > ( this.m_dTop + marginY ) ) && ( pos.y < ( this.m_dBottom - marginY ) ) );
        };
    };

    /** 
     * @return a vector representing a random location
     *          within the region
     */
    GetRandomPosition() {
        return new Vector2D( RandInRange( this.m_dLeft, this.m_dRight ),
                RandInRange( this.m_dTop, m_dBottom ) );
    };

    //-------------------------------
    Top() {
        return this.m_dTop;
    };

    Bottom() {
        return this.m_dBottom;
    };

    Left() {
        return this.m_dLeft;
    };

    Right() {
        return this.m_dRight;
    };

    Width() {
        return Math.abs( this.m_dRight - this.m_dLeft );
    };

    Height() {
        return Math.abs( this.m_dTop - this.m_dBottom );
    };

    Length() {
        return Math.max( this.Width(), this.Height() );
    };

    Breadth() {
        return Math.min( this.Width(), this.Height() );
    };

    Center() {
        return new Vector2D( this.m_vCenter );
    };

    ID() {
        return this.m_iID;
    };
};