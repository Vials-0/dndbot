const { queryDndApi } = require("./utils/query");

module.exports = {
	name: "skill",
	description: "Query for skill data",
	execute(message, args) {
		const result = queryDndApi(args[0], "skill");
		message.channel.send(result);
	}
};