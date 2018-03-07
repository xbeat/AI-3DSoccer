/*
 * Desc: misc utility functions and constants
 * 
 * utils.js
 */

class utils {
    //a few useful finalants

    constructor(){
        this.use_last = false;
    };

    /**
     * returns true if the value is a NaN
     */
    static isNaN( val ) {
        return !( val != null );
    }

    static DegsToRads( degs ) {
        return this.TwoPi * ( degs / 360.0 );
    }

    //compares two real numbers. Returns true if they are equal
    static isEqual( a,  b ) {
        if ( Math.abs( a - b ) < 1E-12 ) {
            return true;
        };

        return false;
    };

    //----------------------------------------------------------------------------
    //  some random number functions.
    //----------------------------------------------------------------------------

    static setSeed( seed ) {
        rand.setSeed( seed );
    };

    //returns a random integer between x and y
    static RandInt( x, y ) {
        if ( !( y >= x ) ) console.log( "<RandInt>: y is less than x" );
        //return rand.nextInt( Integer.MAX_VALUE - x ) % ( y - x + 1 ) + x;
        return Math.floor( Math.random() * ( y - x + 1 ) + x );

    };

    //returns a random double between zero and 1
    static RandFloat() {
        return Math.random();
    };

    static RandInRange( x,  y ) {
        return x + Math.random() * ( y - x );
    };

    //returns a random bool
    static RandBool() {
        if ( Math.random() > 0.5 ) {
            return true;
        } else {
            return false;
        };
    };

    //returns a random double in the range -1 < n < 1
    static RandomClamped() {
        return Math.random() - Math.random();
    }

    //returns a random number with a normal distribution. See method at
    //http://www.taygeta.com/random/gaussian.html
    //static RandGaussian() {
    //    return RandGaussian(0, 1);
    //};

    static RandGaussian( mean = 0, standard_deviation = 1 ) {

        let x1, x2, w, y1;

        if ( use_last ) /* use value from previous call */ {
            y1 = y2;
            use_last = false;
        } else {
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);

            w = Math.sqrt( ( -2.0 * Math.log( w ) ) / w );
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
        };

        return ( mean + y1 * standard_deviation );
    };

    //-----------------------------------------------------------------------
    //  
    //  some handy little functions
    //-----------------------------------------------------------------------

    static Sigmoid( A,
                    B ){

        switch( arguments.length ) {
            case 1:
                return this.Sigmoid_1P( A );
                break;
            case 2:
                return this.Sigmoid_2P( A, B );
                break;
            default:
                console.log( " Sigmoid function overload error ");
        };

    };


    static Sigmoid_1P( input ) {
        return Sigmoid( input, 1.0 );
    };

    static Sigmoid_2P( input, response ) {
        return ( 1.0 / ( 1.0 + Math.exp( -input / response ) ) );
    };

    //returns the maximum of two values
    static MaxOf( a,  b ) {
        if ( a > b ) {
            return a;
        };
        return b;
    };

    //returns the minimum of two values
    static MinOf( a,  b ) {
        if ( a < b ) {
            return a;
        };
        return b;
    };

    /** 
     * clamps the first argument between the second two
     */
    static clamp( arg, minVal, maxVal ) {
        if ( !( minVal < maxVal ) ) console.log( "<Clamp>MaxVal < MinVal!" );

        if ( arg < minVal ) {
            return minVal;
        };

        if ( arg > maxVal ) {
            return maxVal;
        };
        return arg;
    };

};