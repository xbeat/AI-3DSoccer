/**
 * PutBallBackInPlay
 */

class PutBallBackInPlay {

    constructor(){ };

    //this is a singleton
    static Instance() {
        return new PutBallBackInPlay();
    };

    Enter( keeper ) {
        //let the team know that the keeper is in control
        keeper.Team().SetControllingPlayer( keeper );

        //send all the players home
        keeper.Team().Opponents().ReturnAllFieldPlayersToHome();
        keeper.Team().ReturnAllFieldPlayersToHome();
    };

    Execute( keeper ) {
        let receiver = null;
        let BallTarget = new Vector2D();

        let receiverRef = receiver;

        //test if there are players further forward on the field we might
        //be able to pass to. If so, make a pass.
        if ( keeper.Team().FindPass( keeper,
                receiverRef,
                BallTarget,
                Prm.MaxPassingForce,
                Prm.GoalkeeperMinPassDist ) ) {
            receiver = Global.objReceiverRef;
            //make the pass   
            keeper.Ball().Kick( Vector2D.Vec2DNormalize( Vector2D.sub( BallTarget, keeper.Ball().Pos() ) ),
                    Prm.MaxPassingForce );

            //goalkeeper no longer has ball 
            keeper.Pitch().SetGoalKeeperHasBall( false );

            //let the receiving player know the ball's comin' at him
            Dispatcher.DispatchMsg( Dispatcher.SEND_MSG_IMMEDIATELY,
                    keeper.ID(),
                    receiver.ID(),
                    Global.MessageTypes.Msg_ReceiveBall,
                    BallTarget );

            //go back to tending the goal   
            keeper.GetFSM().ChangeState( TendGoal.Instance() );

            return;
        };

        keeper.SetVelocity( new Vector2D() );
    };

    Exit( keeper ) {
    };

    OnMessage( e, t ) {
        return false;
    };
};