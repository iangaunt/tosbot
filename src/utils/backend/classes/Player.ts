import {
    ButtonInteraction,
    ButtonStyle,
    ComponentType,
    Interaction
} from "discord.js";

import roledata from "../../../../public/embeds/roles.json";

import ActionController from "../../visuals/controllers/ActionController";
import Game from "../../../global/Game";
import ResponseEmbed from "../../visuals/embeds/ResponseEmbed";

import { RoleData } from "./Structures";

/**
 * The default class for handling player logic. Handles the current
 * state of the account, their life and death status, faction,
 * statistics, and internal buffers.
 */
export default class Player {
    // The user ID of the player on Discord.
    userId: string;

    // The name of the player's role. NOT the name of the player.
    name: string;

    // The faction and category of the player (e.g. Town - Killng).
    faction: string;
    category: string;

    // If the player is alive. `true` is the player is still in the game.
    alive: boolean;

    // The reason behind the death of the player. Used for reveals.
    killReason: string;

    // The attack and defense of the player.
    attack: number;
    defense: number;

    // The "true" attack and defense - without any modifications from
    // roles like Doctor or Serial Killer.
    tAttack: number;
    tDefense: number;

    // The number of the player and their house channel ID for messages.
    number: number;
    houseChannelId: string;

    // The players that this role is allowed to modify with their abilities.
    allowedActionPlayers: Array<number> = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    ];

    // Various stats for the player's in-game status.
    hasNecronomicon: boolean = false;

    doused: boolean = false;
    framed: boolean = false;
    healed: boolean = false;
    hexed: boolean = false;
    poisoned: boolean = false;

    // If a role takes in multiple arguments, this is where it will be specified.
    takesInMultipleActionPlayers: boolean;

    // Selected players for actions.
    private actionSelectedFirst: number = 0;
    private actionSelectedSecond: number = 0;

    constructor(
        name: string,
        userId: string,
        number: number,
        takesInMultipleActionPlayers: boolean
    ) {
        this.userId = userId;
        this.name = name;

        const data: RoleData = roledata[name];

        this.category = data.category;
        this.faction = this.category.split(" ")[0];
        this.defense = data.defense;
        this.tDefense = data.defense;
        this.attack = data.attack;
        this.tAttack = data.attack;
        this.alive = true;
        this.takesInMultipleActionPlayers = takesInMultipleActionPlayers;
        this.number = number;
        this.houseChannelId = Game.townBuilder.createdChannels.get(
            "house-" + this.number
        );
    }

    async action() {
        // Reset the selected action players.
        this.actionSelectedFirst = 0;
        this.actionSelectedSecond = 0;

        // Sends a message containing the action component into the house channel.
        const actionController = new ActionController();
        const base = actionController.create(this.name, this.allowedActionPlayers);
        const message = await (<any>(
            Game.getChannel(this.houseChannelId).send(base)
        ));

        // Only collect responses from the player in the channel.
        const collectorFilter = (i) => i.user.id === this.userId;
        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            collectorFilter,
            time: Game.nightLength * 1000,
        });

        // While the collector is running, highlight the selected player in green.
        // This can be changed if the player clicks another button.
        collector.on("collect", async (interaction: Interaction) => {
            let buttonInteraction = <ButtonInteraction>interaction;

            for (let i = 1; i <= Game.queueBuilder.players; i++) {
                if (buttonInteraction.customId === i.toString()) {
                    const selectedPlayer = Game.playerRoleHandler.numberPlayerMap.get(i);
                    this.actionSelectedFirst = i;
                    this.actionSelectedSecond = i;

                    const newComponents = actionController.updateComponents(
                        i,
                        ButtonStyle.Success
                    );
                    message.edit({ components: newComponents });

                    await buttonInteraction.reply({
                        content: `**[ ${i} ] - ${selectedPlayer.user.displayName}** has been selected.`,
                        ephemeral: true,
                    });
                    return;
                }
            }
        });

        // When the collector is over, edit the message to show the collected message.
        collector.on("end", () => {
            if (this.actionSelectedFirst != 0) {
                message.edit({
                    components: actionController.highlightComponent(
                        this.actionSelectedFirst
                    ),
                });
            }
        });
    }

    /**
     * Attempts to attack another player, and returns `true` if the player
     * has a defense lower than the current attack.
     *
     * @param other The other player - attempted victim.
     * @returns If the player has killed the other player.
     */
    attackOn(other: Player) {
        return this.attack > other.defense;
    }

    async die(killReason: string) {
        this.alive = false;
        this.killReason = killReason;

        const user = Game.getUser(this.userId);

        user.roles.remove(Game.getRole("alive"));
        user.roles.add(Game.getRole("dead"));
        user.roles.add(Game.getRole("killed"));

        const houseChannel = Game.getChannel(this.houseChannelId);
        houseChannel.permissionOverwrites.edit(this.userId, {
            SendMessages: false,
        });

        Game.kills.push(this);

        const message = await (<any>houseChannel.send({
            content: `> <@${this.userId}>`,
            embeds: [ResponseEmbed("mafia_attack")],
        }));
    }

    getActionResults(): Array<number> {
        return [this.actionSelectedFirst, this.actionSelectedSecond];
    }
}
