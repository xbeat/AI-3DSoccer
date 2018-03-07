/**
 * ReceiveBall.js
 */

class ReceiveBall {

    constructor(){ };

    //this is a singleton
    static Instance() {
        return new ReceiveBall();
    };    


    Enter( player ) {
        //let the team know this player is receiving the ball
        player.Team().SetReceiver( player );

        //this player is also now the controlling player
        player.Team().SetControllingPlayer( player );

        //there are two types of receive behavior. One uses arrive to direct
        //the receiver to the position sent by the passer in its telegram. The
        //other uses the pursuit behavior to pursue the ball. 
        //This statement selects between them dependent on the probability
        //ChanceOfUsingArriveTypeReceiveBehavior, whether or not an opposing
        //player is close to the receiving player, and whether or not the receiving
        //player is in the opponents 'hot region' (the third of the pitch closest
        //to the opponent's goal
        let PassThreatRadius = 70.0;

        if ( ( player.InHotRegion()
                || utils.RandFloat() < Prm.ChanceOfUsingArriveTypeReceiveBehavior )
                && !player.Team().isOpponentWithinRadius( player.Pos(), PassThreatRadius ) ) {
            player.Steering().ArriveOn();

            if ( def( PLAYER_STATE_INFO_ON ) ) {
                console.log( "Player " + player.ID() + " enters receive state (Using Arrive)" );
            }
        } else {
            player.Steering().PursuitOn();

            if ( def( PLAYER_STATE_INFO_ON ) ) {
                console.log( "Player " + player.ID() + " enters receive state (Using Pursuit)" );
            };
        };

    };

    Execute( player ) {
        //if the ball comes close enough to the player or if his team lose control
        //he should change state to chase the ball
        if ( player.BallWithinReceivingRange() || !player.Team().InControl() ) {
            player.GetFSM().ChangeState( ChaseBall.Instance() );

            return;
        };

        if ( player.Steering().PursuitIsOn() ) {
            player.Steering().SetTarget( player.Ball().Pos() );
        };

        //if the player has 'arrived' at the steering target he should wait and
        //turn to face the ball
        if ( player.AtTarget() ) {
            player.Steering().ArriveOff();
            player.Steering().PursuitOff();
            player.TrackBall();
            player.SetVelocity( new Vector2D( 0, 0 ) );
        };
    };

    Exit( player ) {
        player.Steering().ArriveOff();
        player.Steering().PursuitOff();

        player.Team().SetReceiver( null );
    };

    OnMessage( e, t ) {
        return false;
    };
};