/**
 * Desc:   2D Matrix class 
 * 
 * 
 */

class Matrix {

    constructor() {
        this._11 = 0.0;
        this._12 = 0.0;
        this._13 = 0.0;
        this._21 = 0.0;
        this._22 = 0.0;
        this._23 = 0.0;
        this._31 = 0.0;
        this._32 = 0.0;
        this._33 = 0.0;
    };
};

class C2DMatrix {

    constructor() {
        this.m_Matrix = new Matrix();
        //initialize the matrix to an identity matrix
        this.Identity();
    };

    //accessors to the matrix elements
    _11( val ) {
        this.m_Matrix._11 = val;
    };

    _12( val ) {
        this.m_Matrix._12 = val;
    };

    _13( val ) {
        this.m_Matrix._13 = val;
    };

    _21( val ) {
        this.m_Matrix._21 = val;
    };

    _22( val ) {
        this.m_Matrix._22 = val;
    };

    _23( val ) {
        this.m_Matrix._23 = val;
    };

    _31( val ) {
        this.m_Matrix._31 = val;
    };

    _32( val ) {
        this.m_Matrix._32 = val;
    };

    _33( val ) {
       this.m_Matrix._33 = val;
    };

    //multiply two matrices together
    MatrixMultiply( mIn ) {
        let mat_temp = new Matrix();

        //first row
        mat_temp._11 = ( this.m_Matrix._11 * mIn._11 ) + ( this.m_Matrix._12 * mIn._21 ) + ( this.m_Matrix._13 * mIn._31 );
        mat_temp._12 = ( this.m_Matrix._11 * mIn._12 ) + ( this.m_Matrix._12 * mIn._22 ) + ( this.m_Matrix._13 * mIn._32 );
        mat_temp._13 = ( this.m_Matrix._11 * mIn._13 ) + ( this.m_Matrix._12 * mIn._23 ) + ( this.m_Matrix._13 * mIn._33 );

        //second
        mat_temp._21 = ( this.m_Matrix._21 * mIn._11 ) + ( this.m_Matrix._22 * mIn._21 ) + ( this.m_Matrix._23 * mIn._31 );
        mat_temp._22 = ( this.m_Matrix._21 * mIn._12 ) + ( this.m_Matrix._22 * mIn._22 ) + ( this.m_Matrix._23 * mIn._32 );
        mat_temp._23 = ( this.m_Matrix._21 * mIn._13 ) + ( this.m_Matrix._22 * mIn._23 ) + ( this.m_Matrix._23 * mIn._33 );

        //third
        mat_temp._31 = ( this.m_Matrix._31 * mIn._11 ) + ( this.m_Matrix._32 * mIn._21 ) + ( this.m_Matrix._33 * mIn._31 );
        mat_temp._32 = ( this.m_Matrix._31 * mIn._12 ) + ( this.m_Matrix._32 * mIn._22 ) + ( this.m_Matrix._33 * mIn._32 );
        mat_temp._33 = ( this.m_Matrix._31 * mIn._13 ) + ( this.m_Matrix._32 * mIn._23 ) + ( this.m_Matrix._33 * mIn._33 );

        this.m_Matrix = mat_temp;
    };

    //applies a 2D transformation matrix to a std::vector of Vector2Ds
    TransformVector2Ds( vPoint ) {
        if ( Array.isArray( vPoint ) ) {

            //let it = vPoint.listIterator();
            //while ( it.hasNext() ) {
            //    let i = it.next();
            for( let it = 0, size = vPoint.length; it < size; it++ ){

                let i = vPoint[ it ];

                let tempX = ( this.m_Matrix._11 * i.x ) + ( this.m_Matrix._21 * i.y ) + ( this.m_Matrix._31 );
                let tempY = ( this.m_Matrix._12 * i.x ) + ( this.m_Matrix._22 * i.y ) + ( this.m_Matrix._32 );
                i.x = tempX;
                i.y = tempY;
            };

        } else {
        
            let tempX = ( this.m_Matrix._11 * vPoint.x ) + ( this.m_Matrix._21 * vPoint.y ) + ( this.m_Matrix._31 );
            let tempY = ( this.m_Matrix._12 * vPoint.x ) + ( this.m_Matrix._22 * vPoint.y ) + ( this.m_Matrix._32 );

            vPoint.x = tempX;
            vPoint.y = tempY;
        };

    };

    //applies a 2D transformation matrix to a single Vector2D
    //TransformVector2Ds( vPoint ) {

    //    let tempX = ( this.m_Matrix._11 * vPoint.x ) + ( this.m_Matrix._21 * vPoint.y ) + ( this.m_Matrix._31 );
    //    let tempY = ( this.m_Matrix._12 * vPoint.x ) + ( this.m_Matrix._22 * vPoint.y ) + ( this.m_Matrix._32 );

    //    vPoint.x = tempX;
    //    vPoint.y = tempY;
    //};

    //create an identity matrix
    Identity() {
        this.m_Matrix._11 = 1;
        this.m_Matrix._12 = 0;
        this.m_Matrix._13 = 0;
        this.m_Matrix._21 = 0;
        this.m_Matrix._22 = 1;
        this.m_Matrix._23 = 0;
        this.m_Matrix._31 = 0;
        this.m_Matrix._32 = 0;
        this.m_Matrix._33 = 1;

    };

    //create a transformation matrix
    Translate( x,  y ) {
        let mat = new Matrix();

        mat._11 = 1; mat._12 = 0; mat._13 = 0;
        
        mat._21 = 0; mat._22 = 1; mat._23 = 0;
        
        mat._31 = x; mat._32 = y; mat._33 = 1;

        //and multiply
        this.MatrixMultiply(mat);
    };

    //create a scale matrix
    Scale( xScale,  yScale ) {
        let mat = new Matrix();

        mat._11 = xScale; mat._12 = 0; mat._13 = 0;

        mat._21 = 0; mat._22 = yScale; mat._23 = 0;

        mat._31 = 0; mat._32 = 0; mat._33 = 1;

        //and multiply
        this.MatrixMultiply(mat);
    };

    //create a rotation matrix !!overload function manager!!
    Rotate( a, b ) {

        switch( arguments.length ) {
            case 1:
                this.Rotate_1P( a );
                break;
            case 2:
                this.Rotate_2P( a, b );
                break;
            default:
                console.log( " Matrix rotate function overload error ");
        };

    };


    //create a rotation matrix
    Rotate_1P( rot ) {
        let mat = new Matrix();

        let Sin = Math.sin( rot );
        let Cos = Math.cos( rot );

        mat._11 = Cos; mat._12 = Sin; mat._13 = 0;
        mat._21 = -Sin; mat._22 = Cos; mat._23 = 0;
        mat._31 = 0; mat._32 = 0; mat._33 = 1;

        //and multiply
        this.MatrixMultiply( mat );
    };

    //create a rotation matrix from a 2D vector
    Rotate_2P( fwd, side ) {
        let mat = new Matrix();

        mat._11 = fwd.x; mat._12 = fwd.y;  mat._13 = 0;
        mat._21 = side.x; mat._22 = side.y; mat._23 = 0;
        mat._31 = 0; mat._32 = 0; mat._33 = 1;

        //and multiply
        this.MatrixMultiply( mat );
    };

};