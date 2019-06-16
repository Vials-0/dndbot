const { queryDndApi } = require("../utils/query");

module.exports = {
	name: "creature",
	args: true,
	usage: "<creature>",
	description: "Query for creature data",
	async execute(message, args) {
		const result = await queryDndApi(args[0], "creature");
		message.channel.send(result);
	}
};