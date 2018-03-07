/**
 *
 *  Desc: Windows timer class.
 *
 *        nb. this only uses the high performance timer. There is no
 *        support for ancient computers. I know, I know, I should add
 *        support, but hey, I have shares in AMD and Intel... Go upgrade ;o)
 * 
 *
 */

class PrecisionTimer {

    //if true a call to TimeElapsed() will return 0 if the current
    //time elapsed is much smaller than the previous. Used to counter
    //the problems associated with the user using menus/resizing/moving 
    //a window etc

    /**
    /* use to specify FPS
     */
    constructor( fps = 60.0 ) {
        this.m_NormalFPS = fps;
        this.m_SlowFPS = 1.0;
        this.m_TimeElapsed = 0.0;
        this.m_FrameTime = 0.0;
        this.m_LastTime = 0.0;
        this.m_LastTimeInTimeElapsed = 0.0;
        this.m_PerfCountFreq = 0.0;
        this.m_bStarted = false;
        this.m_StartTime = 0.0;
        this.m_LastTimeElapsed = 0.0;
        this.m_bSmoothUpdates = false;

        //how many ticks per sec do we get
        //QueryPerformanceFrequency((LARGE_INTEGER *) & m_PerfCountFreq);
        //using Date().getTime() it is obviously 1 000 000 milli second per second
        this.m_PerfCountFreq = 100;

        this.m_TimeScale = 1.0 / this.m_PerfCountFreq;

        //calculate ticks per frame
        this.m_FrameTime = ( this.m_PerfCountFreq / this.m_NormalFPS );
    }

    /**
     *  this starts the timer
     *  call this immediately prior to game loop. Starts the timer
     *
     */
    Start() {
        this.m_bStarted = true;

        this.m_TimeElapsed = 0.0;

        //get the time
        //QueryPerformanceCounter((LARGE_INTEGER *) & m_LastTime);
        this.m_LastTime = new Date().getTime();

        //keep a record of when the timer was started
        this.m_StartTime = this.m_LastTimeInTimeElapsed = this.m_LastTime;

        //update time to render next frame
        this.m_NextTime = this.m_LastTime + this.m_FrameTime;

        return;
    };

    //determines if enough time has passed to move onto next frame
    //public boolean    ReadyForNextFrame();
    //only use this after a call to the above.
    //double  GetTimeElapsed(){return m_TimeElapsed;}
    //public double  TimeElapsed();
    CurrentTime() {
        //QueryPerformanceCounter((LARGE_INTEGER *) & m_CurrentTime);
        this.m_CurrentTime = new Date().getTime();

        return ( this.m_CurrentTime - this.m_StartTime ) * this.m_TimeScale;
    };

    Started() {
        return this.m_bStarted;
    };

    SmoothUpdatesOn() {
        this.m_bSmoothUpdates = true;
    };

    SmoothUpdatesOff() {
        this.m_bSmoothUpdates = false;
    };

    /**
     *  returns true if it is time to move on to the next frame step. To be used if
     *  FPS is set.
     */
    ReadyForNextFrame() {
        if ( !( this.m_NormalFPS != 0 ) ) console.log( "PrecisionTimer::ReadyForNextFrame<No FPS set in timer>" );

        //QueryPerformanceCounter((LARGE_INTEGER *) & m_CurrentTime);
        this.m_CurrentTime = new Date().getTime();

        if ( this.m_CurrentTime > this.m_NextTime ) {

            this.m_TimeElapsed = ( this.m_CurrentTime - this.m_LastTime ) * this.m_TimeScale;
            this.m_LastTime = this.m_CurrentTime;

            //update time to render next frame
            this.m_NextTime = this.m_CurrentTime + this.m_FrameTime;

            return true;
        };

        return false;
    };

    /**
     *  returns time elapsed since last call to this function.
     */
    TimeElapsed() {
        this.m_LastTimeElapsed = this.m_TimeElapsed;

        //QueryPerformanceCounter((LARGE_INTEGER *) & m_CurrentTime);
        this.m_CurrentTime = new Date().getTime();

        this.m_TimeElapsed = ( this.m_CurrentTime - this.m_LastTimeInTimeElapsed ) * this.m_TimeScale;

        this.m_LastTimeInTimeElapsed = this.m_CurrentTime;

        let Smoothness = 5.0;

        if ( this.m_bSmoothUpdates ) {
            if ( this.m_TimeElapsed < ( this.m_LastTimeElapsed * Smoothness ) ) {
                return this.m_TimeElapsed;
            } else {
                return 0.0;
            }
        } else {
            return this.m_TimeElapsed;
        };
    };
};