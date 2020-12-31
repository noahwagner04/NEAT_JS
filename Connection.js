/*
a connection between two nodes in a genome or network
inNode and outNode can either be refs to node genes,
in which case they are the connection within the connection 
gene class, which lives in the genome, or a they can be refs 
to network nodes,in which case they live in the nodes in or out 
connection arrays
*/
class Connection {
	constructor(inNode, outNode, weight, isRecur) {
		if(arguments.length === 1 && arguments[0] instanceof Connection) {
			let connection = arguments[0];
			this.weight = connection.weight;   // copy connection weight value
			this.inNode = undefined;   		   // let the clone func pick inNode
			this.outNode = undefined;  		   // let the clone func pick outNode
			this.isRecur = connection.isRecur; // copy connection isrecur property
		}
		else {
			this.weight = weight;	 // the weighted value of this connection
			this.inNode = inNode;	 // a ref to the node / node gene inputing to this connection
			this.outNode = outNode;  // a ref to the node / node gene this connection is inputing to
			this.isRecur = isRecur;  // whether or not this connection is recurrent
		}
	}

	/*
	creates a new connection exactly like
	this one, this is can only be used on 
	a connection within a connectionGene,
	with inNode and outNode being type of
	nodeGenes
	*/
	clone() {
		if(this.inNode instanceof NodeGene && this.outNode instanceof NodeGene) {
			let connection = new Connection(this);
			connection.inNode = this.inNode.duplicate;
			connection.outNode = this.outNode.duplicate;
			return connection;
		}
		console.log("cannot clone a network connection, can only clone a connection within a ConnectionGene");
	}
}