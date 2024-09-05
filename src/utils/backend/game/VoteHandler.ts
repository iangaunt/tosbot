import { ActionRowBuilder, BaseMessageOptions, ButtonBuilder, ButtonStyle, TextChannel } from "discord.js";
import Game from "../../../global/Game";
import VotingEmbed from "../../visuals/embeds/VotingEmbed";
import VotingController from "../../visuals/controllers/VotingController";

export default class VoteHandler {
    async create(accused: string) {
        const podiumId = Game.townBuilder.createdChannels.get("podium");
        const podium: TextChannel = <TextChannel> Game.guild.channels.cache.get(podiumId);

        const base = VotingController(accused);
        const votingPoll = podium.send(base);
    }
}