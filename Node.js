/*
a node in a network, calculates summed 
inputs by incomming connections
and sends them out to other nodes with 
other connections
*/
class Node {
	constructor(id, type, placement, activation) {
		this.id = id;
		this.type = type;			 // type of this node, either NEURON of SENSOR
		this.placement = placement;  // placement of node, either BIAS, INPUT, HIDDEN, or OUPUT

		this.activationCount = 0;
		this.lastActivation = 0; 	// previous time steps activation for recurrency
		//this.lastActivation2 = 0; // two time steps ago activation for special recurrency cases

		this.activesum = 0;		 		  // the sum of all the incoming connections
		this.activation = 0;	 		  // activesum after its ran through the activationFunc
		this.activeFlag = false; 		  // whether or not this node is currently activated
		this.visited = false;			  // true when a node was fed forward durring activation
		this.activationFunc = activation; // whether or not this node can choose its own activation function

		this.inConnections = [];  	// array of all the ref incomming connections to the neuron
		this.outConnections = []; 	// array of all the ref outgoing connections to the neuron

		this.overridden = false;
		this.overrideValue = 0;
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
			let connection = new Connection(node, this, weight, recur);
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
		return this;
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
		return this;
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
	finds the depth of a node recursivly
	starting at a provided depth
	*/
	static findDepth(node, depth) {
		let curDepth;
		let max = depth;
		if (node.type === nodeTypes.SENSOR) return depth;
		node.inConnections.forEach(connection => {
			if (connection.isRecur === true) {
				console.log("depth cannot be calculated on network with loop");
				return;
			}
			curDepth = Node.findDepth(connection.inNode, depth + 1);
			if (curDepth > max) max = curDepth;
		});
		return max;
	}
}