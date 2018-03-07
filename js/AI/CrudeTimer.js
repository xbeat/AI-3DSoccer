/**
 * CrudeTimer.js
 */

class CrudeTimer {

    //set the start time
    constructor() {
        this.m_dStartTime = new Date().getTime() * 0.001;
    }

    //copy ctor and assignment should be private
    CrudeTimer( c ) {
    };

    clone() {
        throw new Error( "Cloning Crudetimer not allowed" );
    };

    Instance() {
        return new CrudeTimer();
    };

    //returns how much time has elapsed since the timer was started
    GetCurrentTime() {
        //return System.currentTimeMillis() * 0.001 - m_dStartTime;
        // The truncation of the results was added to produce results similar to what is produced by the C++ code
        // Improved by A.Rick Anderson
        return ( ( Math.round( ( Date().getTime() * 0.001 - this.m_dStartTime ) * 1000 ) ) ) / 1000;
    };
};
