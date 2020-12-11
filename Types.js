/*
a node can be either a NEURON or a SENSOR
a NEURON is a node with incomming connections
for activation
a SENSOR is a node that is given a value to output,
(an input neuron)
*/
let nodeTypes = {
	NEURON: 0,
	SENSOR: 1
};

/*
different types of places a node can be in
in a network. Bias is used as a seprate input 
node. Its input value will always be the same, 1.
The computation is the same, but this method allows for
evolution to take care of either or not to add bias to a 
node, as it may not be necessary. It allows for a minimal
search space
*/
let nodePlaces =  {
	INPUT: 0,
	BIAS: 1,
	HIDDEN: 2,
	OUTPUT: 3
};

/*
these are the config types for any object in the lib.
every object will take a config object in its constructor
with a type attribute, it will make it easier for different 
constructor types for objects
*/
let configTypes = {
	CONFIG_ONE: 0,
	CONFIG_TWO: 1,
	COPY:2
};

/*
possible innovation types in a genome,
this helps with checking if a mutation
already has occurred in the population
*/
let innovTypes = {
	NEWCONNECTION: 0,
	NEWNODE: 1
};