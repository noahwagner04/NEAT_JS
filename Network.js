/*
this class is the phenotype of an organism,
and gets constructed by the genome, its soul 
purpose is to compute an output
*/
class Network {
	constructor(config) {
		this.inputs = config.inputs;    // just input neurons
		this.outputs = config.outputs;  // just output neurons
		this.all = config.all;		    // all neurons, HIDDEN, OUTPUT, BIAS, and INPUT

		this.genotype = undefined;	    // used to match the genome to this network

		this.connectionNum = undefined; // number of all connections
		this.nodeNum = undefined; 		// number of all nodes
	}

	/*
	this resets the network,
	uses recursive function that
	flushes backwards through the whole
	network starting at the output nodes
	*/
	flush() {

	}

	/*
	activates the network till
	all outputs are active, simulates
	one time step of activation, it uses
	recursive functions from the node class
	to go through the entire network cleanly
	*/
	activate() {

	}

	//adds input neuron to the input list
	addInput() {

	}

	// adds output neuron to the output list
	addOutput() {

	}

	/*
	loads an array of values to all
	the input nodes, each index of the 
	array goes to each input neuron, array
	has to be the same length as the input
	array
	*/
	loadSensors() {

	}

	/*
	overrides the output neurons with given
	array of inputs values to be overriden with
	must be the same length as output array
	*/
	overrideOutputs() {

	}

	/*
	count the amount of nodes in this network
	then put the value to nodeNum
	*/
	countNodes() {

	}

	/*
	counts the amount of connections in this network
	then puts that value in to connectionNum
	*/
	countConnections() {

	}

	/*
	recursivly checks if a potential connection is
	recurrent or not.
	*/
	checkRecur() {

	}

	/*
	true when even one output is off,
	returns false when all outputs are activated
	*/
	checkOutputsOff() {

	}
}