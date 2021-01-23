/*
the genotype in a organsim,is 
responsible for creating the 
network, mutations, and crossover
*/
class Genome {
	constructor(inNum, outNum, population) {
		if (arguments.length === 1 && arguments[0] instanceof Genome) { // check to see if we only recieve a genome, if so, exicute copy constructor
			let genome = arguments[0];
			this.nodeG = genome.copyNodeG();			 // a list of copied node genes from genome
			this.connectionG = genome.copyConnectionG(); // a list of all connection genes copied from genome, takes new copied nodes to reconnect connections with

			this.inNum = genome.inNum;	 // the number of in node genes this genome copied from genome
			this.outNum = genome.outNum; // the number of out node genes this genome copied from genome

			this.population = genome.population;

			this.phenotype = undefined;

		} else if(Array.isArray(inNum) && Array.isArray(outNum)){ // check to see if we recieve nodeG and connectionG, if so, build genome off of those two arrays
			this.nodeG = outNum;
			this.connectionG = inNum;

			this.phenotype = undefined;

			this.population = population;

		} else { // do the first gen constructor
			this.nodeG = [];		// a list of all node genes in this genome
			this.connectionG = [];  // a list of all connection genes in this genome

			this.inNum = inNum;	  	// the number of in node genes this genome will have
			this.outNum = outNum; 	// the number of out node genes this genome will have

			this.phenotype = undefined;

			this.population = population;

			this.init(); // initializes the genome, gets overriden when this genome is a copy of another
		}
	}

	/*
	creates a new nodeG array exactly 
	like this genomes nodeG then returns it.
	doesn't copy the net Node, as the phenotype creation
	is all done in construct network
	*/
	copyNodeG() {
		let newNodeG = [];
		this.nodeG.forEach(nodeGene => newNodeG.push(nodeGene.clone()));
		return newNodeG;
	}

	/*
	creates a new connectionG array exactly 
	like this genomes connectionG then returns it.
	takes a copied nodeG array from this genome to 
	replace each connetion node ref to copied node ref.
	depends on pre nodeG array to work.
	*/
	copyConnectionG() {
		let newConnectionG = [];
		this.connectionG.forEach(connectionGene => {
			newConnectionG.push(connectionGene.clone());
		});
		return newConnectionG;
	}

	/*
	return a clone of this genome, all phynotype(network)
	atributes are not copied.
	*/
	clone() {
		return new Genome(this);
	}

	// returns an array of the input nodes in nodeG
	getInputs() {
		let result = [];
		this.nodeG.forEach(nodeGene => {
			if (nodeGene.ntype === nodeTypes.SENSOR) result.push(nodeGene);
		});
		return result;
	}

	// returns an array of the output nodes in nodeG
	getOutputs() {
		let result = [];
		this.nodeG.forEach(nodeGene => {
			if (nodeGene.placement === nodePlaces.OUTPUT) result.push(nodeGene);
		});
		return result;
	}

	/*
	initialize function, creates the initial node genes
	and connection genes, only used for first gen genomes
	*/
	init() {
		let id = 0;
		let inputs = [];
		let outputs = [];
		let innov = 0;
		/*
		initializes the input node genes,
		checks whether a node should be a bias 
		or input, then adds it to the nodeG array, labels
		node ids starting at a given id
		*/
		for (let i = 0; i < this.inNum; i++) {
			let currentNodeG = undefined;
			if (i > 0) currentNodeG = new NodeGene(i, nodeTypes.SENSOR, nodePlaces.INPUT, Activation.linearActivation);
			else currentNodeG = new NodeGene(i, nodeTypes.SENSOR, nodePlaces.BIAS, Activation.linearActivation);
			this.nodeG.push(currentNodeG);
			id++;
		}

		/*
		initializes the output node genes, labels the
		id of the nodes starting at a given id
		*/
		for (let i = id; i < this.outNum + id; i++) {
			let currentNodeG = new NodeGene(i, nodeTypes.NEURON, nodePlaces.OUTPUT, this.chooseActivationFunc());
			this.nodeG.push(currentNodeG);
		}

		inputs = this.getInputs();
		outputs = this.getOutputs();

		/*
		initializes connection genes of this genome, takes
		two arrays, input and output to iterate over, weight is
		between -1, 1
		*/
		inputs.forEach(input => {
			outputs.forEach(output => {
				this.connectionG.push(new ConnectionGene(input, output, Math.random() * 2 - 1, false, innov, true));
				innov++;
			});
		});
		return this;
	}

	/*
	creates a network from the node genes and 
	connection genes, a population reference is used
	to accesss the activation function the user defines
	in NEAT config obj
	*/
	constructNetwork() {
		let inputs = [];
		let outputs = [];
		let all = [];

		/*
		creates a network node for each gene node
		in nodeG array, chooses activation function
		based on bool randomNodeActivation, then
		adds it to the apropiate array, input, output, or all
		*/
		this.nodeG.forEach(nodeGene => {
			let node = nodeGene.createNetNode().netNode;
			if (nodeGene.ntype === nodeTypes.SENSOR) inputs.push(node);
			else if (nodeGene.placement === nodePlaces.OUTPUT) outputs.push(node);
			all.push(node);
		});

		/*
		creates new connections that live in
		the nodes in / out connection arrays,
		their inNode and outNode is a ref to 
		the networks nodes, not the node genes
		*/
		this.connectionG.forEach(connectionGene => {
			if(connectionGene.enabled === true) {
				let connection = connectionGene.connection;
				let inNode = connection.inNode.netNode;
				let outNode = connection.outNode.netNode;

				outNode.addIncoming(inNode, connection.weight, connection.isRecur);
			}
		});

		/*
		initializes the network with the
		node arrays, the adds a ref to this
		genome, and adds a ref to the network 
		in this.phenotype
		*/
		let network = new Network(inputs, outputs, all);

		network.genotype = this;
		this.phenotype = network;
		return this;
	}
	/*
	adds a new connection to this genome,
	takes in population to access innovs and
	currInnov
	*/
	mutateAddConnection(tries) {
		let newConnectionGene = undefined;
		let node1 = undefined;
		let node2 = undefined;
		let nodes = [];
		let doRecur = false;
		let tryCount = 0;
		let recurFlag = false;
		let count = 0;
		let thresh = this.nodeG.length * this.nodeG.length;
		let found = false;

		//decide whether or not to make this link recurent
		if (Math.random() < this.population.NEAT.recurProb) {
			doRecur = true;
		}

		/*
		put all non-sensor nodes in an array
		this is done to help prevent connections
		inputing to input nodes(we dont want that)
		*/
		this.nodeG.forEach(node => {
			if (node.ntype !== nodeTypes.SENSOR) {
				nodes.push(node);
			}
		});

		/*
		this is done to update the phenotype to make 
		the Network.checkRecur func work
		*/
		this.constructNetwork();

		// run until a certain amount of attempts
		while (tryCount <= tries) {
			let index1 = 0;
			let index2 = 0;
			let redo = false;

			if (doRecur) {
				let loopRecur = false;
				/*
				these three blocks pick the potential
				nodes for the in / out of the new gene randomly.
				loop recur means to have the connection
				loop on one node
				*/
				if (Math.random() > 0.5) {
					loopRecur = true;
				}
				if (loopRecur) {
					index1 = Math.floor(Math.random() * nodes.length);
					index2 = index1;
				} else {
					index1 = Math.floor(Math.random() * nodes.length);
					index2 = Math.floor(Math.random() * nodes.length);
				}

				node1 = nodes[index1];
				node2 = nodes[index2];

				// check to see if this gene already exists
				for (let i = 0; i < this.connectionG.length; i++) {
					let connection = this.connectionG[i].connection;
					if (connection.outNode.ntype !== nodeTypes.SENSOR 
						&& connection.inNode === node1 
						&& connection.outNode === node2 
						&& connection.isRecur === true) {
						redo = true;
					}
				}

				if (redo === true) {
					tryCount++;
				} else {
					// check to see if this recurent is really recurrent
					recurFlag = Network.checkRecur(node1.netNode, node2.netNode, count, thresh);
					if(recurFlag) {
						found = true;
						break;
					} else {
						tryCount++;
					}
				}
			} else {
				// pick the potential nodes randomly
				index1 = Math.floor(Math.random() * this.nodeG.length);
				index2 = Math.floor(Math.random() * nodes.length);

				node1 = this.nodeG[index1];
				node2 = nodes[index2];

				// check to see if this gene already exists
				for (let i = 0; i < this.connectionG.length; i++) {
					let connection = this.connectionG[i].connection;
					if (connection.outNode.ntype !== nodeTypes.SENSOR 
						&& connection.inNode === node1 
						&& connection.outNode === node2 
						&& connection.isRecur === false) {
						redo = true;
					}
				}
				if(redo) {
					tryCount++;
				} else {
					// if recurrent, redo
					recurFlag = Network.checkRecur(node1.netNode, node2.netNode, count, thresh);

					if(recurFlag) {
						tryCount++;
					} else {
						found = true;
						break;
					}
				}
			}
		}

		if (!found) return;
		/*
		check to see if this mutation has already 
		happened somewhere in the population
		*/ 
		else {
			let done = false;
			let index = 0;
			while (!done) {
				let innov = this.population.innovations[index];
				if (index === this.population.innovations.length) {
					// this is a new unique mutation
					let weight = Math.random() * 2 - 1;
					newConnectionGene = new ConnectionGene(node1, node2, weight, recurFlag, this.population.currInnov, true);
					// record this mutation for the rest of the genomes to see
					this.population.innovations.push(new Innovation(node1.id, node2.id, this.population.currInnov, weight, recurFlag))
					done = true;
				} else if (innov.type === innovTypes.NEWCONNECTION &&
					innov.inNodeId === node1.id &&
					innov.outNodeId === node2.id &&
					innov.recur === recurFlag) {
					/*
					this mutation already happend, and will receive the same weight and innovation
					as the mutation that already accured
					*/
					newConnectionGene = new ConnectionGene(node1, node2, innov.newWeight, recurFlag, innov.innovation, true);
					done = true;
				} else index++;
			}

			this.population.currInnov++;
			this.addGene(newConnectionGene); // add the gene to the correct place
			return this;
		}
	}

	/*
	adds a new node on a connection, splitting it in two
	and disabling it. Creates two new connections, the one leading
	to the new node(which receives a weight of one 
	for minimal decrease in preformance) and the one going out
	from the new node(which receives the same weight as the connection 
	originally split) takes in population to access innovs array, currNodeId
	and currInnov
	*/
	mutateAddNode() {
		let geneToSplit = undefined;
		let newGene1 = undefined;
		let newGene2 = undefined;
		let newNodeGene = undefined;

		/*
		get the gene to split, biasing older genes for 
		minimal effect of the change, allows spliting 
		of genes distrubute evenly amongst all genes
		(splits genes that haven't been split yet)
		*/
		for (let i = 0; i < this.connectionG.length; i++) {
			let currGene = this.connectionG[i];
			if (currGene.connection.inNode.placement === nodePlaces.BIAS || currGene.enabled === false) continue;
			else if (Math.random() < 0.7) {
				geneToSplit = currGene;
				break;
			} else if (i === this.connectionG.length - 1) geneToSplit = currGene;
		}

		if (geneToSplit === undefined) {
			return;
		}

		geneToSplit.enabled = false;

		let connection = geneToSplit.connection;
		let oldWeight = geneToSplit.connection.weight;

		let inNodeGene = geneToSplit.connection.inNode;
		let outNodeGene = geneToSplit.connection.outNode;

		let recur = geneToSplit.connection.isRecur;


		/*
		check if this mutation has already occurred
		in the rest of the population, if it has, make
		the new nodes id the same as the same innov's id,
		and make both new gene's innov nums be the same as
		the matched innov, if not, make new nodes id the currId + 1,
		and the genes innovs currInnov, and currInnov + 1
		*/
		let done = false;
		let index = 0;
		while (!done) {
			let innov = this.population.innovations[index];
			if (index === this.population.innovations.length) {
				// this is a new unique mutation
				let nodeActivation = this.chooseActivationFunc();
				newNodeGene = new NodeGene(this.population.currNodeId + 1, nodeTypes.NEURON, nodePlaces.HIDDEN, nodeActivation);
				if (recur) {
					newGene1 = new ConnectionGene(inNodeGene, newNodeGene, 1, true, this.population.currInnov, true);
					newGene2 = new ConnectionGene(newNodeGene, outNodeGene, oldWeight, false, this.population.currInnov + 1, true);
				} else {
					newGene1 = new ConnectionGene(inNodeGene, newNodeGene, 1, false, this.population.currInnov, true);
					newGene2 = new ConnectionGene(newNodeGene, outNodeGene, oldWeight, false, this.population.currInnov + 1, true);
				}
				// record this mutation for the rest of the geomes
				this.population.innovations.push(new Innovation(inNodeGene.id, outNodeGene.id, this.population.currInnov, this.population.currInnov + 1, this.population.currNodeId + 1, geneToSplit.innov, nodeActivation));

				this.population.currInnov += 2;
				this.population.currNodeId += 1;

				done = true;
			} else if (innov.type === innovTypes.NEWNODE &&
				innov.inNodeId === inNodeGene.id &&
				innov.outNodeId === outNodeGene.id &&
				innov.oldInnov === geneToSplit.innov) {
				// this mutation has already happend, and will recieve the same innovs and node id as the other mutation
				newNodeGene = new NodeGene(innov.nodeId, nodeTypes.NEURON, nodePlaces.HIDDEN, innov.activation);
				if (recur) {
					newGene1 = new ConnectionGene(inNodeGene, newNodeGene, 1, true, innov.innovation, true);
					newGene2 = new ConnectionGene(newNodeGene, outNodeGene, oldWeight, false, innov.innovation2, true);
				} else {
					newGene1 = new ConnectionGene(inNodeGene, newNodeGene, 1, false, innov.innovation, true);
					newGene2 = new ConnectionGene(newNodeGene, outNodeGene, oldWeight, false, innov.innovation2, true);
				}
				done = true;
			} else index++;
		}

		/*
		add the new genes and nodes to the
		nodeG and connectionG arrays, adds them
		in the correct order
		*/
		this.addGene(newGene1);
		this.addGene(newGene2);
		this.addNode(newNodeGene);
		return this;
	}

	/*
	either perturbes a weight, or randomizes it.
	This is done to all connections. randomize weight 
	mutations are bias towards newer connections.
	*/
	mutateWeights(rate, scale) {
		let newGeneDropOff = this.connectionG.length * 0.8;
		for (let i = 0; i < this.connectionG.length; i++) {
			let connection = this.connectionG[i].connection;
			let mutateNum = (Math.random() * 2 - 1) * scale;
			let perturbProb = 0;
			let randomizeProb = 0;

			// bias the tail end of the genome to stronger mutations
			if(this.connectionG.length >= 10 && 1 > newGeneDropOff) {
				perturbProb = 0.3;
				randomizeProb = 0.1;
			} else {
				perturbProb = 1 - rate;
				randomizeProb = 1 - rate - 0.1;
			}

			let rdm = Math.random();
			if(rdm > perturbProb) {
				connection.weight += mutateNum;
			} else if(rdm > randomizeProb) {
				connection.weight = mutateNum;
			}
		}
		return this;
	}

	/*
	mutates the genome, combining all the mutate
	methods to this one method, takes population for
	inputs to mutate funcs (addNodeRate, addConnectionRate, rate, scale)
	uses global NEAT settings for probability thresholds
	*/
	mutate() {
		if (Math.random() < this.population.NEAT.mutateNodeProb) {
			this.mutateAddNode();
		} else if (Math.random() < this.population.NEAT.mutateConnectionProb) {
			this.mutateAddConnection(20);
		} else {
			if (Math.random() < this.population.NEAT.mutateWeightsProb) {
				this.mutateWeights(0.9, this.population.NEAT.mutationPower);
			}
			if(Math.random() < this.population.NEAT.renableProb) {
				this.mutateRenable();
			}
			if(Math.random() < this.population.NEAT.toggleEnableProb) {
				this.mutateToggleEnable(1);
			}
		}
		return this;
	}

	/*
	toggles a random connection gene on or off a given
	number of times, each time picking a random connection
	*/
	mutateToggleEnable(times) {
		let rdmIndex = Math.floor(Math.random() * this.connectionG.length);
		let connectionGene = this.connectionG[rdmIndex];
		if (connectionGene.enabled === true) {
			/*
			check to see if connectionGene inNode has any other outgoing connections
			if not then disabling this gene would result in a section of the network being usless
			(prevents a node from not having an output, making it usless)
			*/
			for (let i = 0; i < this.connectionG.length; i++) {
				let connection = this.connectionG[i];
				if (connection.connection.inNode === connectionGene.connection.inNode &&
					connection.enabled === true &&
					connection.innov !== connectionGene.innov) {
					connectionGene.enabled = false;
					break;
				}
			}
		} else connectionGene.enabled = true;
		return this;
	}

	// finds a the first disabled connection gene and renables it
	mutateRenable() {
		for (var i = 0; i < this.connectionG.length; i++) {
			let connectionGene = this.connectionG[i];
			if(connectionGene.enabled === false) {
				connectionGene.enabled = true;
				break;
			}
		}
		return this;
	}

	/*
	sorts the connectionG array from smallest innov
	to greatest innov
	*/
	sortGenes() {
		this.connectionG.sort((a, b) => a.innov - b.innov);
		return this;
	}

	/*
	sorts the nodeG array from smallest id
	to greatest id
	*/
	sortNodes() {
		this.nodeG.sort((a, b) => a.id - b.id);
		return this;
	}

	/*
	adds a gene to the connetionG array
	in the correct spot
	*/
	addGene(connectionGene) {
		let index = 0;
		while (index !== this.connectionG.length && this.connectionG[index].innov < connectionGene.innov) {
			index++;
		}
		this.connectionG.splice(index, 0, connectionGene);
		return this;
	}

	/*
	adds a node gene to the nodeG array
	in the correct spot
	*/
	addNode(nodeGene) {
		let index = 0;
		while (index !== this.nodeG.length && this.nodeG[index].id < nodeGene.id) {
			index++;
		}
		this.nodeG.splice(index, 0, nodeGene);
		return this;
	}

	/*
	breeds two gemomes together using the NEAT
	competeing conventions solution returns a new
	genome
	*/
	static crossover(genome1, genome2, fit1, fit2, interspeciesFlag, population) {
		let index1 = 0;
		let index2 = 0;
		let chosenGene = undefined;
		let skip = false;
		let p1IsBetter = false;
		let enabled = true;
		let newConnectionG = [];
		let newNodeG = [];
		// only for average crossover
		let avgCrossover = false;
		let avgWeight = undefined;
		let avgGene = undefined;

		// first decide if we are going to do random or avg crossover
		if(Math.random() < population.NEAT.mateAvgProb) {
			avgCrossover = true;
		}

		for (let i = 0; i < genome1.nodeG.length; i++) {
			let node = genome1.nodeG[i];
			if (node.placement === nodePlaces.INPUT ||
				node.placement === nodePlaces.BIAS ||
				node.placement === nodePlaces.OUTPUT) {
				newNodeG.push(new NodeGene(node.id, node.ntype, node.placement, node.netNodeActivation));
			}
		}

		/*
		find out who is the better genome, if they have equal fitness,
		call the smaller genome better
		*/
		if(fit1 === fit2) {
			if(genome1.connectionG.length > genome2.connectionG.length) {
				p1IsBetter = false;
			} else p1IsBetter = true;
		} else if(fit1 > fit2) { 
			p1IsBetter = true; 
		} else {
			p1IsBetter = false;
		}

		// go till we reach the end of both gene arrays
		while (index1 < genome1.connectionG.length || index2 < genome2.connectionG.length) {

			enabled = true;
			skip = false;

			let gene1 = genome1.connectionG[index1];
			let gene2 = genome2.connectionG[index2];

			/*
			if we are at the end of one of the gene arrays, 
			count this as an excess gene by skipping it if 
			the other gene has a better fit
			*/
			if (!gene1) {
				chosenGene = gene2;
				index2++;
				if (p1IsBetter) skip = true;
			} else if (!gene2) {
				chosenGene = gene1;
				index1++;
				if (!p1IsBetter) skip = true;
			} else {
				// if they are the same connection
				if (gene1.innov === gene2.innov) {
					// average their weights if passed threshold
					if(avgCrossover) {
						// pick nodes from each parent randomly
						let avgInNode = Math.random() > 0.5 ? gene1.connection.inNode : gene2.connection.inNode;
						let avgOutNode = Math.random() > 0.5 ? gene1.connection.outNode : gene2.connection.outNode;
						let avgRecur = Math.random() > 0.5 ? gene1.connection.isRecur : gene2.connection.isRecur;
						avgWeight = gene1.connection.weight + gene2.connection.weight / 2;

						avgGene = new ConnectionGene(avgInNode, avgOutNode, avgWeight, avgRecur, gene1.innov, true);
						chosenGene = avgGene;
					}else {
						// pick one randomly
						if (Math.random() > 0.5) {
							chosenGene = gene1;
						} else {
							chosenGene = gene2;
						}
					}
					// small chance that this gene will be enabled if either gene was disabled
					if (gene1.enabled === false || gene2.enabled === false) {
						console.log(gene1.enabled, gene2.enabled, index1, index2);
						if (Math.random() < 0.75) {
							enabled = false;
						}
					}

					index1++;
					index2++;
				} 
				// disjoint case, will only be included if gene1 is better
				else if (gene1.innov > gene2.innov) {
					chosenGene = gene2;
					if (p1IsBetter) skip = true;
					index2++;
				} 
				// disjoin case, will only be included if gene2 is better
				else if (gene2.innov > gene1.innov) {
					chosenGene = gene1;
					if (!p1IsBetter) skip = true;
					index1++;
				}
			}

			/*
			NOTE: possibly a parameter population.NEAT.fastGrowthRate?? 
			it would make skip always false, so it awlays includs all genes,
			also don't know if the check below should exist, im going off the
			original pdf paper, and it says to make interspecies mating to 
			allow all genes, so im going to leave it for now
			*/
			// if this is an interspecies breed, let all genes through
			if(interspeciesFlag) {
				skip = false;
			}

			/*
			checks if the chosen gene conflicts with an already chosen 
			gene. e.g. if the they represent the same connection
			this can occur if the one of the genes was created in a different generation
			than the other, therefore recieving a different innov numbers even if it was the
			same structural mutation. 
			another e.g., if node1 has a recurrent connection that leads to node2, who also 
			has a recurrent connection leading back to node1
			*/
			for (let i = 0; i < newConnectionG.length; i++) {
				let currConnection = newConnectionG[i].connection;
				let chosenConnection = chosenGene.connection;
				if ((currConnection.inNode === chosenConnection.inNode &&
						currConnection.outNode === chosenConnection.outNode &&
						currConnection.isRecur === chosenConnection.isRecur) ||
					(currConnection.inNode === chosenConnection.outNode &&
						currConnection.outNode === chosenConnection.inNode &&
						currConnection.isRecur && chosenConnection.isRecur)) {
					skip = true;
					return;
				}
			}

			if(!skip) {
				let inNode = chosenGene.connection.inNode;
				let outNode = chosenGene.connection.outNode;

				let newInNode = undefined;
				let newOutNode = undefined;

				// check to see if the node has already been made
				let inMatch = newNodeG.find(node => node.id === inNode.id);
				let outMatch = newNodeG.find(node => node.id === outNode.id);

				// if matched, then get that node ref
				if(inMatch) {
					newInNode = inMatch;
				} else {
					// if not found, then make a new node and add it to the newNodeG array
					newInNode = new NodeGene(inNode.id, inNode.ntype, inNode.placement, inNode.netNodeActivation);
					newNodeG.push(newInNode);
				}
				// if matched, then get that node ref
				if(outMatch) {
					newOutNode = outMatch;
				} else {
					// if not found, then make a new node and add it to the newNodeG array
					newOutNode = new NodeGene(outNode.id, outNode.ntype, outNode.placement, outNode.netNodeActivation);
					newNodeG.push(newOutNode);					
				}
				// sort the nodes from id's ascending
				newNodeG.sort((a, b) => a - b);
				let newConnectionGene = new ConnectionGene(newInNode, newOutNode, chosenGene.connection.weight, chosenGene.connection.isRecur, chosenGene.innov, enabled);
				newConnectionG.push(newConnectionGene);
			}
		}
		return new Genome(newConnectionG, newNodeG, population);
	}

	/*
	compares two genomes compatibility to be in the same species
	using the NEAT compatibility method. It uses three global parameters
	c1, c2, and c3, which changes the importance of disjoint, excess, and wieght
	value. It uses the compatibility threshold global parameter to see
	whether they are in the same species.
	*/
	static compatibility(genome1, genome2, population) {
		let disjointNum = 0;
		let excessNum = 0;
		let matchingNum = 0; // this is used to help cacluate the average weight diff
		let weightDiffTotal = 0;

		let largeGenomeSize = 0; // the larger of the two genomes

		/*
		get the larger of the two genomes, this is done for normalization purposes
		NOTE: currently not using this, don't yet know when its neccessary to do so, 
		I need to do more testing
		*/
		if (genome1.connectionG.length > genome2.connectionG.length) {
			largeGenomeSize = genome1.connectionG.length;
		} else {
			largeGenomeSize = genome2.connectionG.length;
		}

		let geneIndex1 = 0;
		let geneIndex2 = 0;

		/*
		compares the two genomes, stops till we are at the end of the larger genome,
		calculates the disjointNum, excessNum, or matchingNum for NEAT compatibility func.
		*/
		while (geneIndex1 !== genome1.connectionG.length || geneIndex2 !== genome2.connectionG.length) {
			let gene1 = genome1.connectionG[geneIndex1];
			let gene2 = genome2.connectionG[geneIndex2];

			// count this gene as excess if we are at the end of one of the genomes
			if (!gene1) {
				excessNum++;
				geneIndex2++;
			} else if (!gene2) {
				excessNum++;
				geneIndex1++;
			} else {
				/*
				if the genes are the same, add to weightDiffTotal, and add to matching
				if not count this gene as disjoint
				*/
				if (gene1.innov === gene2.innov) {
					matchingNum++;
					weightDiffTotal += Math.abs(gene1.connection.weight - gene2.connection.weight);
					geneIndex1++;
					geneIndex2++;
				} else if (gene1.innov > gene2.innov) {
					geneIndex2++;
					disjointNum++;
				} else if (gene2.innov > gene1.innov) {
					geneIndex1++;
					disjointNum++;
				}
			}
		}

		// for now just return unormalized compatibility, largeGenomeSize would replace the 1's to normalize it
		return population.NEAT.disjointCoefficient * (disjointNum / 1) +
			population.NEAT.excessCoefficient * (excessNum / 1) +
			population.NEAT.weightDiffCoefficient * (weightDiffTotal / matchingNum);
	}

	/*
	chooses from the activationTypes array,
	which has the six default activation functions
	in it, the user can add their own functions to the
	array and this function will have no problem with 
	ranomly picking it
	*/
	chooseActivationFunc() {
		if (this.population.NEAT.randomActivation) {
			let rdmIndex = Math.floor(Math.random() * activationTypes.length);
			return activationTypes[rdmIndex];
		} else {
			return this.population.NEAT.activationFunction;
		}
	}
}