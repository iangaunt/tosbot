const { SlashCommandBuilder } = require("discord.js")

/**
 * Forcekills the bot by closing the active Node runtime.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Forcekills the bot [admin command only]."),

    /**
     * Kills the bot if the user id of the interaction is that of the bot owner (Ian).
     * @param interaction - The interaction object. Used to parse user id.
     */
    async execute(interaction) {
        if (interaction.user.id.toString() === "614954208139149319") {
            await interaction.reply("Closing bot...");
            process.exit();
        } else {
            await interaction.reply({ content: 'This is an admin only command.', ephemeral: true });
        }
    }
}
