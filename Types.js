// a node can be either a NEURON or a SENSOR
// a NEURON is a node with incomming connections
// for activation
// a SENSOR is a node that is given a value to output,
// (an input neuron)
let nodeTypes = {
	NEURON: 0,
	SENSOR: 1
};

// different types of places a node can be in
// in a network. Bias is used as a seprate input 
// node. Its input value will always be the same, 1.
// The computation is the same, but this method allows for
// evolution to take care of either or not to add bias to a 
// node, as it may not be necessary. It allows for a minimal
// search space
let nodePlaces =  {
	INPUT: 0,
	BIAS: 1,
	HIDDEN: 2,
	OUTPUT: 3
};