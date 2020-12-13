class Activation {
	static sigmoid(x, slope) {
		return 1 / (1 + Math.exp(-(slope * x)));
	}

	static linearActivation(x) {
		return x;
	}

	static binaryStep(x) {
		return x < 0 ? 0 : 1;
	}

	static TanH(x) {
		return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x))
	}

	static ReLU(x) {
		return x < 0 ? 0 : x;
	}

	static leakyRelU(x, leakiness) {
		return x < 0 ? x * leakiness : x;
	}
}