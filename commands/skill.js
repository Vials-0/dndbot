const { queryDndApi } = require("../utils/query");

module.exports = {
	name: "skill",
	description: "Query for skill data",
	async execute(message, args) {
		const result = await queryDndApi(args[0], "skill");
		message.channel.send(result);
	}
};