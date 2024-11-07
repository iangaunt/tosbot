const { SlashCommandBuilder } = require("discord.js")
import { BaseMessageOptions, Client, EmbedBuilder, GatewayIntentBits, Guild, PermissionsBitField, Role, TextChannel } from "discord.js";

import Game from "../../global/Game";
import QueueBuilder from "../../utils/backend/game/QueueBuilder";
import ServerRoleHandler from "../../utils/backend/server/ServerRoleHandler";
import RolelistGenerator from "../../utils/backend/game/RolelistGenerator";
import TownBuilder from "../../utils/backend/game/TownBuilder";
import Player from "../../utils/backend/classes/Player";

import rolelists from "../../../public/roles/rolelists.json"
import ActionResponses from "../../utils/backend/data/ActionResponses";
import ResponseEmbed from "../../utils/visuals/embeds/ResponseEmbed";
import DeathEmbed from "../../utils/visuals/embeds/DeathEmbed";

/**
 * Starts a game of Town of Salem by rebuilding all of the properties of
 * the static Game class, and begins to run the game loop after assigning
 * roles and properties to the game.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Creates a new town."),

    async execute(interaction) {
        const guild: Guild = interaction.guild;
        
        // Games cannot start if there is an active town.
        if (Game.townBuilder == null) {
            const g = Game;
            g.guild = guild;

            // Creates a new ServerRoleHandler to make server roles.
            g.serverRoleHandler = new ServerRoleHandler(guild);
            g.serverRoleHandler.createRoles();

            const srh = g.serverRoleHandler;

            // Creates a new RolelistGenerator to build a new rolelist.
            g.rolelistGenerator = new RolelistGenerator();

            const rg = g.rolelistGenerator;

            // Passes the rolelist to the Game class.
            g.setRolelist(rg.generateRoleList(rolelists.basic));

            // Creates a new TownBuilder to handle making server channels.
            g.townBuilder = new TownBuilder(guild); 
            g.townBuilder.create();

            const tb = g.townBuilder;

            // Creates a new QueueBuilder to gauge interest and collect users.
            g.queueBuilder = new QueueBuilder(guild);

            const qb = g.queueBuilder;

            // Passes in the rolelist to the queue and begins the queuing period.
            qb.setRolelist(g.getRolelist());
            await qb.create(interaction);

            // Waits until the queue is finished.
            await new Promise(f => setTimeout(f, (Game.queueLength + 1) * 1000 ));

            // Once all of the players have been accounted for, roles are assigned
            // and players are sent their roles.
            g.playerRoleHandler = qb.playerRoleHandler;
            g.playerRoleHandler.sendRoleMessages();

            const prh = g.playerRoleHandler;

            // Creates a new ActionResponses class to handle game messages.
            g.responses = new ActionResponses();
            const r = g.responses;

            // Pauses until the setup time is completed.
            await new Promise(f => setTimeout(f, Game.setupLength * 1000));

            // Game loop. Continues to run until the game is won or a draw.
            for (let i = 1; i <= 3; i++) {
                // Besides the first day, send the night to day messages.
                if (i != 1) tb.sendEndingMessage("night");
                await new Promise(f => setTimeout(f, 1000));
                tb.sendTimeMessage("day", i);

                // For every player who died, send a death message.
                for (let i = 0; i < Game.kills.length; i++) {
                    const player: Player = Game.kills[i];
                    tb.sendMessage({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0x7D0707)
                                .setDescription(`<@${player.userId}> was killed last night.`)
                        ]
                    })

                    await new Promise(f => setTimeout(f, 1000));

                    // Builds a new DeathEmbed.
                    tb.sendMessage({
                        embeds: [
                            DeathEmbed(player.killReason)
                        ]
                    })

                    await new Promise(f => setTimeout(f, 3000));
                }

                // Opens the town-square channel for discussion.
                tb.openChannel(
                    srh.roles.get("alive"),
                    tb.createdChannels.get("town-square")
                );

                await new Promise(f => setTimeout(f, Game.dayLength * 1000));

                // Closes the town-square channel for alive players, and sends the day to night messages.
                tb.closeChannel(
                    srh.roles.get("alive"),
                    tb.createdChannels.get("town-square")
                );
                tb.sendEndingMessage("day");
                await new Promise(f => setTimeout(f, 1000 ));
                tb.sendTimeMessage("night", i);

                await new Promise(f => setTimeout(f, 1000));

                // Sends all players their appropriate nighttime action response.
                const actionResponses = new Map<number, Array<number>>();

                for (let i = 0; i < prh.roles.length; i++) {
                    const role: Player = prh.roles[i];
                    if (role.alive) role.action();
                }

                await new Promise(f => setTimeout(f, Game.nightLength * 1000));
                
                // Fetches the action results from each player.
                for (let i = 0; i < prh.roles.length; i++) {
                    actionResponses.set(prh.roles[i].number, prh.roles[i].getActionResults());
                }

                // Gets all of the players who had action responses and loops through their results.
                const interactionNumbers = Array.from(actionResponses.keys());
                for (let i = 0; i < interactionNumbers.length; i++) {
                    // Fetches the player and the action response.
                    const player = g.playerRoleHandler.numberRoleMap.get(interactionNumbers[i]);
                    const actionItems = actionResponses.get(player.number);

                    const channel: TextChannel = <TextChannel> g.guild.channels.cache.get(player.houseChannelId);

                    // If no action items were given, the player stayed at home.
                    if (actionItems[0] == 0 || actionItems[1] == 0) {
                        if (player.alive) channel.send({
                            embeds: [ ResponseEmbed("home") ]
                        })
                    }

                    // If the player has action items, then send them their appropriate information.
                    let response: BaseMessageOptions;
                    if (player.takesInMultipleActionPlayers) {
                        response = r.getResponse(player, actionItems[0], actionItems[1]);
                    } else {
                        response = r.getResponse(player, actionItems[0]);
                    }

                    channel.send(response);
                }
            }
        } else {
            // Tells the player that they cannot start a town without clearing.
            await interaction.reply("A town is currently in play / in the server. If you are done, consider `/clear`ing it!");
        }
    }
}
