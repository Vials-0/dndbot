const { prefix } = require("../config.json");

module.exports = {
	name: "help",
	args: false,
	description: "List usable commands via DM",
	async execute(message) {
		const { commands } = message.client;
		const data = [];

		data.push("Command list: \n");
		data.push(commands.map(command => `${prefix}${command.name}`).join("\n"));

		return message.author.send(data, { split: true })
			.then(() => {
				if (message.channel.type === "dm") return;
				message.reply("I've sent you a list of avaiable commands via DM.");
			});
		// .catch(error => {
		// 	message.reply("it seems like I can't DM you! Do you have DMs disabled?");
		// });
	}
};