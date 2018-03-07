/**
 * @Wait.js
 */

class Wait {

    //this is a singleton
    static Instance() {
        return new Wait();
    };

    Enter( player ) {
        if ( def( PLAYER_STATE_INFO_ON ) ) {
                console.log( "Player " + player.ID() + " enters wait state" );
        };

        //if the game is not on make sure the target is the center of the player's
        //home region. This is ensure all the players are in the correct positions
        //ready for kick off
        if ( !player.Pitch().GameOn() ) {
            player.Steering().SetTarget( player.HomeRegion().Center() );
        };
    };

    Execute( player ) {
        //if the player has been jostled out of position, get back in position  
        if ( !player.AtTarget() ) {
            player.Steering().ArriveOn();

            return;
        } else {
            player.Steering().ArriveOff();

            player.SetVelocity( new Vector2D( 0, 0 ) );

            //the player should keep his eyes on the ball!
            player.TrackBall();
        };

        //if this player's team is controlling AND this player is not the attacker
        //AND is further up the field than the attacker he should request a pass.
        if ( player.Team().InControl()
                && (!player.isControllingPlayer() )
                && player.isAheadOfAttacker() ) {
            player.Team().RequestPass( player );

            return;
        };

        if ( player.Pitch().GameOn() ) {
            //if the ball is nearer this player than any other team member  AND
            //there is not an assigned receiver AND neither goalkeeper has
            //the ball, go chase it
            if ( player.isClosestTeamMemberToBall()
                    && player.Team().Receiver() == null
                    && !player.Pitch().GoalKeeperHasBall()) {
                player.GetFSM().ChangeState( ChaseBall.Instance() );

                return;
            };
        };
    };

    Exit( player ) {
    };

    OnMessage( e, t ) {
        return false;
    };
};