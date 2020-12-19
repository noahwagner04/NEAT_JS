/*
a node in a network, calculates summed 
inputs by incomming connections
and sends them out to other nodes with 
other connections
*/
class Node {
	constructor(config) {
		this.id = config.id;
		this.type = config.type;			// type of this node, either NEURON of SENSOR
		this.placement = config.placement;  // placement of node, either BIAS, INPUT, HIDDEN, or OUPUT

		this.activationCount = 0;
		this.lastActivation = 0; 	// previous time steps activation for recurrency
		//this.lastActivation2 = 0; // two time steps ago activation for special recurrency cases

		this.activesum = 0;		 	// the sum of all the incoming connections
		this.activation = 0;	 	// activesum after its ran through the activationFunc
		this.activeFlag = false; 	// whether or not this node is currently activated
		this.visited = false;		// true when a node was fed forward durring activation
		this.randomActivation = config.randomActivation; // whether or not this node can choose its own activation function
		this.initActivation(config.activation) 			 // chooses the activation function of the node

		this.inConnections = [];  	// array of all the ref incomming connections to the neuron
		this.outConnections = []; 	// array of all the ref outgoing connections to the neuron

		this.overridden = false;
		this.overrideValue = 0;
	}

	//chooses activation function based off config obj
	initActivation(func) {
		if(this.randomActivation) {
			this.chooseActivationFunc();
		} else {
			this.activationFunc = func;
			return this;
		}
	}
	/*
	chooses from the activationTypes array,
	which has the six default activation functions
	in it, the user can add their own functions to the
	object and this function will have no problem with 
	ranomly picking it
	*/
	chooseActivationFunc() {
		if (this.randomActivation === true) {
			let rdmIndex = Math.floor(Math.random() * activationTypes.length);
			this.activationFunc = activationTypes[rdmIndex];
			return this;
		}
		console.log("cannot randomize activation on this node, try setting randomActivation = true");
	}

	/*
	sets all activation related attributes to
	indicate that this node has been activated
	*/
	activate() {
		if (this.overridden) {
			this.activateOverride();
		} else {
			this.lastActivation = this.activation;
			this.activation = this.activationFunc(this.activesum);
			this.activationCount++;
			return this;
		}
	}

	/*
	resets all node values that have to do with
	activation
	*/
	reset() {
		this.activationCount = 0;
		this.lastActivation = 0;
		this.activation = 0;
		this.activesum = 0;
		this.activeFlag = false;
		this.overridden = false;
		this.overrideValue = 0;
		return this;
	}

	// loads a value to an input neuron
	sensorLoad(value) {
		if (this.type === nodeTypes.SENSOR) {
			this.lastActivation = this.activation;
			this.activation = value;
			this.activationCount++;
			return this;
		}
		console.log("cannot load value into node of type: NEURON");
	}

	/*
	adds an incoming connection to this node, 
	adds an outgoing connection to the node its coming from
	*/
	addIncoming(node, weight, recur) {
		if (this.type !== nodeTypes.SENSOR) {
			let config = {
				inNode: node,
				outNode: this,
				weight: weight,
				isRecur: recur
			};
			let connection = new Connection(config);
			this.inConnections.push(connection);
			node.outConnections.push(connection);
			return this;
		}
		console.log("cannot add incoming into node of type: SENSOR");
	}

	/*
	recursivly resets the value of this node,
	and any node that connects with this node,
	supposed to be used on output neurons so
	it can go through the entire network
	*/
	flushBack() {
		if (this.type === nodeTypes.SENSOR) {
			if (this.activationCount > 0) this.reset();
			return;
		} else if (this.activationCount > 0) {
			this.reset();
			this.inConnections.forEach(connection => connection.inNode.flushBack());
		}
	}

	// overides this node with a desired value
	overrideOutput(value) {
		this.overrideValue = value;
		this.overridden = true;
		return this;
	}

	// activates this neuron with the overridden value
	activateOverride() {
		this.lastActivation = this.activation;
		this.activation = this.overrideValue;
		this.activationCount++;
		return this;
	}

	/*
	recursivly outputs values from this node 
	to the end of the network, supposed to be
	used on input neurons
	simulates one time step of activation,
	activating the neurons takes place in the 
	network, as this func only adds to the activesum
	*/
	feedForward() {
		this.outConnections.forEach(connection => {
			let node = connection.outNode;
			let addAmount = 0;
			if (connection.isRecur === false) {
				addAmount = this.activation * connection.weight;
			} else {
				addAmount = this.lastActivation * connection.weight;
			}
			node.addActiveSum(addAmount);
			if (node.visited === false) {
				node.visited = true;
				node.feedForward();
			}
		});
	}

	/*
	adds to the activesum of a node,
	also sets activeFlag to true, makes
	feedforward look cleaner
	*/
	addActiveSum(amount) {
		this.activesum += amount;
		this.activeFlag = true;
		return this;
	}

	/*
	finds the depth of this node recursivly
	starting at a provided depth
	*/
	findDepth(depth) {
		let curDepth;
		let max = depth;
		if (this.type === nodeTypes.SENSOR) return depth;
		this.inConnections.forEach(connection => {
			if (connection.isRecur === true) {
				console.log("depth cannot be calculated on network with loop");
				return;
			}
			curDepth = connection.inNode.findDepth(depth + 1);
			if (curDepth > max) max = curDepth;
		});
		return max;
	}
}