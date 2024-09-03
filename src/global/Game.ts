import QueueBuilder from "../utils/backend/game/QueueBuilder";
import RolelistGenerator from "../utils/backend/game/RolelistGenerator";
import ServerRoleHandler from "../utils/backend/server/ServerRoleHandler";
import TownBuilder from "../utils/backend/game/TownBuilder";
import PlayerRoleHandler from "../utils/backend/game/PlayerRoleHandler";

export default class Game {
    static townBuilder: TownBuilder;
    static queueBuilder: QueueBuilder;
    static serverRoleHandler: ServerRoleHandler;
    static rolelistGenerator: RolelistGenerator;
    static playerRoleHandler: PlayerRoleHandler;

    private static rolelist: Array<string>;

    static setRolelist(rolelist: Array<string>) {
        this.rolelist = rolelist;
    }
}