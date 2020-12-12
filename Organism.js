/*
a combination of the phenotype and the genotype
with a fitness score
*/
class Organism {
	constructor(config) {
		this.genome = config.genome; 		   // the genotype
		this.network = config.genome.constructNetwork(); // the phenotype

		this.fitness = config.fitness; 		   // the adjusted fitness of this organism
		this.originalFitness = config.fitness; // the original unadjusted fitness of this organism

		this.winner = false; 			// if this organism preforms best in the pop
		this.species = undefined; 		// the species this organism belongs to
		this.generation = config.gen; 	// the generation this organsim is apart of
		this.champion = false; 			// if this organism preforms best in its species
	}
}