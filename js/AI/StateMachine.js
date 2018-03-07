/**
 * State machine class. Inherit from this class and create some 
 * states to give your agents FSM functionality
 * 
 * StateMachine.js
 */

class StateMachine {
    //a pointer to the agent that owns this instance

    constructor( owner ) {
        this.m_pOwner = owner;
        this.m_pCurrentState = null;
        this.m_pPreviousState = null;
        this.m_pGlobalState = null;
    };

    finalize() {
        super.finalize();
    };

    //use these methods to initialize the FSM
    SetCurrentState( s ) {
        this.m_pCurrentState = s;
    };

    SetGlobalState( s ) {
        this.m_pGlobalState = s;
    };

    SetPreviousState( s ) {
        this.m_pPreviousState = s;
    };

    //call this to update the FSM
    Update() {
        //if a global state exists, call its execute method, else do nothing
        if ( this.m_pGlobalState != null) {
            this.m_pGlobalState.Execute( this.m_pOwner );
        }

        //same for the current state
        if ( this.m_pCurrentState != null ) {
            this.m_pCurrentState.Execute( this.m_pOwner );
        };
    };

    HandleMessage( msg ) {
        //first see if the current state is valid and that it can handle
        //the message
        if ( this.m_pCurrentState != null && this.m_pCurrentState.OnMessage( this.m_pOwner, msg ) ) {
            return true;
        };

        //if not, and if a global state has been implemented, send 
        //the message to the global state
        if ( this.m_pGlobalState != null && this.m_pGlobalState.OnMessage( this.m_pOwner, msg ) ) {
            return true;
        };

        return false;
    };

    //change to a new state
    ChangeState( pNewState ) {
        if ( !( pNewState != null ) ) console.log( "<StateMachine::ChangeState>: trying to change to NULL state" );

        //keep a record of the previous state
        this.m_pPreviousState = this.m_pCurrentState;

        //call the exit method of the existing state
        this.m_pCurrentState.Exit( this.m_pOwner );

        //change state to the new state
        this.m_pCurrentState = pNewState;

        //call the entry method of the new state
        this.m_pCurrentState.Enter( this.m_pOwner );
    };

    //change state back to the previous state
    RevertToPreviousState() {
        ChangeState( this.m_pPreviousState );
    };

    //returns true if the current state's type is equal to the type of the
    //class passed as a parameter. 
    isInState( st ) {
        return this.m_pCurrentState.constructor.name == st.constructor.name;
    };

    CurrentState() {
        return this.m_pCurrentState;
    };

    GlobalState() {
        return this.m_pGlobalState;
    };

    PreviousState() {
        return this.m_pPreviousState;
    };
    //only ever used during debugging to grab the name of the current state

    GetNameOfCurrentState() {
        //let s = this.m_pCurrentState.getClass().getName().split("\\.");
        //if( s.length > 0 ) {
        //    return s[s.length-1];
        //}
        //return this.m_pCurrentState.getClass().getName();
        return this.m_pCurrentState.constructor.name;
    };
};