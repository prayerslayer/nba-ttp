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

	// containsTeam 'BOS' [ BOS, MIA ] => true
	function containsTeam( team ) {
		return function( pairing ) {
			return m.nth( pairing, 0 ) === team || m.nth( pairing, 1 ) === team;	
		}
	}

	function getHomeTeam( pairing ) {
		return m.nth( pairing, 0 );
	}

	// returns [ [ atl, bos ], [ bos, phi ], [ phi, atl ], [ atl, atl ] ...]
	function getRouteFor( team, schedule ) {
		return m.partition( 2, 1, m.flatten( m.map( function( gd ) {
			return m.map( getHomeTeam, m.filter( containsTeam( team ), gd ) );
		}, schedule ) ) );
	}
	
	var overallFitness = 0;
	m.each( genome, function( team ) {
		 overallFitness += m.reduce( function( fitness, travel ) {
		 	var start = m.nth( travel, 0 ),
		 		end = m.nth( travel, 1 );
			return fitness += distance.between( start, end );
		}, 0, getRouteFor( team, schedule ) );	
	});
	return overallFitness;
};

function select( genomes ) {
	// normalize based on fitness, sort, take random number, first >= random number wins
	return 0;
};

function makeBaby( a, b ) {
	var size = m.count( a ),
		start = util.random( size - 1 ),
		end = util.random( size - 1 );
	// switch them to be in order
	if ( start > end ) {
		var tmp = start;
		start = end;
		end = tmp;
	}

	var offspring = m.into( m.vector(), m.subvec( b, 0, start ) );
	offspring = m.into( offspring, m.subvec( a, start, end ) );
	offspring = m.into( offspring, m.subvec( b, end ) );
	return offspring;
}

function crossover( parentA, parentB ) {
	var offspringA = makeBaby( parentA, parentB ),
		offspringB = makeBaby( parentB, parentA );
}

console.log( crossover( teams.all(), m.into( m.vector(), m.reverse( teams.all() ) )  ) );