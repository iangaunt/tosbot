const { SlashCommandBuilder } = require("discord.js")
import { Client, GatewayIntentBits, Guild, Role } from "discord.js";

import QueueBuilder from "../../utils/backend/game/QueueBuilder";
import RoleHandler from "../../utils/backend/server/RoleHandler";
import TownBuilder from "../../utils/backend/game/TownBuilder";
import RolelistGenerator from "../../utils/backend/game/RolelistGenerator";

import all_any from "../../../public/roles/rolelists/all_any.json"
import classic from "../../../public/roles/rolelists/classic.json"
import test from "../../../public/roles/rolelists/test.json"

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Creates a new town."),

    async execute(interaction) {
        const guild: Guild = interaction.guild;
        
        if (TownBuilder.currentTown == null) {
            const roles = new RoleHandler(guild);
            RoleHandler.createRoles();
            
            const town = new TownBuilder(guild); 
            town.create();

            //const queue = new QueueBuilder(guild);
            //queue.create(interaction);

            //const rolelist = new RolelistGenerator();
            //console.log(rolelist.generateRoleList(test));
        } else {
            await interaction.reply("A town is currently in play / in the server. If you are done, consider `/clear`ing it!");
        }
    }
}
