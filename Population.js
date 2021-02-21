/*
this class holds all the organisms in 
one place, user can choose to choose 
to interact with this class directly, 
or to use the NEAT class for more friendly
interface
*/
class Population {
	constructor(NEAT) {
		this.NEAT = NEAT; 			   // holds all configuration settings specified by user
		this.organisms = []; 		   // a list of all the current genomes
		this.size = this.NEAT.popSize; // the size of the population
		this.species = []; 			   // current species of the population
		this.innovations = []; 		   // a list of all the innovations that took place this gen, or ever
		this.currInnov = this.NEAT.inputs * this.NEAT.outputs;  // the current innov num of the population
		this.currNodeId = this.NEAT.inputs + this.NEAT.outputs; // the current id to set every new unique node to
		this.champ = undefined; 	   // the best preforming organism within this generation
		this.gen = 1;

		this.highestFit = 0; 	 	// the current highest fitness currently
		this.highestFitEver = 0;	// the highest fit ever occured
		this.highestFitCounter = 0; // counts to check if the population hasn't increased its highest fit within 20 gens
		this.aveFit = 0; 		 	// the current gens average fit 

		this.winner = undefined; // the best preforming organism throughout time
	}

	// initializes the population from one genome, speciates them
	initPop() {
		for (let i = 0; i < this.size; i++) {
			let newGenome = new Genome(this.NEAT.inputs, this.NEAT.outputs, this);
			let newOrganism = new Organism(newGenome, 0, 1);
			this.organisms.push(newOrganism);
		}
		this.speciateAll();
		return this;
	}

	// speciates all organisms into species (initializes species)
	speciateAll() {
		this.organisms.forEach(org => {
			let speciated = false;
			for (let i = 0; i < this.species.length; i++) {
				let species = this.species[i];
				if(species.checkCompatibility(org)) {
					species.addOrganism(org);
					org.species = species;
					speciated = true;
					break;
				}
			}
			if(!speciated) {
				let newSpecies = new Species(this);
				this.species.push(newSpecies);
				newSpecies.addOrganism(org);
				org.species = newSpecies;
			}
		});
		return this;
	}

	// main reproduction loop, makes the next gen
	calcNextGen() {
		this.getChamp();
		this.calcAveFit();
		this.updateWinner();
		this.getHighestFit();

		// check if population hasn't increased it max fit within 20 gens, if not, only make top two species survive
		if(this.highestFitCounter > 20 && this.species.length >= 2) {
			this.species.splice(2, this.species.length - 2);
			this.highestFitCounter = 0;
		}
		// update highest fit for check above
		if(this.highestFitEver >= this.highestFit) {
			this.highestFitCounter++;
		} else {
			this.highestFitEver = this.highestFit;
			this.highestFitCounter = 0;
		}
		// update fitness related variables in each species and increase the age
		this.species.forEach(species => species.calcAverageFit().checkHighFit().age += 1);
		this.rankSpecies().rankSpeciesOrgs();
		// count the offspring of each species, add total to sum
		this.species.forEach(species => {
			species.getChamp().countOffspring();
		});

		// eliminate low preforming organisms so they can't reproduce
		this.species.forEach(species => species.eliminateLowFitOrgs());
		if (this.species.length !== 1) {
			// eliminate low preforming species
			for (let i = this.species.length - 1; i >= 0; i--) {
				let species = this.species[i];
				if (species.lastImprovedAtAge > this.NEAT.dropOffAge || species.organisms.length === 0) {
					this.species.splice(i, 1);
				}
			}
		}

		// make up for lost precision while calculating expectedOffspring
		let sum = 0;
		this.species.forEach(species => sum += species.expectedOffspring);
		for (let i = 0; i < this.size - sum; i++) {
			let species = undefined;
			for (let j = 0; j < this.species.length; j++) {
				species = this.species[j];
				if(Math.random() > 0.3) {
					break;
				}
			}
			species.expectedOffspring += 1;
		}

		this.species.forEach(species => species.reproduce());


		let newOrganisms = [];
		for (let i = 0; i < this.species.length; i++) {
			let species = this.species[i];
			for (let j = 0; j < species.organisms.length; j++) {
				let organism = species.organisms[j];
				newOrganisms.push(organism);
			}
		}

		// NOTE: this could be the cause of like all the bugs
		for (let i = this.organisms.length - 1; i >= 0; i--) {
			let organism = this.organisms[i];
			for (let j = newOrganisms.length - 1; j >= 0; j--) {
				if(organism === newOrganisms[j]) {
					this.organisms.splice(i, 1);
					let species = newOrganisms[j].species;
					let removeIndex = species.organisms.indexOf(newOrganisms[j]);
					species.organisms.splice(removeIndex, 1);
					newOrganisms.splice(j, 1);
					break;
				}
			}
		}

		for (let i = this.species.length - 1; i >= 0; i--) {
			let species = this.species[i];
			if(species.organisms.length === 0) {
				this.species.splice(i, 1);
			}
		}

		this.organisms = newOrganisms;

		if(this.NEAT.forgetInnovs) {
			this.innovations = [];
		}

		if(this.species.length > 4) {
			this.NEAT.compatibilityThresh += this.NEAT.compatibilityModifier;
		} else if(this.species.length === 1) {
			this.NEAT.compatibilityThresh -= this.NEAT.compatibilityModifier;
		}

		this.gen++;

		return this;
	}

	// ranks all species organisms within their species
	rankSpeciesOrgs() {
		this.species.forEach(species => {
			species.rank();
		});
		return this;
	}

	// orders species array from best preforming to least preforming
	rankSpecies() {
		this.species.sort((a, b) => b.maxFitness - a.maxFitness);
		return this;
	}

	// get the best preforming organism
	getChamp() {
		let bestFit = 0;
		for (let i = 0; i < this.organisms.length; i++) {
			let organism = this.organisms[i];
			if(organism.fitness > bestFit) {
				this.champ = organism;
				bestFit = this.champ.fitness;
			}
		}
		return this;
	}

	// make winner be the best preforming org of all time
	updateWinner() {
		if(!this.winner) {
			this.winner = this.champ;
			return this;
		} else if(this.champ.fitness > this.winner.fitness) {
			this.winner = this.champ;
			this.winner.winner = true;
		}
		return this;
	}

	getHighestFit() {
		let max = 0;
		for (let i = 0; i < this.organisms.length; i++) {
			let organism = this.organisms[i];
			if(organism.fitness > max) {
				max = organism.fitness;
			}
		}
		this.highestFit = max;
		return this;
	}

	calcAveFit() {
		let sum = 0;
		for (let i = 0; i < this.organisms.length; i++) {
			sum += this.organisms[i].fitness;
		}
		this.aveFit = sum / this.organisms.length;
		return this;
	}
}