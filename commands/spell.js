const { querySpell } = require("./utils/query");

module.exports = {
	name: "spell",
	description: "Query for spell data",
	execute(message, args) {
		const result = querySpell(args[0]);
		message.channel.send(result);
	}
};