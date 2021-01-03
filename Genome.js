/*
the genotype in a organsim,is 
responsible for creating the 
network, mutations, and crossover
*/
class Genome {
	constructor(inNum, outNum, recur, maxHidden, nodeActivation, evolveActivation) {
		if (arguments.length === 1 && arguments[0] instanceof Genome) { // check to see if we only recieve a genome, if so, exicute copy constructor
			let genome = arguments[0];
			this.nodeG = genome.copyNodeG();			 // a list of copied node genes from genome
			this.connectionG = genome.copyConnectionG(); // a list of all connection genes copied from genome, takes new copied nodes to reconnect connections with

			this.inNum = genome.inNum;	 // the number of in node genes this genome copied from genome
			this.outNum = genome.outNum; // the number of out node genes this genome copied from genome

			this.recur = genome.recur; 		   // whether or not to allow for reccurent connections copied from genome
			this.maxHidden = genome.maxHidden; // the max hidden nodes that this genome can evolve copied from genome

			this.nodeActivation = genome.nodeActivation; 		 // what activation function to use for the nodes copied from genome
			this.randomNodeActivation = genome.evolveActivation; // whether or not we should randomly choose an activation per node copied from genome

			this.phenotype = undefined;

		} else if(arguments.length === 2){ // check to see if we recieve nodeG and connectionG, if so, build genome off of those two arrays

		} else { // do the first gen constructor
			this.nodeG = [];		// a list of all node genes in this genome
			this.connectionG = [];  // a list of all connection genes in this genome

			this.inNum = inNum;	  	// the number of in node genes this genome will have
			this.outNum = outNum; 	// the number of out node genes this genome will have

			this.recur = recur; 		// whether or not to allow for reccurent connections
			this.maxHidden = maxHidden; // the max hidden nodes that this genome can evolve

			this.nodeActivation = nodeActivation; 		  // what activation function to use for the nodes
			this.randomNodeActivation = evolveActivation; // whether or not we should randomly choose an activation per node

			this.phenotype = undefined;

			this.init(); // initializes the genome, gets overriden when this genome is a copy of another
		}
	}

	/*
	creates a new nodeG array exactly 
	like this genomes nodeG then returns it.
	doesn't copy the net Node, as the phenotype creation
	is all done in construct network
	*/
	copyNodeG() {
		let newNodeG = [];
		this.nodeG.forEach(nodeGene => newNodeG.push(nodeGene.clone()));
		return newNodeG;
	}

	/*
	creates a new connectionG array exactly 
	like this genomes connectionG then returns it.
	takes a copied nodeG array from this genome to 
	replace each connetion node ref to copied node ref.
	depends on pre nodeG array to work.
	*/
	copyConnectionG() {
		let newConnectionG = [];
		this.connectionG.forEach(connectionGene => {
			newConnectionG.push(connectionGene.clone());
		});
		return newConnectionG;
	}

	/*
	return a clone of this genome, all phynotype(network)
	atributes are not copied.
	*/
	clone() {
		return new Genome(this);
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
	and connection genes, only used for first gen genomes
	*/
	init() {
		let id = 0;
		let inputs = [];
		let outputs = [];
		let innov = 0;
		/*
		initializes the input node genes,
		checks whether a node should be a bias 
		or input, then adds it to the nodeG array, labels
		node ids starting at a given id
		*/
		for (let i = 0; i < this.inNum; i++) {
			let currentNodeG = undefined;
			if (i > 0) currentNodeG = new NodeGene(i, nodeTypes.SENSOR, nodePlaces.INPUT);
			else currentNodeG = new NodeGene(i, nodeTypes.SENSOR, nodePlaces.BIAS);
			this.nodeG.push(currentNodeG);
			id++;
		}

		/*
		initializes the output node genes, labels the
		id of the nodes starting at a given id
		*/
		for (let i = id; i < this.outNum + id; i++) {
			let currentNodeG = new NodeGene(i, nodeTypes.NEURON, nodePlaces.OUTPUT);
			this.nodeG.push(currentNodeG);
		}

		inputs = this.getInputs();
		outputs = this.getOutputs();

		/*
		initializes connection genes of this genome, takes
		two arrays, input and output to iterate over, weight is
		between -1, 1
		*/
		inputs.forEach(input => {
			outputs.forEach(output => {
				this.connectionG.push(new ConnectionGene(input, output, Math.random() * 2 - 1, false, innov, true));
				innov++;
			});
		});
		return this;
	}

	/*
	creates a network from the node genes and 
	connection genes
	*/
	constructNetwork() {
		let inputs = [];
		let outputs = [];
		let all = [];

		/*
		creates a network node for each gene node
		in nodeG array, chooses activation function
		based on bool randomNodeActivation, then
		adds it to the apropiate array, input, output, or all
		*/
		this.nodeG.forEach(nodeGene => {
			let activationFunc = this.randomNodeActivation ? Genome.chooseActivationFunc() : this.nodeActivation;
			let node = nodeGene.createNetNode(activationFunc).netNode;
			if (nodeGene.ntype === nodeTypes.SENSOR) inputs.push(node);
			else if (nodeGene.placement === nodePlaces.OUTPUT) outputs.push(node);
			all.push(node);
		});

		/*
		creates new connections that live in
		the nodes in / out connection arrays,
		their inNode and outNode is a ref to 
		the networks nodes, not the node genes
		*/
		this.connectionG.forEach(connectionGene => {
			if(connectionGene.enabled === true) {
				let connection = connectionGene.connection;
				let inNode = connection.inNode.netNode;
				let outNode = connection.outNode.netNode;

				outNode.addIncoming(inNode, connection.weight, connection.isRecur);
			}
		});

		/*
		initializes the network with the
		node arrays, the adds a ref to this
		genome, and adds a ref to the network 
		in this.phenotype
		*/
		let network = new Network(inputs, outputs, all);

		network.genotype = this;
		this.phenotype = network;
		return this;
	}
	/*
	adds a new connection to this genome,
	takes in population to access innovs and
	currInnov
	*/
	mutateAddConection(population) {

	}

	/*
	adds a new node on a connection, splitting it in two
	and disabling it. Creates two new connections, the one leading
	to the new node(which receives a weight of one 
	for minimal decrease in preformance) and the one going out
	from the new node(which receives the same weight as the connection 
	originally split) takes in population to access innovs array, currNodeId
	and currInnov
	*/
	mutateAddNode(population) {
		let geneToSplit = undefined;
		let newGene1 = undefined;
		let newGene2 = undefined;
		let newNodeGene = undefined;

		/*
		get the gene to split, biasing older genes for 
		minimal effect of the change, allows spliting 
		of genes distrubute evenly amongst all genes
		*/
		for (let i = 0; i < this.connectionG.length; i++) {
			let currGene = this.connectionG[i];
			if (currGene.connection.inNode.placement === nodePlaces.BIAS || currGene.enabled === false) continue;
			else if (Math.random() < 0.7) {
				geneToSplit = currGene;
				break;
			} else if (i === this.connectionG.length - 1) geneToSplit = currGene;
		}

		if (geneToSplit === undefined) {
			return;
		}

		geneToSplit.enabled = false;

		let connection = geneToSplit.connection;
		let oldWeight = geneToSplit.connection.weight;

		let inNodeGene = geneToSplit.connection.inNode;
		let outNodeGene = geneToSplit.connection.outNode;

		let recur = geneToSplit.connection.isRecur;


		/*
		check if this mutation has already occurred
		in the rest of the population, if it has, make
		the new nodes id the same as the same innov's id,
		and make both new gene's innov nums be the same as
		the matched innov, if not, make new nodes id the currId + 1,
		and the genes innovs currInnov, and currInnov + 1
		*/
		let done = false;
		let index = 0;
		while (!done) {
			let innov = population.innovations[index];
			if (index === population.innovations.length) {
				newNodeGene = new NodeGene(population.currNodeId + 1, nodeTypes.NEURON, nodePlaces.HIDDEN);
				if (recur) {
					newGene1 = new ConnectionGene(inNodeGene, newNodeGene, 1, true, population.currInnov, true);
					newGene2 = new ConnectionGene(newNodeGene, outNodeGene, oldWeight, false, population.currInnov + 1, true);
				} else {
					newGene1 = new ConnectionGene(inNodeGene, newNodeGene, 1, false, population.currInnov, true);
					newGene2 = new ConnectionGene(newNodeGene, outNodeGene, oldWeight, false, population.currInnov + 1, true);
				}
				population.innovations.push(new Innovation(inNodeGene.id, outNodeGene.id, population.currInnov, population.currInnov + 1, population.currNodeId + 1, geneToSplit.innov));
				done = true;
			} else if (innov.type === innovTypes.NEWNODE &&
				innov.inNodeId === inNodeGene.id &&
				innov.outNodeId === outNodeGene.id &&
				innov.oldInnov === geneToSplit.innov) {
				newNodeGene = new NodeGene(innov.nodeId, nodeTypes.NEURON, nodePlaces.HIDDEN);
				if (recur) {
					newGene1 = new ConnectionGene(inNodeGene, newNodeGene, 1, true, innov.innovation, true);
					newGene2 = new ConnectionGene(newNodeGene, outNodeGene, oldWeight, false, innov.innovation2, true);
				} else {
					newGene1 = new ConnectionGene(inNodeGene, newNodeGene, 1, false, innov.innovation, true);
					newGene2 = new ConnectionGene(newNodeGene, outNodeGene, oldWeight, false, innov.innovation2, true);
				}
				done = true;
			} else index++;
		}

		population.currInnov += 2;
		population.currNodeId += 1;

		/*
		add the new genes and nodes to the
		nodeG and connectionG arrays, adds them
		in the correct order
		*/
		this.addGene(newGene1);
		this.addGene(newGene2);
		this.addNode(newNodeGene);
		return this;
	}

	/*
	either perturbes a weight, or randomizes it.
	This is done to all connections.
	*/
	mutateWeights(randomizeRate) {

	}

	/*
	mutates the genome, combining all the mutate
	methods to this one method, takes population for
	inputs to mutate funcs
	*/
	mutate(addNodeRate, addConnectionRate, randomizeRate, population) {

	}

	/*
	toggles a random connection gene on or off a given
	number of times, each time picking a random connection
	*/
	mutateToggleEnable(times) {

	}

	/*
	sorts the connectionG array from smallest innov
	to greatest innov
	*/
	sortGenes() {
		this.connectionG.sort((a, b) => a.innov - b.innov);
		return this;
	}

	/*
	sorts the nodeG array from smallest id
	to greatest id
	*/
	sortNodes() {
		this.nodeG.sort((a, b) => a.id - b.id);
		return this;
	}

	/*
	adds a gene to the connetionG array
	in the correct spot
	*/
	addGene(connectionGene) {
		let index = 0;
		while (index !== this.connectionG.length && this.connectionG[index].innov < connectionGene.innov) {
			index++;
		}
		this.connectionG.splice(index, 0, connectionGene);
		return this;
	}

	/*
	adds a node gene to the nodeG array
	in the correct spot
	*/
	addNode(nodeGene) {
		let index = 0;
		while (index !== this.nodeG.length && this.nodeG[index].id < nodeGene.id) {
			index++;
		}
		this.nodeG.splice(index, 0, nodeGene);
		return this;
	}

	/*
	breeds two gemomes together using the NEAT
	competeing conventions solution returns a new
	genome
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
	static compatibility(genome1, genome2, c1, c2, c3) {

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