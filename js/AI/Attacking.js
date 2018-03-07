/**
 * Attacking.js
 */

class Attacking {

    constructor(){ };

    //this is a singleton
    static Instance() {
        return new Attacking();
    };

    Enter( team ) {
        if ( def( DEBUG_TEAM_STATES ) ) {
            console.log( team.Name() + " entering Attacking state");
        };

        //these define the home regions for this state of each of the players
        let BlueRegions = [ 1, 12, 14, 6, 4 ];
        let RedRegions = [ 16, 3, 5, 9, 13 ];

        //set up the player's home regions
        if ( team.Color() == SoccerTeam.blue() ) {
            TeamStates.ChangePlayerHomeRegions( team, BlueRegions );
        } else {
            TeamStates.ChangePlayerHomeRegions( team, RedRegions );
        };

        //if a player is in either the Wait or ReturnToHomeRegion states, its
        //steering target must be updated to that of its new home region to enable
        //it to move into the correct position.
        team.UpdateTargetsOfWaitingPlayers();
    };

    Execute( team ) {
        //if this team is no longer in control change states
        if ( !team.InControl() ) {
            team.GetFSM().ChangeState( Defending.Instance() );
            return;
        };

        //calculate the best position for any supporting attacker to move to
        team.DetermineBestSupportingPosition();
    };

    Exit( team ) {
        //there is no supporting player for defense
        team.SetSupportingPlayer( null );
    };

    OnMessage( e, t ) {
        return false;
    };
};
