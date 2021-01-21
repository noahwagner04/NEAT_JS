// gene representation of a node
class NodeGene {
	constructor(id, ntype, placement, netNodeActivation) {
		if(arguments.length === 1 && arguments[0] instanceof NodeGene) { // check to see of recieved nodeGene, if so, exicute copy constructor
			let nodeGene = arguments[0];
			this.netNode = undefined; // a reference to the node this gene creates
			this.id = nodeGene.id;
			this.ntype = nodeGene.ntype; 		     // the type of this node, either NEURON or SENSOR
			this.placement = nodeGene.placement;     // the placement of this node, either BIAS, INPUT, HIDDEN, or OUTPUT
			this.netNodeActivation = nodeGene.netNodeActivation;
		} else {
			this.netNode = undefined; 	   // a reference to the node this gene creates
			this.duplicate = undefined;		   // used for genome duplication
			this.id = id;
			this.ntype = ntype; 		   // the type of this node, either NEURON or SENSOR
			this.placement = placement;    // the placement of this node, either BIAS, INPUT, HIDDEN, or OUTPUT
			this.netNodeActivation = netNodeActivation;	// used to keep track of node activation when choosing randomly
		}
	}

	/*
	creates a node with a given activation func,
	takes population obj to get activation func
	*/
	createNetNode() {
		this.netNode = new Node(this.id, this.ntype, this.placement, this.netNodeActivation);
		return this;
	}


	// instaniates a new node gene exactly like this one
	clone() {
		let newNodeGene = new NodeGene(this);
		this.duplicate = newNodeGene;
		return newNodeGene;
	}
}