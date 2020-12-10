/*
a combination of the phenotype and the genotype
with a fitness score
*/
class Organism {
	constructor(genome, gen, fitness) {
		this.genome = genome; 			// the genotype
		this.network = genome.constructNetwork(); // the phenotype

		this.fitness = fitness; 		//the adjusted fitness of this organism
		this.originalFitness = fitness; // the original unadjusted fitness of this organism

		this.winner = false; 			// if this organism preforms best in the pop
		this.species = undefined; 		// the species this organism belongs to
		this.generation = gen; 			// the generation this organsim is apart of
		this.champion = false; 			// if this organism preforms best in its species
	}
}