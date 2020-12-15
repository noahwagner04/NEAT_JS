/*
static class that holds all
the 6 activation functions, the user
can either choose to use one of these functions
for all activations in the population, or to 
have individual nodes randomly choose their own
activation, the net affect of this is to hopfully
solve the issue of what activation function to use, 
and to leave it to an evolutionary process to decide,
it could also allow for more unique behavior
*/

class Activation {
	static slope = 4.924273;
	static leakiness = 0.01;
	
	static sigmoid(x) {
		return 1 / (1 + Math.exp(-(Activation.slope * x)));
	}

	static linearActivation(x) {
		return x;
	}

	static binaryStep(x) {
		return x < 0 ? 0 : 1;
	}

	static TanH(x) {
		return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
	}

	static ReLU(x) {
		return x < 0 ? 0 : x;
	}

	static leakyRelU(x) {
		return x < 0 ? x * Activation.leakiness : x;
	}
}