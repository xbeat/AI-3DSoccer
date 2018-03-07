/**
 * PrepareForKickOff.js)
 */

class PrepareForKickOff {

    constructor(){ };

    //this is a singleton
    static Instance() {
        return new PrepareForKickOff();;
    };

    Enter( team ) {
        //reset key player pointers
        team.SetControllingPlayer( null );
        team.SetSupportingPlayer( null );
        team.SetReceiver( null );
        team.SetPlayerClosestToBall( null );

        //send Msg_GoHome to each player.
        team.ReturnAllFieldPlayersToHome();
    };

    Execute( team ) {
        //if both teams in position, start the game
        if ( team.AllPlayersAtHome() && team.Opponents().AllPlayersAtHome() ) {
            team.GetFSM().ChangeState( Defending.Instance() );
        };
    };

    Exit( team ) {
        team.Pitch().SetGameOn();
    };

    OnMessage( e, t ) {
        return false;
    };
};