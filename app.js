var teams = require( './teams' ),
	util = require( './util' ),
	distance = require( './distances' ),
	scheduler = require( './scheduler' ),
	darwin = require( './darwin' ),
	m = require( 'mori' );

function getDistance( a,b ) {
	return distance.between( a, b );
}

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

	// TODO add home location first and last too
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
		 		end   = m.nth( travel, 1 );
			return fitness += distance.between( start, end );
		}, 0, getRouteFor( team, schedule ) );	
	});
	return overallFitness;
}

// a genome is an array of teams
darwin.fitness( fitness );

darwin.offspring( function makeBaby( a, b ) {
	var size = m.count( a ),
		start = util.random( size ),
		end = util.random( size );
	// switch them to be in order
	if ( start > end ) {
		var tmp = start;
		start = end;
		end = tmp;
	}
	//TODO this is not how offspringing should work as no values are compared
	var offspring = m.into( m.vector(), m.subvec( b, 0, start ) );
	offspring = m.into( offspring, m.subvec( a, start, end ) );
	offspring = m.into( offspring, m.subvec( b, end ) );
	return offspring;
});

darwin.seed( function() {
	//TODO random seeds!
	return m.into( m.vector(), m.reverse( teams.all() ) );
});

var solution = darwin.run();
console.log( solution, fitness( solution ) );