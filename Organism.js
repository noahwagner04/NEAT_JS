// a combination of the phenotype and the genotype
// with a fitness score
class Organism {
	constructor(genome, gen, fitness) {
		// the genotype
		this.genome = genome;
		// the phenotype
		this.network = genome.constructNetwork;

		//the adjusted fitness of this organism
		this.fitness = fitness;
		// the original unadjusted fitness of this organism
		// (what the user of the lib puts in)
		this.originalFitness = fitness;
		// whether or not this organism is the 
		// winner of the population
		this.winner = false;
		// the species this organism belongs to
		this.species = undefined;
		// the generation this organsim is apart of
		this.generation = gen;
		// whether or not this organsim is the 
		// best of its species
		this.champion = false;
	}
}