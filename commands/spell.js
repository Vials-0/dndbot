const SpellModel = require("../models/SpellModel");
const model = new SpellModel();

module.exports = {
	name: "spell",
	args: true,
	usage: "<spell>",
	description: "Query for spell data",
	async execute(message, args) {
		const result = model.search(args[0]);
		message.channel.send(result);
	}
};