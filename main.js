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
	const command = args.shift().toLowerCase();

	// Early return if command does not exist
	if (!client.commands.has(command)) {
		return;
	}

	try {
		client.commands.get(command).execute(message, args);
	}
	catch (err) {
		console.log(err);
		message.reply("An error occured while executing that command");
	}
});

client.login(token);