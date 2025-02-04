import { ActionRowBuilder, BaseMessageOptions, ButtonBuilder, ButtonStyle } from "discord.js";
import VotingEmbed from "../embeds/VotingEmbed";

export default function VotingController(accused: string) {
    // Adds the guilty, abstain, and innocent buttons.
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

    return base;
}