// a connection between two nodes in a network
class Connection {
	constructor(config) {
		this.weight = config.weight;	// the weighted value of this connection
		this.inNode = config.inNode;	// a ref to the node inputing to this connection
		this.outNode = config.outNode;  // a ref to the node this connection is inputing to
		this.isRecur = config.isRecur;  // whether or not this connection is recurrent
	}
}