// gene representation of a node
class NodeGene {
	constructor(ntype, placement, id) {
		this.id = id;
		this.ntype = ntype; 		// the type of this node, either NEURON or SENSOR
		this.placement = placement; // the placement of this node, either BIAS, INPUT, HIDDEN, or OUTPUT
	}
}