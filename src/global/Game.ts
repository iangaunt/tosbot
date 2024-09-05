import QueueBuilder from "../utils/backend/game/QueueBuilder";
import RolelistGenerator from "../utils/backend/game/RolelistGenerator";
import ServerRoleHandler from "../utils/backend/server/ServerRoleHandler";
import TownBuilder from "../utils/backend/game/TownBuilder";
import PlayerRoleHandler from "../utils/backend/game/PlayerRoleHandler";

import { Client, Guild } from "discord.js";
import ActionResponses from "../utils/backend/data/ActionResponses";

export default class Game {
    static client: Client;
    static guild: Guild;

    static townBuilder: TownBuilder = null;
    static queueBuilder: QueueBuilder;
    static serverRoleHandler: ServerRoleHandler;
    static rolelistGenerator: RolelistGenerator;
    static playerRoleHandler: PlayerRoleHandler;
    static responses: ActionResponses;

    private static rolelist: Array<string>;

    /* All the values here are in seconds. */
    static queueLength: number = 10; // The length of the starting queue.
    static setupLength: number = 15; // The amount of seconds before the day begins.

    static dayLength: number = 15; // The number of seconds in the day before the voting period.
    static votingLength: number = 10; // The number of seconds in the voting period (not counting actual polls).
    static nightLength: number = 15; // The number of seconds in the night.

    /**
     * Fetches the current rolelist for the game (should be in the order of the players).
     * @returns - The rolelist for the running game.
     */
    static getRolelist(): Array<string> {
        return this.rolelist;
    }

    /**
     * Sets the rolelist for the game.
     * @param rolelist - The new rolelist.
     */
    static setRolelist(rolelist: Array<string>) {
        this.rolelist = rolelist;
    }
}