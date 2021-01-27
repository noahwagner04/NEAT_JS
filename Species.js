/*
this class holds similar oragnsims
together, each organism being below the 
compatibility threshole with one another. 
The class is resonsible for reproducing, fitness
sharing / evaluation, and overall creating a nich for organisms.
*/
class Species {
	constructor(population) {
		this.aveFitness = 0;
		this.maxFitness = 0;
		this.maxFitnessEver = 0;
		this.expectedOffspring = 0;
		this.organisms = [];
		this.lastImprovedAtAge = 0;

		this.population = population;
	}

	// adds an organism to this species
	addOrganism(organism) {

	}

	/*
	adjusts all the organisms fitness
	to acount for the size of this species
	*/
	adjustFitness() {

	}

	// calculates the average unadjusted fitness of all organisms
	calcAverageFit() {

	}

	// returns the largest fitness in this species
	getMaxFit() {

	}

	// returns the amount of offspring this species is allows to reproduce
	countOffspring() {

	}

	// removes a specified organism from this species
	removeOrganism(organism) {

	}

	// returns the best preforming organism
	getChamp() {

	}

	// creates the next species gen
	reproduce(gen, sortedSpecies) {

	}

	// sorts the organisms from greatest to least fit
	rank() {

	}

	// checks if an organism can be added to this species
	checkCompatibility(organism) {
		
	}
}