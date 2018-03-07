/**
 * Desc: Base class to define a common interface for all game
 *       entities
 * 
 */

class BaseGameEntity {

    /**
     *  this must be called within each constructor to make sure the ID is set
     *  correctly. It verifies that the value passed to the method is greater
     *  or equal to the next valid ID, before setting the ID and incrementing
     *  the next valid ID
     */
    SetID( val ) {
        //make sure the val is equal to or greater than the next available ID
        if ( !( val >= Global.m_iNextValidID ) ) console.log( "<BaseGameEntity::SetID>: invalid ID" );

        this.m_ID = val;

        Global.m_iNextValidID = this.m_ID + 1;
    };

    //------------------------------ ctor -----------------------------------------
    //-----------------------------------------------------------------------------
    constructor( ID ) {
        //its location in the environment
        this.m_vPosition = new Vector2D();

        this.default_entity_type = -1;
        //each entity has a unique ID
        this.m_ID;
        //this is the next valid ID. Each time a BaseGameEntity is instantiated
   
        // the magnitude of this object's bounding radius
        this.m_dBoundingRadius = 0.0;
        this.m_vScale = new Vector2D( 1.0, 1.0 );
        //every entity has a type associated with it (health, troll, ammo etc)
        this.m_iType = this.default_entity_type;
        //this is a generic flag. 
        this.m_bTag = false;

        this.SetID( ID );
    };

    finalize() {
        super.finalize();
    };

    Update() {};

    Render() {};

    HandleMessage( msg ) {
        return false;
    };

    //entities should be able to read/write their data to a stream
    //virtual void Write(std::ostream&  os)const{}
    //virtual void Read (std::ifstream& is){}
    //use this to grab the next valid ID
    static GetNextValidID() {      
        return Global.m_iNextValidID;
    };

    //this can be used to reset the next ID
    ResetNextValidID() {
        Global.m_iNextValidID = 0;
    };

    Pos() {
        return new Vector2D( this.m_vPosition );
    };

    SetPos( new_pos ) {
        this.m_vPosition = new Vector2D( new_pos );
    };

    BRadius() {
        return this.m_dBoundingRadius;
    };

    SetBRadius( r ) {
        this.m_dBoundingRadius = r;
    };

    ID() {
        return this.m_ID;
    };

    IsTagged() {
        return this.m_bTag;
    };

    Tag() {
        this.m_bTag = true;
    };

    UnTag() {
        this.m_bTag = false;
    };

    Scale() {
        return new Vector2D( this.m_vScale );
    };

    static SetScale( A ){

        if ( typeof a  === 'object' ){
            this.SetScaleV( A );
        } else {
            this.SetScaleD( A );
        };  

    };

    SetScaleV( val ) {
        this.m_dBoundingRadius *= utils.MaxOf( val.x, val.y ) / utils.MaxOf( this.m_vScale.x, this.m_vScale.y );
        this.m_vScale = new Vector2D( val );
    };

    SetScaleD( val ) {
        this.m_dBoundingRadius *= ( val / utils.MaxOf( this.m_vScale.x, this.m_vScale.y ) );
        this.m_vScale = new Vector2D( val, val );
    };

    EntityType() {
        return this.m_iType;
    };

    SetEntityType( new_type ) {
        this.m_iType = this.new_type;
    };
};