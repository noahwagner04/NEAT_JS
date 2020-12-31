/*
this class is the phenotype of an organism,
and gets constructed by the genome, its soul 
purpose is to compute an output
*/
class Network {
	constructor(inputs, outputs, all) {
		this.inputs = inputs;    // just input neurons
		this.outputs = outputs;  // just output neurons
		this.all = all;		     // all neurons, HIDDEN, OUTPUT, BIAS, and INPUT

		this.genotype = undefined;	    // used to match the genome to this network

		this.connectionNum = undefined; // number of all connections
		this.nodeNum = undefined; 		// number of all nodes

		this.depth = -1; 				// number of nodes inputs have to travel through to get to the output nodes

		this.initBias(); // initialize the bias
	}

	/*
	initializes the bias node to be activated,
	makes it so the user doesn't have to manualy
	activate it
	*/
	initBias() {
		this.inputs.forEach(node => {
			if(node.placement === nodePlaces.BIAS) {
				node.sensorLoad(1);
			}
		});
		return this;
	}

	/*
	this resets the network,
	uses recursive function that
	flushes backwards through the whole
	network starting at the output nodes
	*/
	flush() {
		this.outputs.forEach(node => node.flushBack());
		return this;
	}

	/*
	activates the network till
	all outputs are active, simulates
	one time step of activation, it uses
	recursive functions from the node class
	to go through the entire network cleanly
	*/
	activate() {
		this.inputs.forEach(node => node.feedForward());
		this.all.forEach(node => {
			if(node.type !== nodeTypes.SENSOR && node.activeFlag === true) {
				node.activate();
			}
			node.activesum = 0;
			node.activeFlag = false;
			node.visited = false;
		});
		return this;
	}

	/*
	adds input neuron to the input list,
	assuming the node is an input neuron
	*/
	addInput(node) {
		this.inputs.push(node);
		return this;
	}
	/*
	adds output neuron to the output list
	assuming the node is an input neuron
	*/
	addOutput(node) {
		this.outputs.push(node);
		return this;
	}

	/*
	loads an array of values to all
	the input nodes, each index of the 
	array goes to each input neuron, array
	has to be the same length as the input
	array
	*/
	loadSensors(inputArray) {
		if (inputArray.length !== this.inputs.length - 1) {
			console.log("netowrk receiving an invalid number inputs");
		} else {
			let index = 0;
			this.inputs.forEach(node => {
				if (node.placement === nodePlaces.BIAS) return;
				node.sensorLoad(inputArray[index]);
				index++;
			});
			return this;
		}
	}

	/*
	overrides the output neurons with given
	array of inputs values to be overriden with
	must be the same length as output array
	*/
	overrideOutputs(outputArray) {
		if (outputArray.length !== this.outputs.length) {
			console.log("netowrk receiving an invalid number override outputs");
		} else {
			for (let i = 0; i < this.outputs.length; i++) {
				this.outputs[i].overrideOutput(outputArray[i]);
			}
			return this;
		}
	}

	/*
	count the amount of nodes in this network
	then put the value to nodeNum
	*/
	countNodes() {

	}

	/*
	counts the amount of connections in this network
	then puts that value in to connectionNum
	*/
	countConnections() {

	}

	/*
	checks to see the maximum number of nodes
	a input has to go through to get to an output
	node, used for clasification problems
	*/
	calcMaxDepth() {
		let curDepth;
		this.outputs.forEach(node => {
			curDepth = Node.findDepth(node, 0);
			if(curDepth > this.depth) this.depth = curDepth;
		});
		return this;
	}

	/*
	recursivly checks if a potential connection is
	recurrent or not.
	*/
	static checkRecur(inNode, outNode, count, thresh) {
		count++;
		if (count >= thresh) {
			return false;
		}
		if (inNode === outNode) return true;
		for (let i = 0; i < inNode.inConnections.length; i++) {
			let connection = inNode.inConnections[i];
			if (connection.isRecur === false) {
				if (Network.checkRecur(connection.inNode, outNode, count, thresh)) return true;
			}
		}
		return false;
	}
}