var mori = require( 'mori' ),
    teams = mori.vector( 'ATL', 'BOS', 'PHI', 'BKN' );

exports.all = function all() {
	return teams;
};

exports.get = function get( id ) {
	return mori.nth( teams, id );
};