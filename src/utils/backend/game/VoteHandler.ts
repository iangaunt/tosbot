import { ActionRowBuilder, BaseMessageOptions, ButtonBuilder, ButtonStyle, TextChannel } from "discord.js";
import Game from "../../../global/Game";
import VotingEmbed from "../../visuals/VotingEmbed";

export default class VoteHandler {
    async create(accused: string) {
        accused = "614954208139149319";
        const podiumId = "1279805979839434828"; // Game.townBuilder.createdChannels.get("podium");
        const podium: TextChannel = <TextChannel> Game.guild.channels.cache.get(podiumId);

        const guilty = new ButtonBuilder()
                .setCustomId("guilty")
                .setLabel("Guilty")
                .setStyle(ButtonStyle.Danger)

        const abstain = new ButtonBuilder()
            .setCustomId("abstain")
            .setLabel("Abstain")
            .setStyle(ButtonStyle.Secondary)

        const innocent = new ButtonBuilder()
            .setCustomId("innocent")
            .setLabel("Innocent")
            .setStyle(ButtonStyle.Success)

        const row = new ActionRowBuilder().addComponents(guilty, abstain, innocent);
        const base = <BaseMessageOptions> {
            components: [ row ],
            embeds: [ VotingEmbed(accused) ]
        }

        const votingPoll = podium.send(base);
    }
}