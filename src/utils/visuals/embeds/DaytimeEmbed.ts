const { EmbedBuilder } = require("discord.js");

import messages from "../../../../public/embeds/messages.json"

export default function DaytimeEmbed(num: number) {
    const daytime = messages.daytime;
    const title = ":sunny: **DAY " + num + "** :sunny:";

    let description = "";
    for (let i = 0; i < daytime.content.length; i++) {
        description += daytime.content[i];
    }

    return new EmbedBuilder()
        .setColor(Number(daytime.color))
        .setTitle(title)
        .setDescription(description)
}