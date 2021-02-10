/*
this is the main class the user
will be interacting with (or population if preferred)
it holds all the main parameters for the algorithm
you can instantiate multiple neat instances or multiple
population instances that share the same NEAT config if desired
*/
class NEAT {
	constructor(config) {
		this.disjointCoefficient = config.compatibility.disjointCoefficient;
		this.excessCoefficient = config.compatibility.excessCoefficient;
		this.weightDiffCoefficient = config.compatibility.weightDiffCoefficient;
		this.compatibilityThresh = config.compatibility.threshold;
		this.compatibilityModifier = config.compatibility.modifier;

		this.dropOffAge = config.species.dropOffAge;
		this.survivalThreshold = config.species.survivalThreshold;
		this.interspeciesMatingRate = config.species.interspeciesMatingRate;

		this.mutationPower = config.mating.mutationPower;
		this.mutateOnlyProb = config.mating.mutateOnlyProb;
		this.mateOnlyProb = config.mating.mutateOnlyProb;
		this.recurProb = config.mating.recurProb;
		this.mutateWeightsProb = config.mating.mutateWeightsProb;
		this.mutateNodeProb = config.mating.addNodeProb;
		this.mutateConnectionProb = config.mating.addConnectionProb;
		this.renableProb = config.mating.renableProb;
		this.toggleEnableProb = config.mating.toggleEnableProb;
		this.mateAvgProb = config.mating.mateAvgProb;


		this.popSize = config.populationSize;
		this.forgetInnovs = config.forgetInnovs;

		this.inputs = config.network.inputs;
		this.outputs = config.network.outputs;
		this.singleTimeStepActivation = config.network.singleTimeStepActivation;
		this.activationFunction = config.network.activationFunction;
		this.randomActivation = config.network.randomActivation;
	}

	// calculate the next generation
	nextGen() {

	}

	// sets the fitness of a specified organism at a given index
	setFit(fitness, index) {

	}

	// gets the best preforming organism
	getWinner() {

	}

	// sets the inputs to an organisms brain with a given index and a input array
	setInputs(inputArray, index) {

	}

	// gets the output of an organism at a given index
	getOutputs(index) {

	}

	// returns all the organisms outputs in a 2d array
	getAllOutputs() {

	}

	// activates all organisms networks
	feedForward() {

	}

	// activates one organisms network
	feedForwardOrg(index) {

	}
}