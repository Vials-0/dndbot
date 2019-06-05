const Discord = require("discord.js");
const client = new Discord.Client();

const roll = require("./utils/diceroller");

const { prefix, token } = require("./config.json");

// On init
client.once("ready", () => {
	console.log("Discord bot is ready to roll");
});

// Message listener
client.on("message", message => {

	// Ignore messages without bot prefix & ignore bot messages
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}

	// Break message into args & remove first arg (command)
	// Regex ignores extra spaces
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === "roll") {
		if (!args.length) {
			message.channel.send("Usage: !roll {dice} {sides}");
			return message.channel.send("For example, to roll 2 d6: !roll 2 6");
		}
		else if (args.length !== 1) {
			return message.channel.send("Please only include 1 argument when rolling dice!");
		}
		else {
			const result = roll(args[0]);
			return message.channel.send(`You rolled ${result.total}! Your rolls were: ${roll.array}`);
		}
	}
});

client.login(token);