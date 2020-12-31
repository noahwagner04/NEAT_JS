// the gene representaion of a connection
class ConnectionGene {
	constructor(inNodeGene, outNodeGene, weight, isRecur, innov, enabled) {
		if(arguments.length === 1 && arguments[0] instanceof ConnectionGene) {
			let connectionGene = arguments[0];
			this.connection = undefined 		   // let clone func create this
			this.enabled = connectionGene.enabled; // get enabled bool
			this.innov = connectionGene.innov;	   // get innov num
		} else {
			this.connection = new Connection(inNodeGene, outNodeGene, weight, isRecur);
			this.enabled = enabled; // whether or not this gene is enabled, if disabled connection will be ignored durring activation
			this.innov = innov;		// the innovation num of this gene
		}
	}

	/*
	instantiates a new ConnectionGene
	exactly like this one
	*/
	clone() {
		let connectionGene = new ConnectionGene(this);
		connectionGene.connection = this.connection.clone();
		return connectionGene;
	}
}