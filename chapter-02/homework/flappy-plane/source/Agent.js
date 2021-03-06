
(function(global) {

	const _BRAIN_REFERENCE = {
		inputs:  [ 0.5, 0.6 ],
		outputs: [ 1 ]
	};

	const Agent = function(data) {

		this.brain   = new Brain();
		this.fitness = 0;


		// XXX: Brain needs a reference dataset
		this.brain.initialize(
			_BRAIN_REFERENCE.inputs,
			_BRAIN_REFERENCE.outputs
		);

	};

	Agent.prototype = {

		compute: function(inputs) {
			return this.brain.compute(inputs);
		},

		clone: function() {

			let clone = new Agent();

			// This will copy/paste the exact same Brain
			// onto our clone. We need this method for
			// having non-linked Survivors as Survivors
			// are Elite and can be bred into other Babies
			//
			// This avoids basically that one Agent can
			// by coincidence be used for several Entities

			clone.fitness      = this.fitness;
			clone.brain.layers = JSON.parse(JSON.stringify(this.brain.layers));


			return clone;

		},

		crossover: function(agent) {

			let babies      = [ new Agent(), new Agent() ];
			let brain0      = [];
			let brain1      = [];
			let weights_mum = this.brain.serialize();
			let weights_dad = agent.brain.serialize();
			let dnasplit    = (Math.random() * weights_mum.length) | 0;


			for (let w = 0, wl = weights_mum.length; w < wl; w++) {

				// Cross-Breeding
				//
				// - DNA is "only" the weights of the brain
				// - first part of DNA is mum
				// - second part of DNA is dad

				if (w < dnasplit) {
					brain0[w] = weights_mum[w];
					brain1[w] = weights_dad[w];
				} else {
					brain0[w] = weights_dad[w];
					brain1[w] = weights_mum[w];
				}


				// Mutations
				//
				// - 10% Mutation Rate
				// - 25% Mutation Range
				// - Math.random() is only positive
				// - Math.random() * 2 - 1 can lead to negative value

				if (Math.random() <= 0.10) {
					brain0[w] += (Math.random() * 0.25 * 2) - 0.25;
					brain1[w] += (Math.random() * 0.25 * 2) - 0.25;
				}

			}


			// Baby Brains
			// - brain weights were generated by DNA above

			babies[0].brain.deserialize(brain0);
			babies[1].brain.deserialize(brain1);


			return babies;

		}

	};


	global.Agent = Agent;

})(typeof global !== 'undefined' ? global : this);
