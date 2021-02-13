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
		this.champ = undefined;

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

		for (let i = 0; i < this.population.species.length; i++) {
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

	// returns the best preforming organism (assumes species has been ranked)
	getChamp() {
		this.champ = this.organisms[0];
		return this;
	}

	// creates the next species gen
	reproduce(gen) {
		let champDone = false;
		let mom = undefined;
		let dad = undefined;
		let baby = undefined;
		let newGenome = undefined;
		let interspeciesFlag = undefined;

		/*
		POPULATIONS JOB
		----------------

		organizes species array from best preforming to worst

		counts offspring for all species, calculates maxFit, averageFit, also takes care of ranking / setting champ of each species
		
		adds one the the age of every species 

		population first takes care of the fractional parts of expectedOffspring and disributes it
		to well preforming species (just subtracts total pop size with the sum of all species expectedOffsprings (thats the remainder),
		if its > 0 that means we have to add (popsize - sumOfExpecedOffsprings) babies to well performing species,
		else if <= 0 then do nothing)

		takes care of removing poorly preforming organisms in each species

		if all population doesn't increase its maxFitness in 20 gens, only allow the top two species to breed and eliminate the rest
		*/

		// loop for expectedOffspring amount of times
		for (let i = 0; i < this.expectedOffspring; i++) {
			// pick mom and dad here, make sure to not pick mom twice
			mom = this.chooseParent();
			// chooses whether to pick dad from other species
			if(Math.random() < this.population.NEAT.interspeciesMatingRate) {
				interspeciesFlag = true;
				let species = undefined;
				// pick biasely towards better behaving species, then choose parent from picked species
				for (let i = 0; i < this.population.species.length; i++) {
					species = this.population.species[i];
					if(species === this) continue;
					else if(Math.random() < 0.3) {
						continue;
					} else {
						break;
					}
				}
				dad = species.chooseParent();
			} else {
				dad = this.chooseParent(mom);
			}

			//clone champ then be done
			if (!champDone) {
				newGenome = this.champ.genome.clone();
				baby = new Organism(newGenome, 0, this.age);
				baby.champion = true;
				champDone = true;

			} else if (Math.random() < this.population.NEAT.mutateOnlyProb) {
				newGenome = mom.genome.clone().mutate();
				baby = new Organism(newGenome, 0, this.age);

			} else if(Math.random() < this.population.NEAT.mateOnlyProb) {
				newGenome = Genome.crossover(mom.genome, dad.genome, mom.fitness, dad.fitness, interspeciesFlag, this.population);
				baby = new Organism(newGenome, 0, this.age);

			} else {
				newGenome = Genome.crossover(mom.genome, dad.genome, mom.fitness, dad.fitness, interspeciesFlag, this.population).mutate();
				baby = new Organism(newGenome, 0, this.age);
			}
			// then speciate the new baby (into reproductive pools)
			let found = false;
			for (let i = 0; i < this.population.species.length; i++) {
				let species = this.population.species[i];
				if (species.checkCompatibility(baby)) {
					found = true;
					species.addOrganism(baby);
					baby.species = species;
					break;
				}
			}

			if (!found) {
				let newSpecies = new Species(this.population);
				newSpecies.addOrganism(baby);
				baby.species = newSpecies;
				this.population.species.push(newSpecies);
			}
		}

		/*
		POPULATIONS JOB
		---------------
		population then takes care of making all species organisms array update to the next gen (by making it equal to their reproducive pools)
		then it also takes care of updating the main organism array by stringing the new species arrays together.

		population also takes care of poorly performing species (delets them if not improved over specified num of generations or if there pop is 0)

		pop then forgets all innovs if specified by NEAT setting
		*/
	}

	// removes all the poorly preforming organisms from this species and the main population array 
	eliminateLowFitOrgs() {
		let cutOff = Math.round(this.population.NEAT.survivalThreshold * this.organisms.length);
		let done = false;
		while (!done) {
			let organism = this.organisms[cutOff];
			// make sure at least one organism survives
			if (organism === undefined || this.organisms.length === 1) {
				done = true;
				continue;
			}
			this.organisms.splice(cutOff, 1);
			let removeIndex = this.population.organisms.indexOf(organism);
			this.population.organisms.splice(removeIndex, 1);
		}
	}

	// chooses a parent, biasing better preforming organisms, ignores a provided organism
	chooseParent(organism) {
		let sum = 0;
		let index = 0;
		let removedOrg = organism;
		let removedIndex = undefined;
		let parent = undefined;

		if(removedOrg) {
			removedIndex = this.organisms.indexOf(removedOrg);
			this.organisms.splice(removedIndex, 1);
		}

		for (let i = 0; i < this.organisms.length; i++) {
			sum += this.organisms[i].fitness;
		}
		let rdmChoice = Math.random() * sum;

		while (rdmChoice > 0) {
			rdmChoice -= this.organisms[index].fitness;
			index++;
		}
		index--;
		parent = this.organisms[index];
		if(removedOrg) {
			this.organisms.splice(removedIndex, 0, removedOrg);
		}
		return parent;
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