const { queryDndApi } = require("./utils/query");

module.exports = {
	name: "condition",
	description: "Query for condition data",
	execute(message, args) {
		const result = queryDndApi(args[0], "condition");
		message.channel.send(result);
	}
};