/*
this is used for a global list of 
innovations, simply has an id and the
inovation num
*/
class Innovation {
	constructor(config) {
		this.inNode = config.inNode;
		this.outNode = config.outNode;

		this.innovation = config.innov1;
		this.innovation2 = config.innov2;

		this.nodeId = config.newId;
		this.oldInnov = config.oldInnov;

		this.newWeight = config.newWeight;
		this.recur = config.recur;

		if (this.innovation2 === undefined &&
			this.nodeId === undefined &&
			this.oldInnov === undefined) {
			this.type = innovTypes.NEWCONNECTION;
		} else {
			this.type = innovTypes.NEWNODE;
		}
	}
}