/**
 * KickBall.js
 */

class KickBall {

    constructor(){ };

    //this is a singleton
    static Instance() {
        return new KickBall();
    };

    Enter( player ) {
        //let the team know this player is controlling
        player.Team().SetControllingPlayer( player );

        //the player can only make so many kick attempts per second.
        if ( !player.isReadyForNextKick() ) {
            player.GetFSM().ChangeState( ChaseBall.Instance() );
        };


        if ( def( PLAYER_STATE_INFO_ON ) ) {
            console.log( "Player " + player.ID() + " enters kick state" );
        };
    };

    Execute( player ) {
        //calculate the dot product of the vector pointing to the ball
        //and the player's heading
        let ToBall = Vector2D.sub( player.Ball().Pos(), player.Pos() );
        let dot = player.Heading().Dot( Vector2D.Vec2DNormalize( ToBall ) );

        //cannot kick the ball if the goalkeeper is in possession or if it is 
        //behind the player or if there is already an assigned receiver. So just
        //continue chasing the ball
        if ( player.Team().Receiver() != null
                || player.Pitch().GoalKeeperHasBall()
                || ( dot < 0 ) ) {
            if ( def( PLAYER_STATE_INFO_ON ) ) {
               console.log( "Goaly has ball / ball behind player" );
            }

            player.GetFSM().ChangeState( ChaseBall.Instance() );

            return;
        };

        /* Attempt a shot at the goal */

        //if a shot is possible, this vector will hold the position along the 
        //opponent's goal line the player should aim for.
        let BallTarget = new Vector2D();

        //the dot product is used to adjust the shooting force. The more
        //directly the ball is ahead, the more forceful the kick
        let power = Prm.MaxShootingForce * dot;

        //if it is determined that the player could score a goal from this position
        //OR if he should just kick the ball anyway, the player will attempt
        //to make the shot
        if ( player.Team().CanShoot( player.Ball().Pos(),
                power,
                BallTarget )
                || ( utils.RandFloat() < Prm.ChancePlayerAttemptsPotShot ) ) {
            if ( def( PLAYER_STATE_INFO_ON ) ) {
                console.log( "Player "  + player.ID() + " attempts a shot at ", BallTarget );
            };

            //add some noise to the kick. We don't want players who are 
            //too accurate! The amount of noise can be adjusted by altering
            //Prm.PlayerKickingAccuracy
            BallTarget = SoccerBall.AddNoiseToKick( player.Ball().Pos(), BallTarget );

            //this is the direction the ball will be kicked in
            let KickDirection = Vector2D.sub( BallTarget, player.Ball().Pos() );

            player.Ball().Kick( KickDirection, power );

            //change state   
            player.GetFSM().ChangeState( Wait.Instance() );

            player.FindSupport();

            return;
        };


        /* Attempt a pass to a player */

        //if a receiver is found this will point to it
        let receiver = null;

        power = Prm.MaxPassingForce * dot;

        let receiverRef;
        //test if there are any potential candidates available to receive a pass
        if ( player.isThreatened()
                && player.Team().FindPass( player,
                receiverRef,
                BallTarget,
                power,
                Prm.MinPassDist ) ) {
            receiver = Global.objReceiverRef;
            //add some noise to the kick
            BallTarget = SoccerBall.AddNoiseToKick( player.Ball().Pos(), BallTarget );

            let KickDirection = Vector2D.sub( BallTarget, player.Ball().Pos() );

            player.Ball().Kick( KickDirection, power );

            if ( def( PLAYER_STATE_INFO_ON ) ) {
                console.log( "Player " + player.ID() + " passes the ball with force " + ttos( power, 3 ) + "  to player " + receiver.ID() + "  Target is ", BallTarget );
            };

            //let the receiver know a pass is coming 
            Dispatcher.DispatchMsg( Dispatcher.SEND_MSG_IMMEDIATELY,
                    player.ID(),
                    receiver.ID(),
                    Global.MessageTypes.Msg_ReceiveBall,
                    BallTarget );


            //the player should wait at his current position unless instruced
            //otherwise  
            player.GetFSM().ChangeState( Wait.Instance() );

            player.FindSupport();

            return;
        } //cannot shoot or pass, so dribble the ball upfield
        else {
            player.FindSupport();

            player.GetFSM().ChangeState( Dribble.Instance() );
        };
    };

    Exit( player ) {
    };

    OnMessage( e, t ) {
        return false;
    };
};
