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
		if (this.type === nodeTypes.SENSOR) {
			this.lastActivation2 = this.lastActivation;
			this.lastActivation = this.activation;

			this.activation = value;
			this.activeFlag = true;
		}
		return this;
	}

	addIncoming(node, weight, recur) {

	}

	flushBack() {

	}

	overrideOutput(value) {

	}

	activateOveride() {

	}
}