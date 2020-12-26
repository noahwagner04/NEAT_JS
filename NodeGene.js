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
			this.id = id;
			this.ntype = ntype; 		   // the type of this node, either NEURON or SENSOR
			this.placement = placement;    // the placement of this node, either BIAS, INPUT, HIDDEN, or OUTPUT
		}
	}

	// creates a node with a given activation func
	createNetNode(func) {
		this.netNode = new Node(this.id, this.ntype, this.placement, func);
		return this;
	}


	// instaniates a new node gene exactly like this one
	clone() {
		return new NodeGene(this);
	}
}