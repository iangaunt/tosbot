const { SlashCommandBuilder } = require("discord.js")
import { Client, GatewayIntentBits, Guild, Role } from "discord.js";

import QueueBuilder from "../../utils/backend/game/QueueBuilder";
import ServerRoleHandler from "../../utils/backend/server/ServerRoleHandler";
import RolelistGenerator from "../../utils/backend/game/RolelistGenerator";
import TownBuilder from "../../utils/backend/game/TownBuilder";

import rolelists from "../../../public/roles/rolelists.json"
import PlayerRoleHandler from "../../utils/backend/game/PlayerRoleHandler";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Creates a new town."),

    async execute(interaction) {
        const guild: Guild = interaction.guild;
        
        if (TownBuilder.currentTown == null) {
            const rolelistGenerator = new RolelistGenerator();
            const rolelist = rolelistGenerator.generateRoleList(rolelists.classic);

            const serverRoles = new ServerRoleHandler(guild);
            ServerRoleHandler.createRoles();
            
            const town = new TownBuilder(guild); 
            town.create();

            const queue = new QueueBuilder(guild);
            queue.setRolelist(rolelist);
            await queue.create(interaction);

            await new Promise(f => setTimeout(f, 3000));

            console.log("queue done");
        } else {
            await interaction.reply("A town is currently in play / in the server. If you are done, consider `/clear`ing it!");
        }
    }
}
