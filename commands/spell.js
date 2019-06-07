const { queryDndApi } = require("./utils/query");

module.exports = {
	name: "spell",
	description: "Query for spell data",
	execute(message, args) {
		const result = queryDndApi(args[0], "spell");
		message.channel.send(result);
	}
};