import Game from "../../../global/Game";
import ResponseEmbed from "../../visuals/embeds/ResponseEmbed";
import Player from "../classes/Player";

export default class Responses {
    constructor() {};

    getResponse(player: Player, actionItemOne?: number, actionItemTwo?: number) {
        if (actionItemOne == 0 || actionItemTwo == 0) return;
        
        const role = player.name;

        if (role === "Mafioso") {
            const target = Game.playerRoleHandler.numberRoleMap.get(actionItemOne);

            if (player.attackOn(target)) {
                target.die("mafia");
            } else {
                return {
                    embeds: [ ResponseEmbed("mafia_too_strong") ]
                }
            }
        } else if (role === "Sheriff") {
            const target = Game.playerRoleHandler.numberRoleMap.get(actionItemOne);
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
}