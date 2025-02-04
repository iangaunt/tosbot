import { Channel, Client, Guild, GuildMember, TextChannel } from "discord.js";
import Player from "../classes/Player";

import Game from "../../../global/Game";
import RoleEmbed from "../../visuals/embeds/RoleEmbed";
import { BasicEmbed } from "../../visuals/embeds/Embeds";

export default class PlayerRoleHandler {
    guild: Guild;

    players: Array<GuildMember>;
    roles: Array<Player>;
    rolelist: Array<string>;

    numberIdMap: Map<number, string>;
    idPlayerMap: Map<string, GuildMember>;
    playerRoleMap: Map<GuildMember, Player>;
    numberPlayerMap: Map<number, GuildMember>;
    numberRoleMap: Map<number, Player>;

    constructor(guild: Guild, players: Array<GuildMember>, rolelist: Array<string>) {
        this.guild = guild;
        this.roles = [];
        
        this.numberIdMap = new Map<number, string>();
        this.idPlayerMap = new Map<string, GuildMember>();
        this.playerRoleMap = new Map<GuildMember, Player>();

        this.numberPlayerMap = new Map<number, GuildMember>();
        this.numberRoleMap = new Map<number, Player>();

        this.players = players;
        for (let i = 0; i < players.length; i++) {
            const role = rolelist[i];
            const playerRole = new Player(role, players[i].id, i + 1, false);
            this.roles.push(playerRole);

            this.numberIdMap.set(i + 1, players[i].id);
            this.idPlayerMap.set(players[i].id, players[i]);
            this.playerRoleMap.set(players[i], playerRole);

            this.numberPlayerMap.set(i + 1, players[i]);
            this.numberRoleMap.set(i + 1, playerRole);
        }
    }

    sendRoleMessages() {
        const createdChannels = Game.townBuilder.createdChannels;
        
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];

            const role = this.playerRoleMap.get(player);
            const channelId = createdChannels.get("house-" + (i + 1));

            const channel: TextChannel = <TextChannel> Game.client.channels.cache.get(channelId);
            channel.permissionOverwrites.edit(player.id, { ViewChannel: true, SendMessages: true });
            channel.permissionOverwrites.edit(this.guild.id, { ViewChannel: false, SendMessages: false });

            channel.send({
                content: "> <@" + player.id + ">",
                embeds: [
                    RoleEmbed(role.name),
                    BasicEmbed("game_starting_soon")
                ]
            })
        }
    }
}