/**
 * 
//------------------------- ReturnHome: ----------------------------------
//
//  In this state the goalkeeper simply returns back to the center of
//  the goal region before changing state back to TendGoal
//------------------------------------------------------------------------
 * 
 * 
 */

class ReturnHome {

    constructor(){ };

    //this is a singleton
    static Instance() {
        return new ReturnHome();
    };

    Enter( keeper ) {
        keeper.Steering().ArriveOn();
    };

    Execute( keeper ) {
        keeper.Steering().SetTarget( keeper.HomeRegion().Center() );

        //if close enough to home or the opponents get control over the ball,
        //change state to tend goal
        if ( keeper.InHomeRegion() || !keeper.Team().InControl() ) {
            keeper.GetFSM().ChangeState( TendGoal.Instance() );
        };
    };

    Exit( keeper ) {
        keeper.Steering().ArriveOff();
    };

    OnMessage( e, t ) {
        return false;
    };
};