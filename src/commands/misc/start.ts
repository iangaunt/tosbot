const { SlashCommandBuilder } = require("discord.js")
import { BaseMessageOptions, Client, GatewayIntentBits, Guild, PermissionsBitField, Role, TextChannel } from "discord.js";

import Game from "../../global/Game";
import QueueBuilder from "../../utils/backend/game/QueueBuilder";
import ServerRoleHandler from "../../utils/backend/server/ServerRoleHandler";
import RolelistGenerator from "../../utils/backend/game/RolelistGenerator";
import TownBuilder from "../../utils/backend/game/TownBuilder";
import Player from "../../utils/backend/classes/Player";

import rolelists from "../../../public/roles/rolelists.json"
import ActionResponses from "../../utils/backend/data/ActionResponses";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Creates a new town."),

    async execute(interaction) {
        const guild: Guild = interaction.guild;
        
        if (Game.townBuilder == null) {
            guild.roles.cache.get("1279908685065359403").setPosition(1000);
            
            const g = Game;
            g.guild = guild;

            g.serverRoleHandler = new ServerRoleHandler(guild);
            g.serverRoleHandler.createRoles();

            const srh = g.serverRoleHandler;

            g.rolelistGenerator = new RolelistGenerator();

            const rg = g.rolelistGenerator;

            g.setRolelist(rg.generateRoleList(rolelists.basic));

            g.townBuilder = new TownBuilder(guild); 
            g.townBuilder.create();

            const tb = g.townBuilder;

            g.queueBuilder = new QueueBuilder(guild);

            const qb = g.queueBuilder;

            qb.setRolelist(g.getRolelist());
            await qb.create(interaction);

            await new Promise(f => setTimeout(f, (Game.queueLength + 1) * 1000 ));

            g.playerRoleHandler = qb.playerRoleHandler;
            g.playerRoleHandler.sendRoleMessages();

            const prh = g.playerRoleHandler;

            g.responses = new ActionResponses();
            const r = g.responses;

            await new Promise(f => setTimeout(f, Game.setupLength * 1000));

            for (let i = 1; i <= 3; i++) {
                tb.openChannel(
                    srh.roles.get("alive"),
                    tb.createdChannels.get("town-square")
                );
                if (i != 1) tb.sendEndingMessage("night");
                await new Promise(f => setTimeout(f, 1000));
                tb.sendTimeMessage("day", i);

                await new Promise(f => setTimeout(f, Game.dayLength * 1000));

                tb.closeChannel(
                    srh.roles.get("alive"),
                    tb.createdChannels.get("town-square")
                );
                tb.sendEndingMessage("day");
                await new Promise(f => setTimeout(f, 1000 ));
                tb.sendTimeMessage("night", i);

                await new Promise(f => setTimeout(f, 1000));

                const actionResponses = new Map<number, Array<number>>();

                for (let i = 0; i < prh.roles.length; i++) {
                    const role: Player = prh.roles[i];
                    if (role.alive) role.action();
                }

                await new Promise(f => setTimeout(f, Game.nightLength * 1000));
                
                for (let i = 0; i < prh.roles.length; i++) {
                    actionResponses.set(prh.roles[i].number, prh.roles[i].getActionResults());
                }

                const interactionNumbers = Array.from(actionResponses.keys());
                for (let i = 0; i < interactionNumbers.length; i++) {
                    const player = g.playerRoleHandler.numberRoleMap.get(interactionNumbers[i]);
                    const actionItems = actionResponses.get(player.number);

                    let response: BaseMessageOptions;
                    if (player.takesInMultipleActionPlayers) {
                        response = r.getResponse(player.name, actionItems[0], actionItems[1]);
                    } else {
                        response = r.getResponse(player.name, actionItems[0]);
                    }

                    const channel: TextChannel = <TextChannel> g.guild.channels.cache.get(player.houseChannelId);
                    channel.send(response);
                }
            }
        } else {
            await interaction.reply("A town is currently in play / in the server. If you are done, consider `/clear`ing it!");
        }
    }
}
