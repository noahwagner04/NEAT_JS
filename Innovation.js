/*
this is used for a global list of 
innovations, simply has an id and the
inovation num
*/
class Innovation {
	constructor(inNodeId, outNodeId, innov1, ...args) {
		if (args.length === 3) { 		// run node constructor
			this.inNodeId = inNodeId;
			this.outNodeId = outNodeId;

			this.innovation = innov1;   // the number assigned to this innov
			this.innovation2 = args[0]; // only used if this is a node mutation, both innovs act as innov nums for two new connections

			this.nodeId = args[1];	    // new id of node, only used if this is a node mutation
			this.oldInnov = args[2];    // only used if node mutation, innov number of the connection this node is splitting

			this.type = innovTypes.NEWNODE;

		} else if (args.length === 2) { // run connection constructor
			this.inNodeId = inNodeId;
			this.outNodeId = outNodeId;

			this.innovation = innov1;

			this.newWeight = args[0];  // only used if this is a connection mutation, weight of the connection
			this.recur = args[1]; 	   // recurrent flag of new connection, only used of this is a connection mutation

			this.type = innovTypes.NEWCONNECTION;
		}
	}
}