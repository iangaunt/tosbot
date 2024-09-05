import { EmbedBuilder } from "discord.js";

import responses from "../../../../public/embeds/responses.json"

export default function ResponseEmbed(type: string) {
    const embed = responses[type];

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