const { SlashCommandBuilder } = require("discord.js")
import { ComponentType } from "discord.js";

import Game from "../../global/Game";
import ActionController from "../../utils/visuals/controllers/ActionController";

/**
 * Command used for testing embed reactions. Note that this command is 
 * typically VERY UNSAFE and should not be used unless it is for testing.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Used to test embeds."),

    /**
     * Replies with test embeds or controllers.
     * @param interaction - The interaction object. Used for replies.
     */
    async execute(interaction) {
        Game.guild = interaction.guild;

        const action = new ActionController();
        const m = action.create("Mafioso", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
        // const s = ActionController("Sheriff", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])

        const msg = await interaction.reply(m);
        const collectorFilter = i => i === i;

        const collector = msg.createMessageComponentCollector({ 
            componentType: ComponentType.Button,
            collectorFilter, 
            time: Game.nightLength * 1000 
        })
    }
}
