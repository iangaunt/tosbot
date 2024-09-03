import { Guild, GuildMember } from "discord.js";
import PlayerRole from "../classes/PlayerRole";
import Game from "../../../global/Game";

export default class PlayerRoleHandler {
    guild: Guild;

    players: Array<GuildMember>;
    rolelist: Array<string>;

    idPlayerMap: Map<string, GuildMember>;
    playerRoleMap: Map<GuildMember, PlayerRole>;

    constructor(guild: Guild, players: Array<GuildMember>, rolelist: Array<string>) {
        this.guild = guild;
        this.idPlayerMap = new Map<string, GuildMember>();
        this.playerRoleMap = new Map<GuildMember, PlayerRole>();

        this.players = players;
        for (let i = 0; i < players.length; i++) {
            const role = rolelist[i];
            const playerRole = new PlayerRole(role);

            this.idPlayerMap.set(players[i].id, players[i]);
            this.playerRoleMap.set(players[i], playerRole);
        }
    }

    sendRoleMessages() {
        const createdChannels = Game.townBuilder.createdChannels;
        
        for (let i = 0; i < this.players.length; i++) {
            const role = this.playerRoleMap.get(this.players[i]);
        }
    }
}