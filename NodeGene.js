// gene representation of a node
class NodeGene {
	constructor(config) {
		this.netNode = undefined; 		   // a reference to the node this gene creates
		this.id = config.id;
		this.ntype = config.ntype; 		   // the type of this node, either NEURON or SENSOR
		this.placement = config.placement; // the placement of this node, either BIAS, INPUT, HIDDEN, or OUTPUT
	}

	// creates a node with a given activation func
	createNetNode(func) {
		let node = new Node({
			id: this.id,
			type: this.ntype,
			placement: this.placement,
			activation: func
		});
		this.netNode = node;
		return this;
	}
}