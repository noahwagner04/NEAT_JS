// a node in a network, calculates summed 
// inputs by incomming connections
// and sends them out to other nodes with 
// other connections
class Node {
	constructor(ntype, placement, id) {
		// this nodes id, helps with genetic encoding
		this.id = id;
		// type of this node, either NEURON of SENSOR
		this.type = ntype;
		// placement of node, either BIAS, INPUT, HIDDEN, or OUPUT
		this.placement = placement;

		// the amount of times this node has been activated
		//this.activationCount = 0;
		// previous time steps activation for recurrency
		this.lastActivation = 0; 
		// two time steps ago activation for special recurrency cases
		//this.lastActivation2 = 0;

		// the sum of all the incoming connections
		// this is the value that gets ran through
		// the activation func
		this.activesum = 0;
		// activesum after its ran through the activation
		// function(the output)
		this.activation = 0;
		// whether or not this node is currently activated
		this.activeFlag = false;
		// the function active sum goes through to become
		// the output of the neuron
		this.activationFunc = NEAT.activationFunc;

		// array of all the incomming connections to the neuron
		this.inConnections = [];
		// array of all the outgoing connections to the neuron
		this.outConnections = [];

		// if this neuron is going to be overridden
		this.override = false;
		// the overriden value
		this.overrideValue = 0;
	}

	// loads a value to an input neuron
	sensorLoad(value) {

	}

	// adds an incoming connection to this node, 
	// adds an outgoing connection to the node its coming from
	addIncoming(node, weight, recur) {

	}

	// recursivly resets the value of this node,
	// and any node that connects with this node,
	// supposed to be used on output neurons so
	// it can go through the entire network
	flushBack() {

	}

	// overides this node with a desired value
	overrideOutput(value) {

	}

	// activates this neuron with the overridden value
	activateOveride() {

	}

	// recursivly outputs values from this node 
	// to the end of the network, supposed to be
	// used on input neurons
	// simulates one time step of activation,
	// activating the neurons takes place in the 
	// network, as this func only adds to the active sum
	feedForward(value) {

	}
}