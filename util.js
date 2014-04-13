exports.random = function random( max, min ) {
	if ( arguments.length === 1 ) min = 0;
	if ( arguments.length === 0 ) return Math.random();
	return Math.floor( Math.random() * ( max - min + 1 ) + min );
};