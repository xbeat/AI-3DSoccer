/**
 * Telegram.js
 */

class Telegram {
    //the entity that sent this telegram

    constructor( time,
                sender,
                receiver,
                msg,
                info ) {
        this.DispatchTime = time;
        this.Sender = sender;
        this.Receiver = receiver;
        this.Msg = msg;
        this.ExtraInfo = info;
        this.SmallestDelay = 0.25;
    };
    //these telegrams will be stored in a priority queue. Therefore the >
    //operator needs to be overloaded so that the PQ can sort the telegrams
    //by time priority. Note how the times must be smaller than
    //SmallestDelay apart before two Telegrams are considered unique.
    /**
     *  "overloads" == operaotr
     */
    equals( o ) {
        if ( !( o instanceof Telegram ) ) {
            return false;
        };

        let t1 = this;
        let t2 = o;
        return ( Math.abs( t1.DispatchTime - t2.DispatchTime ) < this.SmallestDelay )
                && ( t1.Sender == t2.Sender )
                && ( t1.Receiver == t2.Receiver )
                && ( t1.Msg == t2.Msg || ( t1.Msg == null && t2.Msg == null ) );
    };

    /**
     *  It is generally necessary to override the hashCode method 
     *  whenever equals method is overridden, so as to maintain the 
     *  general contract for the hashCode method, which states that 
     *  equal objects must have equal hash codes.
     */
	hashCode() {
		let hash = 7;
		hash = 53 * hash + this.Sender;
		hash = 53 * hash + this.Receiver;
		hash = 53 * hash + ( this.Msg != null ? this.Msg.hashCode() : 0 );
		let DispatchTime = this.DispatchTime - ( this.DispatchTime % this.SmallestDelay );
        hash = 53 * hash + ( Double.doubleToLongBits( DispatchTime ) ^ ( Double.doubleToLongBits( DispatchTime ) >>> 32 ) );
		hash = 97 * hash + ( this.ExtraInfo == null ? 0 : this.ExtraInfo.hashCode());
		return hash;
	};

        
    /**
     * "overloads" < and > operators
     */
    compareTo( o2 ) {
        let t1 = this;
        let t2 = o2;
        if ( Math.abs( t1.DispatchTime - t2.DispatchTime ) < SmallestDelay ) {
	    return t1.hashCode() - t2.hashCode(); // equals objects return 0
	} else {
            return ( t1.DispatchTime < t2.DispatchTime ) ? -1 : 1;
        };
    };

    toString() {
        return "time: " + this.DispatchTime + "  Sender: " + this.Sender
                + "   Receiver: " + this.Receiver + "   Msg: " + this.Msg;
    };

    /**
     * handy helper function for dereferencing the ExtraInfo field of the Telegram 
     * to the required type.
     */
    static DereferenceToType( p ) {
        return p;
    };
};