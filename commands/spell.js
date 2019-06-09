const { queryDndApi } = require("../utils/query");

module.exports = {
	name: "spell",
	description: "Query for spell data",
	async execute(message, args) {
		const result = await queryDndApi(args[0], "spell");
		message.channel.send(result);
	}
};