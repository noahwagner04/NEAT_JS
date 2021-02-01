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
		this.reproductivePool.push(organism);
		return this;
	}

	/*
	adjusts all the organisms fitness
	to acount for the size of this species
	*/
	adjustFitness() {
		this.organisms.forEach(organism => {
			organism.adjustedFit = organism.fitness / this.organisms.length;
		});
		return this;
	}

	// calculates the average unadjusted fitness of all organisms
	calcAverageFit() {
		let result = 0;
		this.organisms.forEach(organism => {
			result += organism.fitness;
		});
		result /= this.organisms.length;
		this.aveFitness = result;
		return this;
	}

	// returns the largest fitness in this species
	getMaxFit() {
		this.organisms.forEach(organism => {
			if(organism.fitness > this.maxFitness) {
				this.maxFitness = organism.fitness;
				if(organism.fitness > this.maxFitnessEver) {
					this.maxFitnessEver = organism.fitness;
				}
			}
		});
		return this;
	}

	/*
	caclulates the number of babies this species will create for next gen (expectedOffspring),
	this number will most likely not be whole, population takes care of distributing the sum of all fractional 
	remainders species expectedOffprings to well performing species
	*/
	countOffspring() {
		let totalAvgFit = 0;
		let offspringNum = 0;

		for (var i = 0; i < this.population.species.length; i++) {
			let species = this.population.species[i];
			totalAvgFit += species.aveFitness;
		}

		offspringNum = this.aveFitness / totalAvgFit * this.population.size;
		this.expectedOffspring = offspringNum < 0 ? 0 : Math.trunc(offspringNum);
		return this;
	}

	// removes a specified organism from this species
	removeOrganism(organism) {
		for (let i = 0; i < this.organisms.length; i++) {
			if(organism === this.organisms[i]) {
				this.organisms.splice(i, 1);
			}
		}
		return this;
	}

	// returns the best preforming organism
	getChamp() {
		this.rank();
		return this.organisms[0];
	}

	// creates the next species gen
	reproduce(gen) {


		/*
		POPULATIONS JOB
		----------------
		population first takes care of the fractional parts of expectedOffspring and disributes it
		to well preforming species (just subtracts total pop size with the sum of all species expectedOffsprings (thats the remainder),
		if its > 0 that means we have to add (popsize - sumOfExpecedOffsprings) babies to well performing species,
		else if <= 0 then do nothing)

		if all population doesn't increase its maxFitness, only allow the top two species to breed and eliminate the rest
		*/

		/*
		THIS FUNCTIONS JOB (SPECIES JOB)
		---------------------------------
		first delete prooly preforming organisms (depends of survival threshhold) from this organisms array and main organism array

		loop for expectedOffspring amount of times

			then do superchamp checks and clone champ

			decide weather to only mutate, otherwise just mate then decide if to mutate

				if only mutate, mutate then be done

				if mate, pick each parent, biasing towards better preforming organisms

			then speciate the new baby (into reproductive pools)
		*/

		/*
		POPULATIONS JOB
		---------------
		population then takes care of making all species organisms array update to the next gen (by making it equal to their reproducive pools)
		then it also takes care of updating the main organism array by stringing the new species arrays together.

		population also takes care of poorly performing species (delets them if not improved over specified num of generations or if there pop is 0)
		*/
	}

	// sorts the organisms from greatest to least fit
	rank() {
		this.organisms.sort((a, b) => b.fitness - a.fitness);
		return this;
	}

	// checks if an organism can be added to this species
	// compares it with the first organism in the organisms array
	checkCompatibility(organism) {
		if(Genome.compatibility(organism.genome, this.organisms[0].genome, this.population) < this.population.NEAT.compatibilityThresh) {
			return true;
		}
		return false;
	}
}