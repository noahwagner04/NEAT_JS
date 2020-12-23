/*
the genotype in a organsim,is 
responsible for creating the 
network, mutations, and crossover
*/
class Genome {
	constructor(config) {
		this.nodeG = [];		// a list of all node genes in this genome
		this.connectionG = [];  // a list of all connection genes in this genome

		this.inNum = config.inNum;	 // the number of in node genes this genome will have
		this.outNum = config.outNum; // the number of out node genes this genome will have

		this.recur = config.recur; 		   // whether or not to allow for reccurent connections
		this.maxHidden = config.maxHidden; // the max hidden nodes that this genome can evolve

		this.nodeActivation = config.nodeActivation; 		 // this atribute decides how nodes should be activated
		this.randomNodeActivation = config.evolveActivation; // whether or not we should randomly choose an activation per node

		this.phenotype = undefined;

		this.init(); // initializes the genome
	}

	// return a clone of this genome
	clone() {

	}

	// returns an array of the input nodes in nodeG
	getInputs() {
		let result = [];
		this.nodeG.forEach(nodeGene => {
			if (nodeGene.ntype === nodeTypes.SENSOR) result.push(nodeGene);
		});
		return result;
	}

	// returns an array of the output nodes in nodeG
	getOutputs() {
		let result = [];
		this.nodeG.forEach(nodeGene => {
			if (nodeGene.placement === nodePlaces.OUTPUT) result.push(nodeGene);
		});
		return result;
	}

	/*
	initialize function, creates the initial node genes
	and connection genes
	*/
	init() {
		this.initInputGenes(0);
		this.initOutputGenes(this.nodeG.length);
		this.initConnections(this.getInputs(), this.getOutputs());
	}

	/*
	initializes the input node genes,
	checks whether a node should be a bias 
	or input, then adds it to the nodeG array, labels
	node ids starting at a given id
	*/
	initInputGenes(id) {
		for (let i = id; i < this.inNum + id; i++) {
			let currentNodeG = undefined;
			if (i > 0) currentNodeG = new NodeGene({
				id: i,
				ntype: nodeTypes.SENSOR,
				placement: nodePlaces.INPUT
			});
			else currentNodeG = new NodeGene({
				id: i,
				ntype: nodeTypes.SENSOR,
				placement: nodePlaces.BIAS
			});
			this.nodeG.push(currentNodeG);
		}
	}

	/*
	initializes the output node genes, labels the
	id of the nodes starting at a given id
	*/
	initOutputGenes(id) {
		for (let i = id; i < this.outNum + id; i++) {
			let currentNodeG = new NodeGene({
				id: i,
				ntype: nodeTypes.NEURON,
				placement: nodePlaces.OUTPUT
			});
			this.nodeG.push(currentNodeG);
		}
	}

	/*
	initializes connection genes of this genome, takes
	two arrays, input and output to iterate over, weight is
	between -1, 1
	*/
	initConnections(inputs, outputs) {
		let innov = 0;
		for (let i = 0; i < inputs.length; i++) {
			for (let j = 0; j < outputs.length; j++) {
				this.connectionG.push(new ConnectionGene({
					inNode: inputs[i],
					outNode: outputs[j],
					weight: Math.random() * 2 - 1,
					isRecur: false,
					enabled: true,
					innov: innov
				}));
				innov++;
			}
		}
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

	/*
	chooses from the activationTypes array,
	which has the six default activation functions
	in it, the user can add their own functions to the
	array and this function will have no problem with 
	ranomly picking it
	*/
	static chooseActivationFunc() {
		let rdmIndex = Math.floor(Math.random() * activationTypes.length);
		return activationTypes[rdmIndex];
	}
}