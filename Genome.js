/*
the genotype in a organsim,
is responsible for creating
the network, mutations, and 
crossover
*/
class Genome {
	constructor(inNum, outNum, maxHidden, recur) {
		this.nodeG = []; 			// a list of all node genes in this genome
		this.connectionG = []; 		// a list of all connection genes in this genome

		this.recur = recur; 		// whether or not to allow for reccurent connections
		this.maxHidden = maxHidden; // the max hidden nodes that this genome can evolve
	}

	// return a clone of this genome
	clone() {

	}

	/*
	initialize function, creates the initial node genes
	and connection genes
	*/
	init() {

	}

	/*
	creates a network from the node genes and 
	connection genes
	*/
	constructNetwork() {

	}

	// adds a new connection to this genome
	mutateAddConection(innovs) {

	}

	/*
	adds a new node on a connection, splitting it in two
	and disabling it. Creates two new connections, the one leading
	to the new node(which recieves a weight of one 
	for minimal decrease in preformance) and the one going
	from the new node.
	*/
	mutateAddNode(innovs) {

	}

	/*
	either perturbes a weight, or randomizes it.
	This is done to all connections.
	*/
	mutateWeights(randomizeRate) {

	}

	/*
	mutates the genome, combining all the mutate
	methods to this one method
	*/
	mutate(addNodeRate, addConnectionRate, randomizeRate) {

	}

	/*
	breeds two gemomes together using the NEAT
	competeing conventions solution
	*/
	static breed(genome1, genome2, fit1, fit2) {

	}

	/*
	compares two genomes compatibility to be in the same species
	using the NEAT compatibility method. It uses three global parameters
	c1, c2, and c3, which changes the importance of disjoint, excess, and wieght
	value. It uses the compatibility threshold global parameter to see
	whether they are in the same species.
	*/
	static compatibility(genome1, genome2) {

	}
}