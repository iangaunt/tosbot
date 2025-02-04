const { EmbedBuilder } = require("discord.js");

import messages from "../../../../public/embeds/messages.json"
import responses from "../../../../public/embeds/responses.json"

export function BasicEmbed(type: string) {
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

export function DaytimeEmbed(num: number) {
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

export function DeathEmbed(killReason: string) {
    const messageContent = {
        "mafia": {
            color: 0xDD0000,
            description: "They were killed by a member of the Mafia."
        }
    }

    return new EmbedBuilder()
        .setColor(messageContent[killReason].color)
        .setDescription(`**${messageContent[killReason].description}**`);
}

export function NighttimeEmbed(num: number, fullMoon: boolean) {
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

export function ResponseEmbed(type: string) {
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