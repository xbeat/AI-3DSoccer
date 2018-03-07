/**
 * TreeSet.js
 */

class TreeSet{

	constructor( compactor ){
		this.length = 0;
		this.elements = [];
		if( compactor )
			this.compactor = compactor;
		else
			this.compactor = function( a, b ){ return a - b };
	};

	size(){
		return this.elements.length;
	};

	last(){
		return this.elements[ this.length-1 ];
	};

	first(){
		return this.elements[ 0 ];
	};

	isEmpty(){
		return this.size() === 0;
	};

	clear(){
		elements.splice( 0, elements.length );
	};
	
	remove( index ){
		if( this.length > 0 ){
			this.elements.splice( index, 1 );
		};
		return null;
	};
	
	pollLast(){
		if( this.length > 0 ){
			this.length--;
			return this.elements.splice( this.length, 1 );
		};
		return null;
	};

	pollFirst(){
		if( this.length > 0 ) {
			this.length--;
			return this.elements.splice( 0, 1 );
		};
		return null;
	};

	add( element ){
		let index = this.binarySearch( element );
		if( index < 0 ){
			index = -index - 1;
		}
		this.elements.splice( index, 0, element );
		this.length++;
	}

	/**
     * Performs a binary search of value in array
     * @param {number[]} array - Array in which value will be searched. It must be sorted.
     * @param {number} value - Value to search in array
     * @return {number} If value is found, returns its index in array. Otherwise, returns a negative number indicating where the value should be inserted: -(index + 1)
     */
	binarySearch( value ) {
		var low = 0;
		var high = this.elements.length - 1;

		while ( low <= high ) {
			var mid = ( low + high ) >>> 1;
			var midValue = this.elements[ mid ];
			var cmp = this.compactor( midValue, value );
			if ( cmp < 0 ) {
				low = mid + 1;
			} else if ( cmp > 0 ) {
				high = mid - 1;
			} else {
				return mid;
			};
		};

		return -( low + 1 );
	};
};