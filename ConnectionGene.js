// the gene representaion of a connection
class ConnectionGene {
	constructor(config) {
		this.createConnection(config);  // creates the connection
		this.enabled = config.enabled;
		this.innov = config.innov;		// the innovation num of this gene
	}

	/* 
	creates a connection, it is
	helpful to have a reference to the 
	connection of this gene for mutation
	and genetic encoding purposes
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