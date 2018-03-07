/**
 * Defending
 */

class Defending {

    constructor(){ };

    //this is a singleton
    static Instance() {
        return new Defending();
    };

    Enter( team ) {
        if ( def( DEBUG_TEAM_STATES ) ) {
            console.log( team.Name() + " entering Defending state" );
        };

        //these define the home regions for this state of each of the players
        let BlueRegions = [ 1, 6, 8, 3, 5 ];
        let RedRegions = [ 16, 9, 11, 12, 14 ];

        //set up the player's home regions
        if ( team.Color() == SoccerTeam.blue() ) {
            TeamStates.ChangePlayerHomeRegions( team, BlueRegions );
        } else {
            TeamStates.ChangePlayerHomeRegions( team, RedRegions );
        }

        //if a player is in either the Wait or ReturnToHomeRegion states, its
        //steering target must be updated to that of its new home region
        team.UpdateTargetsOfWaitingPlayers();
    };

    Execute( team ) {
        //if in control change states
        if ( team.InControl() ) {
            team.GetFSM().ChangeState( Attacking.Instance() );
            return;
        };
    };

    Exit( team ) {
    };

    OnMessage( e, t ) {
        return false;
    };
};