class FrameCounter {

    constructor(){
        this.m_lCount = 0;
        this.m_iFramesElapsed = 0;
    };

    //copy ctor and assignment should be private
    FrameCounter( c ) {
    }

    clone() {
        throw new Error ( "FrameCounter CloneNotSupportedException() ");
    };

    static Instance() {
        return new FrameCounter();
    };

    Update() {
        ++this.m_lCount;
        ++this.m_iFramesElapsed;
    }

    GetCurrentFrame() {
        return this.m_lCount;
    };

    Reset() {
        this.m_lCount = 0;
    };

    Start() {
        this.m_iFramesElapsed = 0;
    };

    FramesElapsedSinceStartCalled() {
        return this.m_iFramesElapsed;
    };
};

let TickCounter = new FrameCounter();