/**
 * 
 */

class CppToJava {

	static clone( o ) {

		function deepClone( obj ) {
			if ( Array.isArray( obj ) ) {
				let out = [], i = 0, len = obj.length;
				for ( ; i < len; i++ ) {
					out[ i ] = deepClone( obj[ i ] );
				};
				return out;
			};

			if ( typeof obj === 'object' ) {
				let out = {}, i;
				for ( i in obj ) {
					out[ i ] = deepClone( obj[ i ] );
				};
				return out;
			};
			return obj;
		};

		return deepClone( o );
	};
};