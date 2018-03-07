/**
 * Dribble.js
 */

class Dribble {

    constructor(){ };

    //this is a singleton
    static Instance() {
        return new Dribble();
    };

    Enter( player ) {
        //let the team know this player is controlling
        player.Team().SetControllingPlayer( player );

        if ( def( PLAYER_STATE_INFO_ON ) ) {
            console.log( "Player " + player.ID() + " enters dribble state" );
        };
    };

    Execute( player ) {
        let dot = player.Team().HomeGoal().Facing().Dot( player.Heading() );

        //if the ball is between the player and the home goal, it needs to swivel
        // the ball around by doing multiple small kicks and turns until the player 
        //is facing in the correct direction
        if ( dot < 0 ) {
            //the player's heading is going to be rotated by a small amount (Pi/4) 
            //and then the ball will be kicked in that direction
            let direction = player.Heading();

            //calculate the sign (+/-) of the angle between the player heading and the 
            //facing direction of the goal so that the player rotates around in the 
            //correct direction
            let angle = QuarterPi * -1
                    * player.Team().HomeGoal().Facing().Sign( player.Heading() );

            Transformation.Vec2DRotateAroundOrigin( direction, angle );

            //this value works well whjen the player is attempting to control the
            //ball and turn at the same time
            let KickingForce = 0.8;

            player.Ball().Kick( direction, KickingForce );
        }  //kick the ball down the field
        else {
            player.Ball().Kick( player.Team().HomeGoal().Facing(),
                    Prm.MaxDribbleForce );
        };

        //the player has kicked the ball so he must now change state to follow it
        player.GetFSM().ChangeState( ChaseBall.Instance() );

        return;
    };

    Exit( player ) {
    };

    OnMessage( e, t ) {
        return false;
    };
};
