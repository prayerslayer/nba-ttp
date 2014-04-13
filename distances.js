var distances = {
	'ATL': {
		'BKN': 24,
		'BOS': 53,
		'PHI': 38
	},
	'BKN': {
		'ATL': 24,
		'BOS': 65,
		'PHI': 62
	},
	'BOS': {
		'ATL': 53,
		'BKN': 65,
		'PHI': 82
	},
	'PHI': {
		'ATL': 38,
		'BKN': 62,
		'BOS': 82
	}
};

exports.between = function between( a, b ) {
	if ( a === b ) return 0;
	return distances[a][b];
};