/**
 * 
 */

class GlobalPlayerState {

    constructor(){ };

    //this is a singleton
    static Instance() {
        return new GlobalPlayerState();
    };

    Enter( player ) {
    };

    Execute( player ) {
        //if a player is in possession and close to the ball reduce his max speed
        if ( ( player.BallWithinReceivingRange() ) && ( player.isControllingPlayer() ) ) {
            player.SetMaxSpeed( Prm.PlayerMaxSpeedWithBall );
        } else {
            player.SetMaxSpeed( Prm.PlayerMaxSpeedWithoutBall );
        };
    };

    Exit( player ) {
    };

    OnMessage( player, telegram ) {
        switch ( telegram.Msg ) {
            case  Global.MessageTypes.Msg_ReceiveBall:
                //set the target
                player.Steering().SetTarget( telegram.ExtraInfo );

                //change state 
                player.GetFSM().ChangeState( ReceiveBall.Instance() );

                return true;
            break;

            case Global.MessageTypes.Msg_SupportAttacker:
                //if already supporting just return
                if ( player.GetFSM().isInState( SupportAttacker.Instance() ) ) {
                    return true;
                };

                //set the target to be the best supporting position
                player.Steering().SetTarget( player.Team().GetSupportSpot() );

                //change the state
                player.GetFSM().ChangeState( SupportAttacker.Instance() );

                return true;
            break;

            case Global.MessageTypes.Msg_Wait:
                //change the state
                player.GetFSM().ChangeState( Wait.Instance() );

                return true;
           break;

            case Global.MessageTypes.Msg_GoHome:
                player.SetDefaultHomeRegion();

                player.GetFSM().ChangeState( ReturnToHomeRegion.Instance() );

                return true;

            break;

            case Global.MessageTypes.Msg_PassToMe:
                //get the position of the player requesting the pass 
                let receiver = telegram.ExtraInfo;

                if ( def( PLAYER_STATE_INFO_ON ) ) {
                    console.log( "Player " + player.ID() + " received request from " + receiver.ID() + " to make pass" );
                };

                //if the ball is not within kicking range or their is already a 
                //receiving player, this player cannot pass the ball to the player
                //making the request.
                if ( player.Team().Receiver() != null
                        || !player.BallWithinKickingRange() ) {
                    if ( def( PLAYER_STATE_INFO_ON ) ) {
                        console.log( "Player " + player.ID() + " cannot make requested pass <cannot kick ball>" );
                    };

                    return true;
                };

                //make the pass   
                player.Ball().Kick( Vector2D.sub( receiver.Pos(), player.Ball().Pos() ),
                        Prm.MaxPassingForce );


                if ( def( PLAYER_STATE_INFO_ON ) ) {
                    console.log( "Player " + player.ID() + " Passed ball to requesting player ");
                };

                //let the receiver know a pass is coming 
                Dispatcher.DispatchMsg( Dispatcher.SEND_MSG_IMMEDIATELY,
                        player.ID(),
                        receiver.ID(),
                        Global.MessageTypes.Msg_ReceiveBall,
                        receiver.Pos() );

                //change state   
                player.GetFSM().ChangeState( Wait.Instance() );

                player.FindSupport();

                return true;
            break;

        };//end switch

        return false;
    };
};