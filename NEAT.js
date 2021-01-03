class NEAT {
	constructor(config) {
		this.disjointCoefficient = config.compatibility.DisjointCoefficient;
		this.excessCoefficient = config.compatibility.ExcessCoefficient;
		this.weightDifferenceCoefficient = config.compatibility.ExcessCoefficient;
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
		this.disableChance = config.mating.disableChance;
		this.mateOnlyProb = config.mating.mateOnlyProb;

		this.popSize = config.populationSize;

		this.net = config.network;
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