require('dotenv').config({quiet: true});

// Grab packages
const fs = require('node:fs');
const path = require('node:path');
const {Client, Events, GatewayIntentBits, Collection, REST, Routes} = require('discord.js');

// Constants
const argv = process.argv.slice(2);
const rest = new REST().setToken(process.env.TOKEN);

// Methods

module.exports.createClient = () => {
	// Create client
	const client = new Client({
		intents: Object.keys(GatewayIntentBits).map((a) => {
			return GatewayIntentBits[a];
		})
	});

	client.commands = new Collection();

	// Register commands
	const foldersPath = path.join(path.dirname(process.argv[1]), 'commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			try {
				const filePath = path.join(commandsPath, file);
				const command = require(filePath);

				if ('data' in command && 'execute' in command) {
					client.commands.set(command.data.name, command);
				} else {
					console.warn(`[Pukeko] The command at ${filePath} is missing a required "data" or "execute" property.`);
				}
			} catch (error) {
				console.error(`[Pukeko] Error loading command file ${file}:`, error);
			}
		}
	}

	// Handle interactions
	client.on(Events.InteractionCreate, async interaction => {
		const command = interaction.client.commands.get(interaction.commandName ?? interaction.customId);
		if (!command) {
			console.error(`[Pukeko] No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral
				});
			}
		}
	});

	client.once(Events.ClientReady, readyClient => {
		console.info(`[Pukeko] Ready! Logged in as ${readyClient.user.tag}.`);

		try {
			let mode = process.env.SCOPE === "guild" && !argv.find(f => f === "put-globally") ? "guild" : "global";
			let payload = {body: client.commands.filter((c) => Object.getPrototypeOf(c.data) !== Object.prototype).map((c) => c.data.toJSON())}
			let pushRequest = rest.put(
				mode === "guild" ? Routes.applicationGuildCommands(readyClient.user.id, process.env.GUILD_ID) : Routes.applicationCommands(readyClient.user.id),
				payload
			);
			
			pushRequest.then((result) => {
				console.info(`[Pukeko] Successfully reloaded ${result.length} application (/) commands for ${mode}.`);
			}).catch((e) => {
				console.warn('[Pukeko] Push request for the application failed. Error is below:')
				console.error(e)
			});
		} catch (error) {
			console.error(error);
		}
	});

	// Actions
	////// Login:
	client.login(process.env.TOKEN).then(r => {
		console.info("[Pukeko] Log-in successful! A minute please.");
	});
	
	return client;
};