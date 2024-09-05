import { EmbedBuilder } from "discord.js";

import actions from "../../../../public/embeds/actions.json"

export default function ActionEmbed(role: string) {
    const data = actions[role];

    let description = "";
    for (let i = 0; i < data.description.length; i++) {
        description += data.description[i];
    }

    return new EmbedBuilder()
        .setColor(Number(data.color))
        .setTitle(data.emoji + " " + data.title)
        .setDescription(description);
}