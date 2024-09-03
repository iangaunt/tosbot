const { EmbedBuilder } = require("discord.js");

import roledata from "../../../public/roles/roledata.json";

export default function RoleEmbed(role: string) {
    const selectedRole = roledata[role];

    let name = selectedRole.emoji + " Your role is the **" + role + "**.";
    if (role === "Medusa") {
        name = selectedRole.emoji + " Your role is **" + role + "**.";
    } else if (role === "Pestilence") {
        name = selectedRole.emoji + " You are **" + role + ", Horseman of the Apocalypse**.";
    }

    let description = "";
    for (let i = 0; i < selectedRole.description.length; i++) {
        description += selectedRole.description[i];
    }

    return new EmbedBuilder()
        .setColor(Number(selectedRole.color))
        .setTitle(name)
        .setDescription(description)
        .setFooter({ text: "May the gods be ever in your favor." })
}