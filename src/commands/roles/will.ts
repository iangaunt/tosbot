import { EmbedBuilder } from "@discordjs/builders";

const { SlashCommandBuilder } = require("discord.js")

const willMap = new Map<string, string>();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("will")
        .setDescription("Updates your will.")
        .addStringOption(option => option.setName("update")
            .setDescription("If you want to update your will, then add your new will here.")
        )
        .addBooleanOption(option => option.setName("showtext")
            .setDescription("The bot will reply with your will in rich text formatting so you may edit it.")
        ),

    async execute(interaction) {
        const update = interaction.options.getString("update") ?? "nochange";
        const showtext = interaction.options.getBoolean("showtext") ?? false;

        if (!willMap.has(interaction.user.id)) {
            willMap.set(interaction.user.id, "No last will. \n \n **Update the will with the `/will` command using the `showtext` and `update` options.**");
        }

        const string = willMap.get(interaction.user.id);
        const split = string.split("\n");

        if (showtext) {
            let rebuilt = "`";
            for (let i = 0; i < split.length; i++) {
                rebuilt += split[i] + "\\n \n";
            }
            rebuilt += "`";

            await interaction.reply(rebuilt);
            return;
        }

        if (update !== "nochange") {
            willMap.set(interaction.user.id, update);
            await interaction.reply({ content: "Your last will has been updated.", ephemeral: true});
            return;
        } else {
            let rebuilt = "";
            for (let i = 0; i < split.length; i++) {
                rebuilt += split[i] + "\n";
            }

            await interaction.reply({ embeds: [
                new EmbedBuilder()
                    .setColor(0xBDA27D)
                    .setTitle(`${interaction.user.displayName.toUpperCase()}'S WILL`)
                    .setDescription(rebuilt)
            ]});
            return;
        }
    }
}
