import Game from "../../../../global/Game";
import ResponseEmbed from "../../../visuals/embeds/ResponseEmbed";
import Player from "../Player";

export default class Sheriff extends Player {
    response() {
        const target = Game.playerRoleHandler.numberRoleMap.get(super.getActionResults()[0]);
        const innocentRoles: Array<string> = [ "Godfather", "Arsonist", "Werewolf", "Juggernaut" ];
        
        if (target.faction === "Town" || 
            (target.faction === "Neutral" && target.name !== "Serial Killer") ||
            innocentRoles.indexOf(target.name) !== -1 ||
            target.hasNecronomicon == true
        ) {
            return {
                embeds: [ ResponseEmbed("sheriff_innocent") ]
            }
        } else {
            return {
                embeds: [ ResponseEmbed("sheriff_guilty") ]
            }
        }
    }
}