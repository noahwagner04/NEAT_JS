/*
this class holds similar oragnsims
together, each organism being below the 
compatibility threshole with one another. 
The class is resonsible for reproducing, fitness
sharing / evaluation, and overall creating a nich for organisms.
*/
class Species {
	constructor(population) {
		this.age = 1;
		this.aveFitness = 0;
		this.maxFitness = 0;
		this.maxFitnessEver = 0;
		this.expectedOffspring = 0;
		this.organisms = [];
		this.reproductivePool = [];
		this.lastImprovedAtAge = 0;

		this.population = population;
	}

	// adds an organism to this species (probably adds to the reproductivePool idk yet)
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

		// loop for expectedOffspring amount of times

			// then do superchamp checks and clone champ

			// decide weather to only mutate, otherwise just mate then decide if to mutate

				// if only mutate, mutate then be done

				// if mate, pick each parent, biasing towards better preforming organisms

			// then speciate the new baby (into reproductive pools)

		/*
		population takes care of deleting poorly preforming organisms

		population then takes care of making all species organisms array update to the next gen (by making it equal to their reproducive pools)
		then it also takes care of updating the main organism array by stringing the new species arrays together.
		*/

	}

	// sorts the organisms from greatest to least fit
	rank() {

	}

	// checks if an organism can be added to this species
	// compares it with the first organism in the organisms array
	checkCompatibility(organism) {

	}
}