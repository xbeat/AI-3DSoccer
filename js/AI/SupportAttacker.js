/**
 * SupportAttacker.js
 */

class SupportAttacker {

    constructor(){ };

    //this is a singleton
    static Instance() {
        return new SupportAttacker();
    };    

    Enter( player ) {
        player.Steering().ArriveOn();

        player.Steering().SetTarget( player.Team().GetSupportSpot() );

        if ( def( PLAYER_STATE_INFO_ON ) ) {
            console.log( "Player " + player.ID() + " enters support state" );
        };
    };

    Execute( player ) {
        //if his team loses control go back home
        if ( !player.Team().InControl() ) {
            player.GetFSM().ChangeState( ReturnToHomeRegion.Instance() );
            return;
        };

        //if the best supporting spot changes, change the steering target
        if ( player.Team().GetSupportSpot() != player.Steering().Target() ) {
            player.Steering().SetTarget( player.Team().GetSupportSpot() );

            player.Steering().ArriveOn();
        };

        //if this player has a shot at the goal AND the attacker can pass
        //the ball to him the attacker should pass the ball to this player
        if ( player.Team().CanShoot( player.Pos(),
                Prm.MaxShootingForce) ) {
            player.Team().RequestPass( player );
        };


        //if this player is located at the support spot and his team still have
        //possession, he should remain still and turn to face the ball
        if ( player.AtTarget() ) {
            player.Steering().ArriveOff();

            //the player should keep his eyes on the ball!
            player.TrackBall();

            player.SetVelocity( new Vector2D( 0, 0 ) );

            //if not threatened by another player request a pass
            if ( !player.isThreatened() ) {
                player.Team().RequestPass( player );
            };
        };
    };

    Exit( player ) {
        //set supporting player to null so that the team knows it has to 
        //determine a new one.
        player.Team().SetSupportingPlayer( null );

        player.Steering().ArriveOff();
    };

    OnMessage( e, t ) {
        return false;
    };
};
