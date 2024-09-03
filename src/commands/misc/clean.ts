const { SlashCommandBuilder } = require("discord.js")

import Game from "../../global/Game";
import TownBuilder from "../../utils/backend/game/TownBuilder";
import ServerRoleHandler from "../../utils/backend/server/ServerRoleHandler";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clean")
        .setDescription("Cleans up the current town."),

    async execute(interaction) {
        if (Game.townBuilder != null) {
            Game.townBuilder.clear();

            if (Game.serverRoleHandler.roles != null) {
                Game.serverRoleHandler.cleanupRoles();
            }

            await interaction.reply("The town has been cleared!");
        } else {
            await interaction.reply("There was no town to clear ... consider building one!");
        }
    }
}
