import Game from "../../global/Game";
import VoteHandler from "../../utils/backend/game/VoteHandler";
import NighttimeEmbed from "../../utils/visuals/NighttimeEmbed";

const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Used to test embeds."),

    async execute(interaction) {
        Game.guild = interaction.guild;

        const voteHandler = new VoteHandler();
        voteHandler.create("poop");

        await interaction.reply() // { embeds: [NighttimeEmbed(1, true), NighttimeEmbed(2, false)] })
    }
}
