import Game from "../../../global/Game";
import ResponseEmbed from "../../visuals/embeds/ResponseEmbed";
import Player from "../classes/Player";

export default class Responses {
    constructor() {};

    getResponse(player: Player, actionItemOne?: number, actionItemTwo?: number) {
        if (actionItemOne == 0 || actionItemTwo == 0) return;
        const role = player.name;

        if (role === "Doctor") {
            const target = Game.playerRoleHandler.numberRoleMap.get(actionItemOne);
            target.defense = Math.max(2, target.defense);
            target.healed = true;
            target.poisoned = false;
        }

        if (role === "Investigator") {
            const target = Game.playerRoleHandler.numberRoleMap.get(actionItemOne);
            const investStrings = [
                "investigator_bodyguard_godfather_arsonist_crusader",
                "investigator_framer_vampire_jester_hexmaster",
                "investigator_vigilante_veteran_mafioso_pirate_ambusher",
                "investigator_medium_janitor_retributionist_necromancer_trapper",
                "investigator_survivor_vampirehunter_amnesiac_medusa_psychic",
                "investigator_spy_blackmailer_jailor_guardianangel",
                "investigator_sheriff_executioner_werewolf_poisoner",
                "investigator_lookout_forger_juggernaut_covenleader",
                "investigator_escort_transporter_consort_hypnotist",
                "investigator_doctor_disguiser_serialkiller_potionmaster",
                "investigator_investigator_consigliere_mayor_tracker_plaguebearer",
                "investigator_pestilence"
            ]

            if (target.framed) return {
                embeds: [ ResponseEmbed("investigator_framer_vampire_jester_hexmaster") ]
            }

            if (target.doused) return {
                embeds: [ ResponseEmbed("investigator_bodyguard_godfather_arsonist_crusader") ]
            }
            
            const split = target.name.split(" ");
            let locator = "";
            for (let i = 0; i < split.length; i++) {
                locator += split[i].toLowerCase();
            }

            for (let i = 0; i < investStrings.length; i++) {
                const str = investStrings[i];
                if (str.indexOf(locator) > -1) return {
                    embeds: [ ResponseEmbed(str) ]
                }
            }

            return;
        }
        
        if (role === "Mafioso") {
            const target = Game.playerRoleHandler.numberRoleMap.get(actionItemOne);

            if (player.attackOn(target)) {
                target.die("mafia");
                return;
            } else {
                return {
                    embeds: [ ResponseEmbed("mafia_too_strong") ]
                }
            }
        }

        if (role === "Sheriff") {
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