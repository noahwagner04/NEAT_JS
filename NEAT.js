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
		this.recurProb = config.mating.recurProb;
		this.mutateWeightsProb = config.mating.mutateWeightsProb;
		this.mutateNodeProb = config.mating.addNodeProb;
		this.mutateConnectionProb = config.mating.addConnectionProb;
		this.renableProb = config.mating.renableProb;
		this.toggleEnableProb = config.mating.toggleEnableProb;
		this.mateOnlyProb = config.mating.mateOnlyProb;

		this.popSize = config.populationSize;

		this.inputs = config.network.inputs;
		this.outputs = config.network.outputs;
		this.activationFunction = config.network.activationFunction;
		this.randomActivation = config.network.randomActivation;
	}

	nextGen() {

	}

	setFit(fitness, index) {

	}

	getWinner() {

	}

	setInputs(inputArray, index) {

	}

	getOutputs(index) {

	}

	getAllOutputes() {

	}

	feedForward() {

	}
}