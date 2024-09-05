import Game from "../../../global/Game";
import ResponseEmbed from "../../visuals/embeds/ResponseEmbed";

export default class Responses {
    constructor() {};

    getResponse(role: string, actionItemOne?: number, actionItemTwo?: number) {
        if (role === "Mafioso") {
            const player = Game.playerRoleHandler.numberRoleMap.get(actionItemOne);
            return {
                embeds: [ ResponseEmbed("mafia_too_strong") ]
            }
        } else if (role === "Sheriff") {
            const player = Game.playerRoleHandler.numberRoleMap.get(actionItemOne);
            const innocentRoles: Array<string> = [ "Godfather", "Arsonist", "Werewolf", "Juggernaut" ];
            
            if (player.faction === "Town" || 
               (player.faction === "Neutral" && player.name !== "Serial Killer") ||
               innocentRoles.indexOf(player.name) !== -1 ||
               player.hasNecronomicon == true
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
}