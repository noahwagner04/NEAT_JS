class Population {
	constructor(genome, size, NEAT) {
		this.organisms = [];
		this.first = genome;
		this.size = size;
		this.species = [];
		this.innovations = [];
		this.currInnov = 0;
		this.currNodeId = 0;
		this.champ = undefined;
		this.gen = 0;
		this.NEAT = NEAT;

		this.highestFit = 0;
		this.aveFit = 0;

		this.winner = undefined;
	}

	initPop() {

	}

	speciateOrg(organism) {

	}

	speciateAll() {

	}

	calcNextGen() {

	}

	rankSpeciesOrgs() {

	}

	getChamp() {

	}

	updateWinner(champ) {

	}
}