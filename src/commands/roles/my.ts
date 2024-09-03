const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("my")
        .setDescription("Forcekills the bot [admin command only]."),

    async execute(interaction) {
        if (interaction.user.id.toString() === "614954208139149319") {
            await interaction.reply("Closing bot...");
            process.exit();
        } else {
            await interaction.reply({ content: 'This is an admin only command.', ephemeral: true });
        }
    }
}
