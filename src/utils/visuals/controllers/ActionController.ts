import { ActionRowBuilder, BaseMessageOptions, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

import Game from "../../../global/Game";
import ActionEmbed from "../embeds/ActionEmbed";

/**
 * An action controller for handling the input from the user.
 * Used to figure out where each player goes and who they apply
 * their abilities on.
 */
export default class ActionController {
    buttons: Array<ButtonBuilder>;
    constructor() {};

    /**
     * Creates three rows of fifteen buttons with the names of all
     * the available players, and returns a hook to the button builder.
     * 
     * @param role The role of the player.
     * @param allowed The buttons which the players are able to click.
     * @returns The completed embed hook.
     */
    create(role: string, allowed: number[]) {
        this.buttons = [];

        const prh = Game.playerRoleHandler;
        const numberPlayerMap = prh.numberPlayerMap;
    
        // Creates three rows of buttons.
        const rows = [
            new ActionRowBuilder(),
            new ActionRowBuilder(),
            new ActionRowBuilder()
        ];
        let currentRow = 0;
    
        for (let i = 1; i <= Game.queueBuilder.players; i++) {
            if (i == 6 || i == 11) currentRow++;
    
            // Builds a new button with the name and number of the player.
            let name = numberPlayerMap.get(i).displayName;
            name = name.substring(name.indexOf("- ") + 1, name.length);
            
            if (name.length > 8) name = name.substring(0, 8) + "...";
    
            // Creates a new button with the truncated name.
            const button = new ButtonBuilder()
                .setCustomId(i.toString())
                .setStyle(ButtonStyle.Primary)
                .setLabel(`[${i}] ${name}`)
    
            // If the player is not in the allowed array, then disable their button.
            if (allowed.indexOf(i) == -1) button.setDisabled(true).setStyle(ButtonStyle.Secondary);
    
            // Add the button to the current row.
            rows[currentRow].addComponents(button);
            this.buttons.push(button);
        }
    
        // Moves the ActionRowControllers into a new array (this has to be done for some reason)
        const components = [];
        for (let i = 0; i <= currentRow; i++) { components.push(rows[i]); }
    
        // Constructs the embed and returns the built hook.
        const base = <BaseMessageOptions> {
            components: components,
            embeds: [ ActionEmbed(role) ]
        }
        return base;
    }

    /**
     * Updates the list of buttons depending on which player is selected.
     * 
     * @param selected The player who has been selected / clicked on in the menu.
     * @param style The style of the button.
     * @returns The completed embed hook. 
     */
    updateComponents(selected: number, style: ButtonStyle) {
        // Creates three rows of buttons.
        const rows = [
            new ActionRowBuilder(),
            new ActionRowBuilder(),
            new ActionRowBuilder()
        ];
        let currentRow = 0;

        let newButtons: Array<ButtonBuilder> = [];
        
        // Edits the contents of the buttons if they have been selected / de-selected.
        for (let i = 1; i <= this.buttons.length; i++) {
            if (i == 6 || i == 11) currentRow++;

            const button = this.buttons[i - 1];
            if (button.data.style == style) button.setStyle(ButtonStyle.Primary);

            if (selected == i) {
                button.setStyle(style);
            }

            rows[currentRow].addComponents(button);
            newButtons.push(button);
        }

        // Constructs the embed and returns the built hook.
        const components = [];
        for (let i = 0; i <= currentRow; i++) { components.push(rows[i]); }

        return components;
    }

    /**
     * Highlights a specific button from a certain row, and disables
     * all of the buttons.
     * 
     * @param selected The selected button [1-indexed].
     * @returns The updated action item row.
     */
    highlightComponent(selected: number) {
        const row = new ActionRowBuilder();
        
        for (let i = 1; i <= this.buttons.length; i++) {
            if (i == selected) {
                const button = this.buttons[i - 1];
                button.setDisabled(true);
                row.addComponents(button);
            }
        }

        return [ row ];
    }
}