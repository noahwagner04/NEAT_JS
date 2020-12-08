class Organism {
	constructor(genome, gen, fitness) {
		this.genome = genome;
		this.network = genome.constructNetwork;

		this.fitness = fitness;
		this.originalFitness = fitness;
		this.winner = false;
		this.species = undefined;
		this.generation = gen;
		this.champion = false;
	}
}