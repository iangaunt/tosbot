import { ButtonInteraction, ButtonStyle, ComponentType, Interaction, TextChannel } from "discord.js";
import roledata from "../../../../public/embeds/roles.json"
import Game from "../../../global/Game";
import ActionController from "../../visuals/controllers/ActionController";
import { RoleData } from "./Structures";

export default class Player {
    userId: string;

    name: string;
    faction: string;
    category: string;
    alive: boolean;

    number: number;
    houseChannelId: string;

    allowedActionPlayers: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    hasNecronomicon: boolean = false;
    takesInMultipleActionPlayers: boolean;

    private actionSelectedFirst: number = 0;
    private actionSelectedSecond: number = 0; 

    constructor(name: string, userId: string, number: number, takesInMultipleActionPlayers: boolean) {
        this.userId = userId;

        this.name = name;
        const data: RoleData = roledata[name];
        
        this.category = data.category;
        this.faction = this.category.split(" ")[0];

        this.alive = true;
        this.takesInMultipleActionPlayers = takesInMultipleActionPlayers;

        this.number = number;
        this.houseChannelId = Game.townBuilder.createdChannels.get("house-" + this.number);
    }

    async action() {
        this.actionSelectedFirst = 0;
        this.actionSelectedSecond = 0;

        const actionController = new ActionController();
        const base = actionController.create(this.name, this.allowedActionPlayers);
        const message = await <any> (<TextChannel> Game.guild.channels.cache.get(this.houseChannelId)).send(base);

        const collectorFilter = i => i.user.id === this.userId;
        const collector = message.createMessageComponentCollector({ 
            componentType: ComponentType.Button,
            collectorFilter, 
            time: Game.nightLength * 1000 
        })

        collector.on("collect", async (interaction: Interaction) => {
            let buttonInteraction = <ButtonInteraction> interaction;
            
            for (let i = 1; i <= Game.queueBuilder.players; i++) {
                if (buttonInteraction.customId === i.toString()) {
                    const selectedPlayer = Game.playerRoleHandler.numberPlayerMap.get(i);
                    this.actionSelectedFirst = i;
                    this.actionSelectedSecond = i;

                    const newComponents = actionController.updateComponents(i, ButtonStyle.Success);
                    message.edit({ components: newComponents });

                    await buttonInteraction.reply({ content: `**[ ${i} ] - ${selectedPlayer.user.displayName}** has been selected.`, ephemeral: true });
                    return;
                }
            }
        });

        collector.on("end", () => {
            message.edit({ components: actionController.highlightComponent(this.actionSelectedFirst) });
        })
    }

    getActionResults(): Array<number> {
        return [ this.actionSelectedFirst, this.actionSelectedSecond ];
    }
}