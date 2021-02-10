/*
this class holds all the organisms in 
one place, user can choose to choose 
to interact with this class directly, 
or to use the NEAT class for more friendly
interface
*/
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

	// initializes the population from one genome, speciates them
	initPop() {

	}

	// speciates an organism to a species it matches with (dont this this will exist)
	speciateOrg(organism) {

	}

	// speciates all organisms into species (initializes species)
	speciateAll() {

	}

	// main reproduction loop, makes the next gen
	calcNextGen() {

	}

	// ranks all species organisms within their species
	rankSpeciesOrgs() {

	}

	// get the best preforming organism
	getChamp() {

	}

	// make winner be the best preforming org of all time
	updateWinner(champ) {

	}
}