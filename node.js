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
		this.randomActivation = config.randomActivation;	// whether or not this node can choose its own activation function
		this.activationFunc = Activation.sigmoid(4.924273); // function activesum goes through to become activated

		this.inConnections = [];  	// array of all the ref incomming connections to the neuron
		this.outConnections = []; 	// array of all the ref outgoing connections to the neuron

		this.override = false;
		this.overrideValue = 0;
	}

	// loads a value to an input neuron
	sensorLoad(value) {
		if (this.type === nodeTypes.SENSOR) {
			this.lastActivation = this.activation;
			this.activation = value;
			this.activeFlag = true;
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

	}

	// overides this node with a desired value
	overrideOutput(value) {

	}

	// activates this neuron with the overridden value
	activateOveride() {

	}

	/*
	recursivly outputs values from this node 
	to the end of the network, supposed to be
	used on input neurons
	simulates one time step of activation,
	activating the neurons takes place in the 
	network, as this func only adds to the activesum
	*/
	feedForward(value) {

	}
}