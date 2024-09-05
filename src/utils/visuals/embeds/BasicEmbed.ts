import { EmbedBuilder } from "discord.js";

import messages from "../../../../public/embeds/messages.json"

export default function BasicEmbed(type: string) {
    const embed = messages[type];

    let description = "";
    for (let i = 0; i < embed.content.length; i++) {
        description += embed.content[i];
    }

    const builder = new EmbedBuilder()
        .setColor(Number(embed.color))
        .setDescription(description);

    if (embed.title != null) {
        builder.setTitle(embed.title);
    }

    return builder;
}