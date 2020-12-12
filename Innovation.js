/*
this is used for a global list of 
innovations, simply has an id and the
inovation num
*/
class Innovation {
	constructor(config) {
		this.inNodeId = config.inNodeId;
		this.outNodeId = config.outNodeId;

		this.innovation = config.innov1;   // the number assigned to this innov
		this.innovation2 = config.innov2;  // only used if this is a node mutation, both innovs act as innov nums for two new connections

		this.nodeId = config.newId;		   // new id of node, only used if this is a node mutation
		this.oldInnov = config.oldInnov;   // only used if node mutation, innov number of the connection this node is splitting

		this.newWeight = config.newWeight; // only used if this is a connection mutation, weight of the connection
		this.recur = config.recur;		   // recurrent flag of new connection, only used of this is a connection mutation

		this.chooseType(); 				   // chooses type
	}

	/*
	an innovation can be of two types,
	either a NEWNODE, or a NEW CONNECTION
	this function decides which type it is
	based off the config input
	*/
	chooseType() {
		if (this.innovation2 === undefined &&
			this.nodeId === undefined &&
			this.oldInnov === undefined) {
			this.type = innovTypes.NEWCONNECTION;
		} else {
			this.type = innovTypes.NEWNODE;
		}
	}
}