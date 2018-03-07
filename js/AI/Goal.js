/**
 * Desc:  class to define a goal for a soccer pitch. The goal is defined
 *        by two 2D vectors representing the left and right posts.
 *
 *        Each time-step the method Scored should be called to determine
 *        if a goal has been scored.
 * 
 */

class Goal {

    constructor( left, right, facing ) {
        this.m_vLeftPost = left;
        this.m_vRightPost = right;
        this.m_vCenter = Vector2D.div( Vector2D.add( left, right ), 2.0 );
        this.m_iNumGoalsScored = 0;
        this.m_vFacing = facing;
    }

    /**
     * Given the current ball position and the previous ball position,
     * this method returns true if the ball has crossed the goal line 
     * and increments m_iNumGoalsScored
     */
    Scored( ball ) {
        if ( geometry.LineIntersection2D( ball.Pos(), ball.OldPos(), this.m_vLeftPost, this.m_vRightPost ) ) {
            ++this.m_iNumGoalsScored;

            return true;
        };

        return false;
    };

    //-----------------------------------------------------accessor methods
    Center() {
        return new Vector2D( this.m_vCenter );
    }

    Facing() {
        return new Vector2D( this.m_vFacing );
    }

    LeftPost() {
        return new Vector2D( this.m_vLeftPost );
    }

    RightPost() {
        return new Vector2D( this.m_vRightPost );
    }

    NumGoalsScored() {
        return this.m_iNumGoalsScored;
    }

    ResetGoalsScored() {
        this.m_iNumGoalsScored = 0;
    };
};