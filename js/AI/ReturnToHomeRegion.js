/**
 * ReturnToHomeRegion.js
 */

class ReturnToHomeRegion  {

    constructor(){ };

    //this is a singleton
    static Instance() {
        return new ReturnToHomeRegion();
    };

    Enter( player ) {
        player.Steering().ArriveOn();

        if ( !player.HomeRegion().Inside( player.Steering().Target(), Region.region_modifier().halfsize ) ) {
            player.Steering().SetTarget( player.HomeRegion().Center() );
        }

        if ( def( PLAYER_STATE_INFO_ON ) ) {
            console.log( "Player " + player.ID() + " enters ReturnToHome state" );
        };
    };

    Execute( player ) {
        if ( player.Pitch().GameOn() ) {
            //if the ball is nearer this player than any other team member  &&
            //there is not an assigned receiver && the goalkeeper does not gave
            //the ball, go chase it
            if ( player.isClosestTeamMemberToBall()
                    && ( player.Team().Receiver() == null )
                    && !player.Pitch().GoalKeeperHasBall() ) {
                player.GetFSM().ChangeState( ChaseBall.Instance() );

                return;
            };
        };

        //if game is on and close enough to home, change state to wait and set the 
        //player target to his current position.(so that if he gets jostled out of 
        //position he can move back to it)
        if ( player.Pitch().GameOn() && player.HomeRegion().Inside( player.Pos(),
                Region.region_modifier().halfsize ) ) {
            player.Steering().SetTarget( player.Pos() );
            player.GetFSM().ChangeState( Wait.Instance() );
        } //if game is not on the player must return much closer to the center of his
        //home region
        else if ( !player.Pitch().GameOn() && player.AtTarget() ) {
            player.GetFSM().ChangeState( Wait.Instance() );
        }
    }

    Exit( player ) {
        player.Steering().ArriveOff();
    };

    OnMessage( e, t ) {
        return false;
    };
};
