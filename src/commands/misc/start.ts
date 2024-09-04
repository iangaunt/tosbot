const { SlashCommandBuilder } = require("discord.js")
import { Client, GatewayIntentBits, Guild, PermissionsBitField, Role } from "discord.js";

import QueueBuilder from "../../utils/backend/game/QueueBuilder";
import ServerRoleHandler from "../../utils/backend/server/ServerRoleHandler";
import RolelistGenerator from "../../utils/backend/game/RolelistGenerator";
import TownBuilder from "../../utils/backend/game/TownBuilder";

import rolelists from "../../../public/roles/rolelists.json"
import PlayerRoleHandler from "../../utils/backend/game/PlayerRoleHandler";
import Game from "../../global/Game";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Creates a new town."),

    async execute(interaction) {
        const guild: Guild = interaction.guild;
        
        if (Game.townBuilder == null) {
            guild.roles.cache.get("1279908685065359403").setPosition(1000);
            
            const g = Game;

            g.serverRoleHandler = new ServerRoleHandler(guild);
            g.serverRoleHandler.createRoles();

            g.rolelistGenerator = new RolelistGenerator();
            g.setRolelist(g.rolelistGenerator.generateRoleList(rolelists.classic));
            
            g.townBuilder = new TownBuilder(guild); 
            g.townBuilder.create();

            g.queueBuilder = new QueueBuilder(guild);
            g.queueBuilder.setRolelist(rolelists.classic.roles);
            await g.queueBuilder.create(interaction);

            await new Promise(f => setTimeout(f, 4000));

            g.playerRoleHandler = g.queueBuilder.playerRoleHandler;
            g.playerRoleHandler.sendRoleMessages();
        } else {
            await interaction.reply("A town is currently in play / in the server. If you are done, consider `/clear`ing it!");
        }
    }
}
