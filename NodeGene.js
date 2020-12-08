// gene representation of a node
class NodeGene {
	constructor(ntype, placement, id) {
		// the id of this node gene, 
		// helps with genetic encoding/mutation
		this.id = id;
		// the type of this node, either NEURON or SENSOR
		this.ntype = ntype;
		// the placement of this node, either
		// BIAS, INPUT, HIDDEN, or OUTPUT
		this.placement = placement;
	}
}