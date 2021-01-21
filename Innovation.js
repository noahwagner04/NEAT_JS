/*
this is used for a global list of 
innovations, simply has an id and the
inovation num
*/
class Innovation {
	constructor(inNodeId, outNodeId, innov1, ...args) {
		if (args.length === 4) { 		// run node constructor
			this.inNodeId = inNodeId;
			this.outNodeId = outNodeId;

			this.innovation = innov1;   // the innov number of the connection leading to this node
			this.innovation2 = args[0]; // the innov number of the connection leading out of this node

			this.nodeId = args[1];	    // new id of node, only used if this is a node mutation
			this.oldInnov = args[2];    // only used if node mutation, innov number of the connection this node is splitting

			this.activation = args[3];  // activation of the node, only necessary if node activation is randomized

			this.type = innovTypes.NEWNODE;

		} else if (args.length === 2) { // run connection constructor
			this.inNodeId = inNodeId;
			this.outNodeId = outNodeId;

			this.innovation = innov1; // innov of this new connection

			this.newWeight = args[0];  // only used if this is a connection mutation, weight of the connection
			this.recur = args[1]; 	   // recurrent flag of new connection, only used of this is a connection mutation

			this.type = innovTypes.NEWCONNECTION;
		}
	}
}