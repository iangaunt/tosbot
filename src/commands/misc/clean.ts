const { SlashCommandBuilder } = require("discord.js")

import TownBuilder from "../../utils/backend/TownBuilder";
import StatusHandler from "../../utils/backend/StatusHandler";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clean")
        .setDescription("Cleans up the current town."),

    async execute(interaction) {
        if (TownBuilder.currentTown != null) {
            TownBuilder.currentTown.clear();

            if (StatusHandler.roles != null) {
                StatusHandler.cleanupRoles();
            }

            await interaction.reply("The town has been cleared!");
        } else {
            await interaction.reply("There was no town to clear ... consider building one!");
        }
    }
}
