// the gene representaion of a connection
class ConnectionGene {
	constructor(nodeId1, nodeId2, weight, enabled, innov) {
		this.nodeId1 = nodeId1; // id of node inputing to this gene
		this.nodeId2 = nodeId2; // id of node this gene is inputing to
		this.weight = weight;
		this.enabled = enabled;
		this.innov = innov; 	// the innovation num of this gene
	}
}