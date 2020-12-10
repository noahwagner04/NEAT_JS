// a connection between two nodes in a network
class Connection {
	constructor(weight, inNode, outNode, isRecur) {
		this.weight = weight; 	// the weighted value of this connection
		this.inNode = inNode; 	// a ref to the node inputing to this connection
		this.outNode = outNode; // a ref to the node this connection is inputing to
		this.isRecur = isRecur; // whether or not this connection is recurrent
	}
}