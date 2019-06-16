const roll = require("../utils/diceroller");

module.exports = {
	name: "roll",
	args: true,
	usage: "<dice-notation> (ex. 2d6)",
	description: "Roll a dice using the following format: !roll 2d6",
	execute(message, args) {
		const result = roll(args[0]);
		message.channel.send(result);
	}
};