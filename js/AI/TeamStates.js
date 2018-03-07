/**
 * Desc: State prototypes for soccer team states
 * 
 */

class TeamStates {

    //static {
        //uncomment to send state info to debug window
        //define(DEBUG_TEAM_STATES);
    //}

	static ChangePlayerHomeRegions( team, NewRegions ) {
        for ( let plyr = 0; plyr < NewRegions.length; ++plyr ) {
            team.SetPlayerHomeRegion( plyr, NewRegions[plyr] );
        };
    };
};