const { queryDndApi } = require("../utils/query");

module.exports = {
	name: "condition",
	description: "Query for condition data",
	async execute(message, args) {
		const result = await queryDndApi(args[0], "condition");
		message.channel.send(result);
	}
};