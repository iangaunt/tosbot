import { EmbedBuilder, Guild } from "discord.js";

import messages from "../../../public/embeds/messages.json"
import Game from "../../global/Game";

export default function VotingEmbed(accused: string) {
    const member = Game.guild.members.cache.get(accused);

    const embedContent = messages.voting.content;

    let description = "";
    for (let i = 0; i < embedContent.length; i++) {
        let str = embedContent[i];
        console.log(str + " : " + str.indexOf("XXXXXX"));
        while (str.indexOf("XXXXXX") != -1) str = str.replace("XXXXXX", "<@" + member.id + ">");

        description += str;
    }

    return new EmbedBuilder()
        .setTitle("**JUDGEMENT:** " + member.user.displayName.toUpperCase())
        .setDescription(description)
        .setColor(Number(messages.voting.color))
}