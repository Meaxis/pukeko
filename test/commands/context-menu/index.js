const {ContextMenuCommandBuilder, ApplicationCommandType} = require("discord.js");

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Example Context Menu')
		.setType(ApplicationCommandType.Message),

	async execute(interaction) {
		await interaction.reply({
			content: "This is an example Context Menu!"
		})
	}
}