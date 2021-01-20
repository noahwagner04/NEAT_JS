// gene representation of a node
class NodeGene {
	constructor(id, ntype, placement) {
		if(arguments.length === 1 && arguments[0] instanceof NodeGene) { // check to see of recieved nodeGene, if so, exicute copy constructor
			let nodeGene = arguments[0];
			this.netNode = undefined; // a reference to the node this gene creates
			this.id = nodeGene.id;
			this.ntype = nodeGene.ntype; 		     // the type of this node, either NEURON or SENSOR
			this.placement = nodeGene.placement;     // the placement of this node, either BIAS, INPUT, HIDDEN, or OUTPUT
		} else {
			this.netNode = undefined; 	   // a reference to the node this gene creates
			this.duplicate = undefined;		   // used for genome duplication
			this.id = id;
			this.ntype = ntype; 		   // the type of this node, either NEURON or SENSOR
			this.placement = placement;    // the placement of this node, either BIAS, INPUT, HIDDEN, or OUTPUT
		}
	}

	/*
	creates a node with a given activation func,
	takes population obj to get activation func
	*/
	createNetNode(population) {
		let activationFunc = undefined;
		if(population.NEAT.randomActivation) activationFunc = NodeGene.chooseActivationFunc;
		else activationFunc = population.NEAT.activationFunction;
		this.netNode = new Node(this.id, this.ntype, this.placement, activationFunc);
		return this;
	}


	// instaniates a new node gene exactly like this one
	clone() {
		let newNodeGene = new NodeGene(this);
		this.duplicate = newNodeGene;
		return newNodeGene;
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