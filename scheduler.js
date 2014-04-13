var m = require( 'mori' ),
	util = require( './util' );

// a schedule is a n*n-1 / 2 sized array 
//  [ 
// 	  [ [ bkn, nyk ], [ bos, phi ], [ atl, mia ] ],
// 	  [ [], [], ...]
//  ]

exports.schedule = function( allTeams, rounds ) {
	if ( !rounds ) rounds = 2;
	
	var schedule = m.vector(),
		teams = allTeams,
		gameDays = rounds*( m.count( teams ) );
	
	for (var gd = gameDays - 1; gd >= 0; gd--) {
		var pairings, gameDay;

		if ( gd < gameDays / rounds ) {
			pairings = m.partition( 2, m.interleave( teams, m.reverse( teams ) ) );
		} else {
			pairings = m.partition( 2, m.interleave( m.reverse( teams ), teams ) );
		}

		gameDay = m.take( m.count( pairings ) / 2, pairings );

		schedule = m.conj( schedule, gameDay );

		var newTeams = m.vector( m.get( teams, 0 ) );
		newTeams = m.into( newTeams, m.subvec( teams, 2 ) );
		newTeams = m.conj( newTeams, m.get( teams, 1 ) );
		
		teams = newTeams;
	};
	return schedule;
};