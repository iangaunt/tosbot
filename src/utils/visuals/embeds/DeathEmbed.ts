import { EmbedBuilder } from "discord.js"

export default function DeathEmbed(killReason: string) {
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