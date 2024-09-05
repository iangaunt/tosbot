import { ActionRowBuilder, BaseMessageOptions, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

import Game from "../../../global/Game";
import ActionEmbed from "../embeds/ActionEmbed";

export default class ActionController {
    buttons: Array<ButtonBuilder>;
    constructor() {};

    create(role: string, allowed: number[]) {
        this.buttons = [];

        const prh = Game.playerRoleHandler;
        const numberPlayerMap = prh.numberPlayerMap;
    
        const rows = [
            new ActionRowBuilder(),
            new ActionRowBuilder(),
            new ActionRowBuilder()
        ];
        let currentRow = 0;
    
        for (let i = 1; i <= Game.queueBuilder.players; i++) {
            if (i == 6 || i == 11) currentRow++;
    
            let name = numberPlayerMap.get(i).displayName;
            name = name.substring(name.indexOf("- ") + 1, name.length);
            
            if (name.length > 8) name = name.substring(0, 8) + "...";
    
            const button = new ButtonBuilder()
                .setCustomId(i.toString())
                .setStyle(ButtonStyle.Primary)
                .setLabel(`[${i}] ${name}`)
    
            if (allowed.indexOf(i) == -1) button.setDisabled(true).setStyle(ButtonStyle.Secondary);
    
            rows[currentRow].addComponents(button);
            this.buttons.push(button);
        }
    
        const components = [];
        for (let i = 0; i <= currentRow; i++) {
            components.push(rows[i]);
        }
    
        const base = <BaseMessageOptions> {
            components: components,
            embeds: [ ActionEmbed(role) ]
        }
        return base;
    }

    updateComponents(selected: number, style: ButtonStyle) {
        const rows = [
            new ActionRowBuilder(),
            new ActionRowBuilder(),
            new ActionRowBuilder()
        ];
        let currentRow = 0;

        let newButtons: Array<ButtonBuilder> = [];
        
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

        const components = [];
        for (let i = 0; i <= currentRow; i++) {
            components.push(rows[i]);
        }

        return components;
    }

    highlightComponent(selected: number) {
        const row = new ActionRowBuilder();
        
        for (let i = 1; i <= this.buttons.length; i++) {
            if (i == selected) {
                const button = this.buttons[i];
                button.setDisabled(true);
                row.addComponents(this.buttons[i]);
            }
        }

        return [ row ];
    }

    highlightComponents(selected: number) {

    }
}