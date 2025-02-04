import Game from "../../../../global/Game";
import ResponseEmbed from "../../../visuals/embeds/ResponseEmbed";
import Player from "../Player";

export default class Mafioso extends Player {
    response() {
        const target = Game.playerRoleHandler.numberRoleMap.get(super.getActionResults()[0]);

        if (super.attackOn(target)) {
            target.die("mafia");
            return;
        } else {
            return {
                embeds: [ ResponseEmbed("mafia_too_strong") ]
            }
        }
    }
}