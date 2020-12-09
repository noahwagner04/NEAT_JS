// the gene representaion of a connection
class ConnectionGene {
	constructor(nodeId1, nodeId2, weight, enabled, innov) {
		// id of node inputing to this gene
		this.nodeId1 = nodeId1;
		// id of node this gene is inputing to
		this.nodeId2 = nodeId2;
		// weight of this gene
		this.weight = weight;
		// whether or not this gene is enabled
		this.enabled = enabled;
		// the innovation num of this gene
		this.innov = innov;
	}
}