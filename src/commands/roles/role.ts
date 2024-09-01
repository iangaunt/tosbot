const { SlashCommandBuilder } = require("discord.js")

import rolesJson from "../../../public/roles/roledata.json";
import RoleEmbed from "../../utils/RoleEmbed"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("Generates a random role and description."),

    async execute(interaction) {
        const randomIndex = Math.floor(Math.random() * Object.keys(rolesJson).length);

        await interaction.reply({ embeds: [
            RoleEmbed(Object.keys(rolesJson)[randomIndex])
        ]});
    }
}
