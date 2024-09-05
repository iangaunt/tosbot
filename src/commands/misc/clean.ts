const { SlashCommandBuilder } = require("discord.js")

import Game from "../../global/Game";

/** 
 * Removes all of the channels and roles used in the current round.
 * Since the game class is static, all the fields will be remade once the
 * `/start` command is executed again.
 * 
 * Not sure it this leads to a rate limit, but just in case, try removing stuff
 * manually occasionally.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("clean")
        .setDescription("Cleans up the current town."),

    /**
     * Clears the town builder and server role handler.
     * @param interaction - The interaction object. Only used for replies.
     */
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
