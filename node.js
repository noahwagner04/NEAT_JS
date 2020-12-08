class Node {
	constructor(ntype, placement, id) {
		this.id = id;
		this.type = ntype;

		this.activationCount = 0;
		this.lastActivation = 0;
		this.lastActivation2 = 0;

		this.activesum = 0;
		this.activation = 0;
		this.activeFlag = false;
		this.activationFunc = NEAT.activationFunc;

		this.inConnections = [];
		this.outConnections = [];

		this.override = false;
		this.overrideValue = 0;
	}

	sensorLoad(value) {

	}

	addIncoming(node, weight, recur) {

	}

	flushBack() {

	}

	overrideOutput(value) {

	}

	activateOveride() {

	}

	feedForward(value) {

	}
}