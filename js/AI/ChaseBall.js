/**
 * ChaseBall.js
 */

class ChaseBall {

    constructor(){ };

    //this is a singleton
    static Instance() {
        return new ChaseBall();
    };
    
    Enter( player ) {
        player.Steering().SeekOn();

        if ( def( PLAYER_STATE_INFO_ON ) ) {
            console.log( "Player " + player.ID() + " enters chase state" );
        };
    };
    
    Execute( player ) {
        //if the ball is within kicking range the player changes state to KickBall.
        if ( player.BallWithinKickingRange() ) {
            player.GetFSM().ChangeState( KickBall.Instance() );
            return;
        };

        //if the player is the closest player to the ball then he should keep
        //chasing it
        if ( player.isClosestTeamMemberToBall() ) {
            player.Steering().SetTarget( player.Ball().Pos() );

            return;
        };

        //if the player is not closest to the ball anymore, he should return back
        //to his home region and wait for another opportunity
        player.GetFSM().ChangeState( ReturnToHomeRegion.Instance() );
    };
    
    Exit( player ) {
        player.Steering().SeekOff();
    };
 
    OnMessage( e, t ) {
        return false;
    };
};