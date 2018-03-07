/**
 * This class substitute C++ preprocessor. 
 * 
 * 
 */
 // Loggin flags
 let SHOW_TEAM_STATE = false;
 let SHOW_SUPPORTING_PLAYERS_TARGET = false;
 let SHOW_MESSAGING_INFO = false;
 let DEBUG_TEAM_STATES = false;
 let GOALY_STATE_INFO_ON = false;
 let PLAYER_STATE_INFO_ON = false;

 var def = function( D ) {
     return D;
 };
 
 var define = function( D ) {
     D = true;
     return D;
 };
 
 var undef = function( D ) {
     D = false;
     return D;
 };