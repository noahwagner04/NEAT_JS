/*
a connection between two nodes in a network
inNode and outNode can either be refs to node genes,
in which case they are the connection within the connection 
gene class, or a they can be refs to network nodes,
in which case they live in the nodes in or out connection arrays
*/
class Connection {
	constructor(inNode, outNode, weight, isRecur) {
		this.weight = weight;	 // the weighted value of this connection
		this.inNode = inNode;	 // a ref to the node / node gene inputing to this connection
		this.outNode = outNode;  // a ref to the node / node gene this connection is inputing to
		this.isRecur = isRecur;  // whether or not this connection is recurrent
	}
}