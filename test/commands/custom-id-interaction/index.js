const { MessageFlags } = require('discord.js');

module.exports = {
	data: {
		customId: "sampleCustomIdInteraction",
	},

	async execute(interaction) {
		console.log("This is ran for an interaction with a custom ID (example: modal submits, buttons, etc!...)")
	}
}