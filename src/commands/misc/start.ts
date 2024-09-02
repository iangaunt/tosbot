const { SlashCommandBuilder } = require("discord.js")
import { Guild, Role } from "discord.js";

import QueueBuilder from "../../utils/backend/QueueBuilder";
import StatusHandler from "../../utils/backend/StatusHandler";
import TownBuilder from "../../utils/backend/TownBuilder";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Creates a new town."),

    async execute(interaction) {
        const guild: Guild = interaction.guild;
        
        if (TownBuilder.currentTown == null) {
            const town = new TownBuilder(guild); 
            const t = town.create();

            const queue = new QueueBuilder(guild);
            queue.create(interaction);

            const status = new StatusHandler(guild);
        } else {
            await interaction.reply("A town is currently in play / in the server. If you are done, consider `/clear`ing it!");
        }
    }
}
