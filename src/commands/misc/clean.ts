const { SlashCommandBuilder } = require("discord.js")

import TownBuilder from "../../utils/backend/game/TownBuilder";
import RoleHandler from "../../utils/backend/server/RoleHandler";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clean")
        .setDescription("Cleans up the current town."),

    async execute(interaction) {
        if (TownBuilder.currentTown != null) {
            TownBuilder.currentTown.clear();

            if (RoleHandler.roles != null) {
                RoleHandler.cleanupRoles();
            }

            await interaction.reply("The town has been cleared!");
        } else {
            await interaction.reply("There was no town to clear ... consider building one!");
        }
    }
}
