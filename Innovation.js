/*
this is used for a global list of 
innovations, simply has an id and the
inovation num
*/
class Innovation {
	constructor(connectionGene, innov) {
		this.mutation = `${connectionGene.node1}-${connectionGene.node2}`
		this.innovation = innov;
	}
}