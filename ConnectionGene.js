// the gene representaion of a connection
class ConnectionGene {
	constructor(inNodeGene, outNodeGene, weight, isRecur, innov, enabled) {
		this.connection = new Connection(inNodeGene, outNodeGene, weight, isRecur);
		this.enabled = enabled; // whether or not this gene is enabled, if disabled connection will be ignored durring activation
		this.innov = innov;		// the innovation num of this gene
	}
}