// gene representation of a node
class NodeGene {
	constructor(id, ntype, placement) {
		this.netNode = undefined; 	   // a reference to the node this gene creates
		this.id = id;
		this.ntype = ntype; 		   // the type of this node, either NEURON or SENSOR
		this.placement = placement;    // the placement of this node, either BIAS, INPUT, HIDDEN, or OUTPUT
	}

	// creates a node with a given activation func
	createNetNode(func) {
		this.netNode = new Node(this.id, this.ntype, this.placement, func);
		return this;
	}
}