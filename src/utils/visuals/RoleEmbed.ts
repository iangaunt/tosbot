const { EmbedBuilder } = require("discord.js");

import rolesJson from "../../../public/roles/roledata.json";

export default function RoleEmbed(role: string) {
    const roleData = rolesJson[role];
    return new EmbedBuilder()
        .setColor(Number(roleData.color))
        .setTitle(roleData.emoji + " Your role is the **" + role + "**.")
        .setDescription(roleData.description)
        .setFooter({ text: "May the gods be ever in your favor." })
}