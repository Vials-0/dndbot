const { queryDndApi } = require("./utils/query");

module.exports = {
	name: "creature",
	description: "Query for creature data",
	execute(message, args) {
		const result = queryDndApi(args[0], "creature");
		message.channel.send(result);
	}
};