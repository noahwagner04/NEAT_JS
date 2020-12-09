// a connection between two nodes in a network
class Connection {
	constructor(weight, inNode, outNode, isRecur) {
		// the weighted value of this connection
		this.weight = weight;
		// the node inputing to this connection
		this.inNode = inNode;
		// the node this connection is inputing to / 
		// connecting to 
		this.outNode = outNode;
		// whether or not this connection in recurrent
		this.isRecur = isRecur;
	}
}