const rollDice = (notation) => {
	try {
		const dCharacters = notation.replace(/[^d]/g, "").length;

		/**
         * If your notation does not include at least one 'd'
         * or includes more than one 'd', throw an error
         * and return a correct notation example
         */
		if (
			!notation.includes("d")
            || dCharacters !== 1
		) {
			throw "Your roll must be formatted like this: 2d6";
		}

		let number = parseInt(notation.split("d")[0]);
		const sides = parseInt(notation.split("d")[1]);

		const results = [];

		while (number > 0) {
			const roll = Math.floor(Math.random() * sides) + 1;
			results.push(roll);
			number--;
		}

		if (number === 0) {
			return results;
		}
	}
	catch (err) {
		throw err;
	}
};

const roll = (notation) => {
	try {
		const rollArr = rollDice(notation);
		const total = rollArr.reduce((a, b) => a + b);

		return {
			total,
			array: rollArr,
		};
	}
	catch (err) {
		console.log("An error occured!", err);
		return err;
	}
};

module.exports = roll;