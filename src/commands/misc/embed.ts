import NighttimeEmbed from "../../utils/visuals/NighttimeEmbed";

const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Used to test embeds."),

    async execute(interaction) {
        await interaction.reply({ embeds: [NighttimeEmbed(1, true), NighttimeEmbed(2, false)] })
    }
}
