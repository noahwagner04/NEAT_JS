class Population {
	constructor(genome, size) {
		this.genomes = [];
		this.first = genome;
		this.size = size;
		this.species = [];
		this.innovations = [];
		this.currInnov = 0;
		this.currNodeId = 0;
		this.champ = undefined;
		this.gen = 0;

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