var m = require( 'mori' );

var params,
    makeSeedFn,
    initialSeeds,
    mutateFn,
    makeBabyFn,
    fitnessFn,
    selectFn;

function defaults( value, def ) {
    if ( typeof value !== 'undefined' )
        return;
    value = def;
}

function normalize( max ) {
    return function( value ) {
        return value / max;
    };
}

function smallerThan( val ) {
    return function( a ) {
        return a < val;
    };
}

function findMaximum( acc, next ) {
    return next > acc ? next : acc;
}

function crossover( parents ) {
    var parentA = m.nth( parents, 0 ),
        parentB = m.nth( parents, 1 ),
        offspringA = Math.random() < params.crossoverProbability ? makeBabyFn( parentA, parentB ) : parentA,
        offspringB = Math.random() < params.crossoverProbability ? makeBabyFn( parentB, parentA ) : parentB;
    return m.vector( offspringA, offspringB );
};

// select defaults to this one
selectFn = function select( genomes ) {
    // normalize based on fitness, sort, take random number, first >= random number wins
    var fitties = m.map( fitnessFn, genomes ),
        max = m.reduce( findMaximum, 0, fitties ),
        unit = normalize( max ),
        kill = smallerThan( Math.random() ),
        chosens = m.drop_while( m.comp( kill, unit, fitnessFn ), genomes ),
        neo = m.first( chosens );

    return neo;
};

mutateFn = m.identity;

exports.fitness = function fitness( fit ) {
    if ( !fit ) return;
    fitnessFn = fit;
};

exports.select = function select( select ) {
    if ( !select ) return;
    selectFn = select;
};

exports.offspring = function offspring( offspring ) {
    if ( !offspring ) return;
    makeBabyFn = offspring;
};

exports.mutate = function mutate( mutate ) {
    if ( !mutate ) return;
    mutateFn = mutate;
};

exports.seed = function seed( seeds ) {
    // seeds may either be a function to create one or an array of seeds to use
    if ( !seeds ) return;

    if ( typeof seeds === 'function' ) {
        makeSeedFn = seeds;
    }
    if ( typeof seeds === 'object' && seeds.length ) {
        initialSeeds = m.seq( seeds );
    }
};

exports.run = function run( config ) {
    if ( !config ) {
        config = {
            'crossoverProbability': 0.3,
            'mutationProbability': 0.001, // not yet used
            'population': 100,
            'generations': 10,
            'killWeak': true,
            'generationGap': 0.1 // replace 10% of population in every generation
        };
    } else {
        defaults( config.crossoverProbability, 0.3 );
        defaults( config.mutationProbability, 0.001 );
        defaults( config.population, 100 );
        defaults( config.generations, 10 );
        defaults( config.killWeak, true );
        defaults( config.generationGap, 0.1 );
    }
    params = config;

    // seed initial population
    // if there are no seeds set, we generate them
    if ( !initialSeeds ) {
        // check if there is a function to create a seed
        if ( !makeSeedFn ) {
            throw new Error( 'You must specify seeds or a function to create one.' );
        }
        // seed
        population = m.map( makeSeedFn, m.range( config.population ) );
    } else {
        population = initialSeeds;
    }
    var start = Date.now(),
        births,
        chosenOnes = m.vector(),
        parents,
        offsprings,
        killingSum = 0,
        parentSum = 0;
    for( var i = 0; i < config.generations; i++ ) {
        console.log( 'Current generation is ', i, ' with population ', m.count( population ) );
        // calculate how many children we need
        births = m.count( population ) * config.generationGap;
        // select 10 % of population to have children
        m.empty( chosenOnes );
        m.each( m.range( births ), function() {
            console.log( 'Selecting...' );
            chosenOnes = m.conj( chosenOnes, selectFn( population ) );
        });
        console.log( 'Pairing...' );
        // make babies
        parents = m.partition( 2, chosenOnes );                                  // group them in 2
        console.log( 'Reproducing...' );
        offsprings = m.map( crossover, parents );                                // make 2 babies
        offsprings = m.map( mutateFn, offsprings );                              // mutate babies
        population = m.into( population, m.mapcat( m.identity, offsprings ) );   // unfold babies in population
        if ( config.killWeak ) {
            console.log( 'KILLING SPREEE' );
            // kill worst 10 % of population
            population = m.take( config.population, m.reverse( m.sort_by( fitnessFn, population ) ) );
        }
    }
    var end = Date.now();
    console.log( 'Simulation ran for', end - start, 'ms.' );
    return m.nth( population, 0 );
};