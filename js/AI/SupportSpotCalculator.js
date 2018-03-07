/**
 *  Desc:   Class to determine the best spots for a supporting soccer
 *          player to move to.
 * 
 */

//------------------------------------------------------------------------
class SupportSpotCalculator {

    //------------------------------- ctor ----------------------------------------
    //-----------------------------------------------------------------------------
    constructor( numX,
                numY,
                team ) {

        this.m_pBestSupportingSpot = null;
        this.m_pTeam = team;
        let PlayingField = team.Pitch().PlayingArea();

        //a data structure to hold the values and positions of each spot
        this.SupportSpot = function ( pos, value ) {
            this.m_vPos = new Vector2D( pos );
            this.m_dScore = value;
        };        

        this.m_Spots = new Array();
        //a pointer to the highest valued spot from the last update
        //this will regulate how often the spots are calculated (default is
        //one update per second)
        this.m_pRegulator;

        //calculate the positions of each sweet spot, create them and 
        //store them in m_Spots
        let HeightOfSSRegion = PlayingField.Height() * 0.8;
        let WidthOfSSRegion = PlayingField.Width() * 0.9;
        let SliceX = WidthOfSSRegion / numX;
        let SliceY = HeightOfSSRegion / numY;

        let left = PlayingField.Left() + ( PlayingField.Width() - WidthOfSSRegion ) / 2.0 + SliceX / 2.0;
        let right = PlayingField.Right() - ( PlayingField.Width() - WidthOfSSRegion ) / 2.0 - SliceX / 2.0;
        let top = PlayingField.Top() + ( PlayingField.Height() - HeightOfSSRegion ) / 2.0 + SliceY / 2.0;

        for ( let x = 0; x < ( numX / 2 ) - 1; ++x ) {
            for ( let y = 0; y < numY; ++y ) {
                if ( this.m_pTeam.Color() == SoccerTeam.blue() ) {
                    this.m_Spots.push( new this.SupportSpot( new Vector2D( left + x * SliceX, top + y * SliceY ), 0.0 ) );
                } else {
                    this.m_Spots.push( new this.SupportSpot( new Vector2D( right - x * SliceX, top + y * SliceY ), 0.0 ) );
                };
            };
        };

        //create the regulator
        this.m_pRegulator = new Regulator( Prm.SupportSpotUpdateFreq );
    };

    //------------------------------- dtor ----------------------------------------
    //-----------------------------------------------------------------------------
    finalize() {
        super.finalize();
        this.m_pRegulator = null;
    };

    /**
     * draws the spots to the screen as a hollow circles. The higher the 
     * score, the bigger the circle. The best supporting spot is drawn in
     * bright green.
     */
    Render() {
        gdi.HollowBrush();
        gdi.PurplePen();

        for ( let spt = 0; spt < this.m_Spots.length; ++spt ) {
            gdi.Circle( this.m_Spots[ spt ].m_vPos, this.m_Spots[ spt ].m_dScore );
        }

        if ( this.m_pBestSupportingSpot != null ) {
            gdi.GreenPen();
            gdi.Circle( this.m_pBestSupportingSpot.m_vPos, this.m_pBestSupportingSpot.m_dScore );
        };
    };

    /**
     * this method iterates through each possible spot and calculates its
     * score.
     */
    DetermineBestSupportingPosition() {
        //only update the spots every few frames                              
        if ( !this.m_pRegulator.isReady() && this.m_pBestSupportingSpot != null ) {
            return this.m_pBestSupportingSpot.m_vPos;
        };

        //reset the best supporting spot
        this.m_pBestSupportingSpot = null;

        let BestScoreSoFar = 0.0;

        //let it = m_Spots.listIterator();

        //while ( it.hasNext() ) {
        //    let curSpot = it.next();


        for( let it = 0, size = this.m_Spots.length; it < size; it++ ){

            let curSpot = this.m_Spots[ it ];

            //first remove any previous score. (the score is set to one so that
            //the viewer can see the positions of all the spots if he has the 
            //aids turned on)
            curSpot.m_dScore = 1.0;

            //Test 1. is it possible to make a safe pass from the ball's position 
            //to this position?
            if ( this.m_pTeam.isPassSafeFromAllOpponents( this.m_pTeam.ControllingPlayer().Pos(),
                    curSpot.m_vPos,
                    null,
                    Prm.MaxPassingForce ) ) {
                curSpot.m_dScore += Prm.Spot_PassSafeScore;
            };


            //Test 2. Determine if a goal can be scored from this position.  
            if ( this.m_pTeam.CanShoot( curSpot.m_vPos,
                    Prm.MaxShootingForce ) ) {
                curSpot.m_dScore += Prm.Spot_CanScoreFromPositionScore;
            };


            //Test 3. calculate how far this spot is away from the controlling
            //player. The further away, the higher the score. Any distances further
            //away than OptimalDistance pixels do not receive a score.
            if ( this.m_pTeam.SupportingPlayer() != null ) {

                let OptimalDistance = 200.0;

                let dist = Vector2D.Vec2DDistance( this.m_pTeam.ControllingPlayer().Pos(),
                        curSpot.m_vPos );

                let temp = Math.abs( OptimalDistance - dist );

                if ( temp < OptimalDistance ) {

                    //normalize the distance and add it to the score
                    curSpot.m_dScore += Prm.Spot_DistFromControllingPlayerScore
                            * ( OptimalDistance - temp ) / OptimalDistance;
                };
            };

            //check to see if this spot has the highest score so far
            if ( curSpot.m_dScore > BestScoreSoFar ) {
                BestScoreSoFar = curSpot.m_dScore;

                this.m_pBestSupportingSpot = curSpot;
            };

        };

        return this.m_pBestSupportingSpot.m_vPos;
    };

    /**
     * returns the best supporting spot if there is one. If one hasn't been
     * calculated yet, this method calls DetermineBestSupportingPosition and
     * returns the result.
     */
    GetBestSupportingSpot() {
        if ( this.m_pBestSupportingSpot != null ) {
            return this.m_pBestSupportingSpot.m_vPos;
        } else {
            return this.DetermineBestSupportingPosition();
        };
    };
};