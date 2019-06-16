const ItemModel = require("../models/ItemModel");
const model = new ItemModel();

module.exports = {
	name: "item",
	args: true,
	usage: "<item>",
	description: "Query for item data",
	async execute(message, args) {
		const result = model.search(args[0]);
		message.channel.send(result);
	}
};