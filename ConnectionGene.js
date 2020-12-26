// the gene representaion of a connection
class ConnectionGene {
	constructor(config) {
		this.createConnection(config);  // creates the connection
		this.enabled = config.enabled;
		this.innov = config.innov;		// the innovation num of this gene
	}

	/* 
	creats a connection obj on this gene
	*/
	createConnection(config) {
		let connectionConfig = {
			inNode: config.inNode,
			outNode: config.outNode,
			weight: config.weight,
			isRecur: config.isRecur
		};
		this.connection = new Connection(connectionConfig);
	}
}