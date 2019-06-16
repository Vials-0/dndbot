const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const client = new Discord.Client();
client.commands = new Discord.Collection();


// Set up commands
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

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
	const commandName = args.shift().toLowerCase();

	// Early return if command does not exist
	if (!client.commands.has(commandName)) {
		return;
	}

	const command = client.commands.get(commandName);

	// Ensure commands that need arguments have them and inform user of correct usage
	if (command.args && !args.length) {
		let reply = "You didn't provide any arguments.";

		if (command.usage) {
			reply += `\n Example of use: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	// Run command
	try {
		command.execute(message, args);
	}
	catch (err) {
		console.log(err);
		message.reply("An error occured while executing that command");
	}
});

client.login(token);