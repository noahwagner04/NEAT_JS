/*
a combination of the phenotype and the genotype
with a fitness score
*/
class Organism {
	constructor(genome, fitness, gen) {
		this.genome = genome; // the genotype
		this.network = genome.constructNetwork().phenotype; // the phenotype

		this.adjustedFit = fitness; 	// the adjusted fitness of this organism
		this.fitness = fitness; 		// the original unadjusted fitness of this organism

		this.winner = false; 			// if this organism preforms best in the pop
		this.species = undefined; 		// the species this organism belongs to
		this.generation = gen; 			// the generation this organsim is apart of
		this.champion = false; 			// if this organism preforms best in its species
		this.fitnessCounter = 0;
	}
}