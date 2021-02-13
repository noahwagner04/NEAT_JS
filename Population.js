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
		this.currInnov = this.NEAT.inputs * this.NEAT.outputs; // the current innov num of the population
		this.currNodeId = 0; 		   // the current id to set every new unique node to
		this.champ = undefined; 	   // the best preforming organism within this generation
		this.gen = 1;

		this.highestFit = 0; 	 // the current highest fitness ever occured
		this.aveFit = 0; 		 // the current average fit 

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
					species.organisms.push(org);
					org.species = species;
					speciated = true;
				}
			}
			if(!speciated) {
				let newSpecies = new Species(this);
				this.species.push(newSpecies);
				newSpecies.organisms.push(org);
				org.species = newSpecies;
			}
		});
		return this;
	}

	// main reproduction loop, makes the next gen
	calcNextGen() {

	}

	// ranks all species organisms within their species
	rankSpeciesOrgs() {
		this.species.forEach(species => {
			species.rank();
		});
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
		if(this.winner) {
			this.winner = this.champ;
			return this;
		} else if(this.champ.fitness > this.winner.fitness) {
			this.winner = this.champ;
		}
		return this;
	}
}