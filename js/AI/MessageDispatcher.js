/**
 * Desc:   A message dispatcher. Manages messages of the type Telegram.
 *         Instantiated as a singleton.
 *
 * MessageDispatcher.js
 */

class MessageDispatcher {

    /** 
     * this method is utilized by DispatchMsg or DispatchDelayedMessages.
     * This method calls the message handling member function of the receiving
     * entity, pReceiver, with the newly created telegram
     */
    Discharge( pReceiver, telegram ) {
        if ( !pReceiver.HandleMessage( telegram ) ) {
            //telegram could not be handled
            if ( def( SHOW_MESSAGING_INFO ) ) {
                console.log( "Message not handled" );
            };
        };
    };

    //copy ctor and assignment should be private
    constructor( d ) {

        //to make life easier...
        //to make code easier to read
        this.SEND_MSG_IMMEDIATELY = 0.0;
        this.NO_ADDITIONAL_INFO = 0;
        this.SENDER_ID_IRRELEVANT = -1;
        //a std::set is used as the container for the delayed messages
        //because of the benefit of automatic sorting and avoidance
        //of duplicates. Messages are sorted by their dispatch time.
        this.PriorityQ = new TreeSet();

    };

    clone() {
        throw new Error( "Cloning MessageDispatcher not allowed" );
    };

    //this class is a singleton
    static Instance() {
        return new MessageDispatcher();
    };

    /**
     * given a message, a receiver, a sender and any time delay, this function
     * routes the message to the correct agent (if no delay) or stores
     * in the message queue to be dispatched at the correct time
     */
    //DispatchMsg( delay,
    //        sender,
    //        receiver,
    //        msg ) {
    //    DispatchMsg( delay, sender, receiver, msg, null );
    //};

    DispatchMsg( delay,
            sender,
            receiver,
            msg,
            AdditionalInfo = null ) {

        //get a pointer to the receiver
        let pReceiver = EntityMgr.GetEntityFromID( receiver );

        //make sure the receiver is valid
        if ( pReceiver == null ) {
            if ( def( SHOW_MESSAGING_INFO ) ) {
                console.log( "\nWarning! No Receiver with ID of " + receiver + " found" );
            };

            return;
        };

        //create the telegram
        let telegram = new Telegram( 0, sender, receiver, msg, AdditionalInfo );

        //if there is no delay, route telegram immediately                       
        if ( delay <= 0.0 ) {
            if ( def( SHOW_MESSAGING_INFO ) ) {
               console.log("\nTelegram dispatched at time: " + TickCounter.GetCurrentFrame() + " by " + sender + " for " +  receiver + ". Msg is " + msg );
            };
            //send the telegram to the recipient
            this.Discharge( pReceiver, telegram );
        } //else calculate the time when the telegram should be dispatched
        else {
            let CurrentTime = TickCounter.GetCurrentFrame();

            telegram.DispatchTime = CurrentTime + delay;

            //and put it in the queue
            this.PriorityQ.add( telegram );

            if ( def( SHOW_MESSAGING_INFO ) ) {
                console.log( " \nDelayed telegram from " + sender + " recorded at time " + TickCounter.GetCurrentFrame() + " for " +  receiver + ". Msg is " + msg );
            };
        };
    };

    /**
     *  This function dispatches any telegrams with a timestamp that has
     * expired. Any dispatched telegrams are removed from the queue
     */
    DispatchDelayedMessages() {
        //first get current time
        let CurrentTime = TickCounter.GetCurrentFrame();

        //now peek at the queue to see if any telegrams need dispatching.
        //remove all telegrams from the front of the queue that have gone
        //past their sell by date
        while ( !this.PriorityQ.isEmpty()
                && ( this.PriorityQ.first().DispatchTime < CurrentTime)
                && ( this.PriorityQ.first().DispatchTime > 0 ) ) {
            //read the telegram from the front of the queue
            let telegram = PriorityQ.first();

            //find the recipient
            let pReceiver = EntityMgr.GetEntityFromID( telegram.Receiver );

            if ( def( SHOW_MESSAGING_INFO ) ) {
                console.log( "\nQueued telegram ready for dispatch: Sent to " + pReceiver.ID() + ". Msg is " + telegram.Msg );
            };

            //send the telegram to the recipient
            this.Discharge( pReceiver, telegram );

            //remove it from the queue
            this.PriorityQ.remove( PriorityQ.first() );
        };
    };
    /**
     * Count of messages in the queue.
     * @return 
     */
    size() {
        return this.PriorityQ.size();
    };

    /**
     * Clear dispatcher messages.
     */
    clear() {
        this.PriorityQ.clear();
    };
};

let Dispatcher = new MessageDispatcher();