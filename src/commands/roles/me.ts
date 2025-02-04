import Game from "../../global/Game";
import RoleEmbed from "../../utils/visuals/embeds/RoleEmbed";

import roledata from "../../../public/embeds/roles.json"

const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("me")
        .setDescription("Returns your role card."),

    async execute(interaction) {
        if (Game.playerRoleHandler) {
            const prh = Game.playerRoleHandler;
            const player = prh.playerRoleMap.get(prh.idPlayerMap.get(interaction.user.id));
            const role = player.name;
            const houseId = player.houseChannelId;

            if (interaction.channelId == houseId) {
                await interaction.reply({ embeds: [ RoleEmbed(role) ]});
                return;
            } else {
                await interaction.reply({ 
                    content: 'You cannot reveal your role!', ephemeral: true 
                });
                return;
            }
        } else {
            await interaction.reply({ 
                content: 'You are not currently in a game.', ephemeral: true 
            });
            return;
        }
    }
}
