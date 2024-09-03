import { Guild, GuildMember } from "discord.js";
import PlayerRole from "../classes/PlayerRole";

export default class PlayerRoleHandler {
    guild: Guild;

    static players: Array<GuildMember>;
    static rolelist: Array<string>;

    static idPlayerMap: Map<string, GuildMember>;
    static playerRoleMap: Map<GuildMember, PlayerRole>;

    constructor(guild: Guild, players: Array<GuildMember>, rolelist: Array<string>) {
        this.guild = guild;
        PlayerRoleHandler.idPlayerMap = new Map<string, GuildMember>();
        PlayerRoleHandler.playerRoleMap = new Map<GuildMember, PlayerRole>();

        PlayerRoleHandler.players = players;
        for (let i = 0; i < players.length; i++) {
            const role = rolelist[i];
            const playerRole = new PlayerRole(role);

            PlayerRoleHandler.idPlayerMap.set(players[i].id, players[i]);
            PlayerRoleHandler.playerRoleMap.set(players[i], playerRole);
        }
    }
}