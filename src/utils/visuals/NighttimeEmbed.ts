const { EmbedBuilder } = require("discord.js");

import messages from "../../../public/embeds/messages.json"

export default function DaytimeEmbed(num: number, fullMoon: boolean) {
    const nighttime = messages.nighttime;
    const emoji = fullMoon ? "full_moon" : "crescent_moon";
    const title = ":" + emoji + ": **NIGHT " + num + "** :" + emoji + ":";

    let description = "";
    for (let i = 0; i < nighttime.content.length; i++) {
        if (fullMoon && i == 1) description += "***It is a full moon tonight! Certain people have special abilities.*** \n \n";
        description += nighttime.content[i];
    }
    

    return new EmbedBuilder()
        .setColor(Number(nighttime.color))
        .setTitle(title)
        .setDescription(description)
}