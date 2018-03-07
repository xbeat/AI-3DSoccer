/**
 *  In this state the GP will attempt to intercept the ball using the
 *  pursuit steering behavior, but he only does so so long as he remains
 *  within his home region.
 * 
 */

class InterceptBall {

    constructor(){ };

    //this is a singleton
    static Instance() {
        return new InterceptBall();
    };

    Enter( keeper ) {
        keeper.Steering().PursuitOn();

        if ( def( GOALY_STATE_INFO_ON ) ) {
            console.log( "Goaly " + keeper.ID() + " enters InterceptBall" );
        };
    };

    Execute( keeper ) {
        //if the goalkeeper moves to far away from the goal he should return to his
        //home region UNLESS he is the closest player to the ball, in which case,
        //he should keep trying to intercept it.
        if ( keeper.TooFarFromGoalMouth() && !keeper.isClosestPlayerOnPitchToBall() ) {
            keeper.GetFSM().ChangeState( ReturnHome.Instance() );
            return;
        };

        //if the ball becomes in range of the goalkeeper's hands he traps the 
        //ball and puts it back in play
        if ( keeper.BallWithinKeeperRange() ) {
            keeper.Ball().Trap();

            keeper.Pitch().SetGoalKeeperHasBall( true );

            keeper.GetFSM().ChangeState( PutBallBackInPlay.Instance() );

            return;
        };
    };

    Exit( keeper ) {
        keeper.Steering().PursuitOff();
    };

    OnMessage( e, t ) {
        return false;
    };
};
