var teams = require( './teams' ),
	util = require( './util' ),
	distance = require( './distances' ),
	scheduler = require( './scheduler' ),
	m = require( 'mori' );

function getDistance( a,b ) {
	return distance.between( a, b );
}

// a genome is an array of teams
function fitness( genome ) {
	// first generate the schedule
	var schedule = scheduler.schedule( genome );

	// [ BOS, MIA ]
	// containsTeam 'BOS' [ BOS, MIA ] => true
	function containsTeam( team ) {
		return function( pairing ) {
			return m.nth( pairing, 0 ) === team || m.nth( pairing, 1 ) === team;	
		}
	}

	function getHomeTeam( pairing ) {
		return m.nth( pairing, 0 );
	}

	function getPlacesFor( team ) {
		return function( schedule ) {
			return m.partition( 2, 1, m.flatten( m.map( function( gd ) {
				return m.map( getHomeTeam, m.filter( containsTeam( team ), gd ) );
			}, schedule ) ) );
		};
	}

	// [ bos, phi, atl, atl, atl, nyk, atl ]
	return m.reduce( function( fitness, travel ) {
		return fitness += distance.between( m.nth( travel, 0 ), m.nth( travel, 1 ) );
	}, 0, getPlacesFor( 'ATL' )(schedule) );
};

function select( genomes ) {
	// normalize based on fitness, sort, take random number, first >= random number wins
	return 0;
};

function crossover( a, b ) {
	var start = util.random( a.length - 1 ),
		end = util.random( a.lenght - 1 );

	// now here object comparison gets relevant, install mori
}

console.log( fitness( teams.all() ) );