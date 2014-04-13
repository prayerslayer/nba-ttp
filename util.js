// transform [ 0, 2, 3, 5 ] to [ 0, 3, 5, 2]
exports.shiftLeft = function shiftLeft( array, start ) {
	var toShift = array.splice( start ),
		firstOf = toShift.shift();

	toShift.push( firstOf );
	array.push.apply( array, toShift );
};

exports.random = function random( max, min ) {
	if ( arguments.length === 1 ) min = 0;
	if ( arguments.length === 0 ) max = 1;

	return Math.floor( Math.random() * ( max - min ) + min );
};