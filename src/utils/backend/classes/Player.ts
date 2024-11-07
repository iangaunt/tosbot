import { ButtonInteraction, ButtonStyle, ComponentType, Interaction, PermissionFlagsBits, PermissionsBitField, TextChannel } from "discord.js";
import roledata from "../../../../public/embeds/roles.json"
import Game from "../../../global/Game";
import ActionController from "../../visuals/controllers/ActionController";
import { RoleData } from "./Structures";
import ResponseEmbed from "../../visuals/embeds/ResponseEmbed";

export default class Player {
    userId: string;

    name: string;
    faction: string;
    category: string;
    alive: boolean;

    defense: number;
    attack: number;

    number: number;
    houseChannelId: string;
    killReason: string;

    allowedActionPlayers: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    hasNecronomicon: boolean = false;
    doused: boolean = false;
    framed: boolean = false;
    hexed: boolean = false;
    
    takesInMultipleActionPlayers: boolean;

    private actionSelectedFirst: number = 0;
    private actionSelectedSecond: number = 0; 

    constructor(name: string, userId: string, number: number, takesInMultipleActionPlayers: boolean) {
        this.userId = userId;

        this.name = name;
        const data: RoleData = roledata[name];
        
        this.category = data.category;
        this.faction = this.category.split(" ")[0];

        this.defense = data.defense;
        this.attack = data.attack;

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
            if (this.actionSelectedFirst != 0) {
                message.edit({ components: actionController.highlightComponent(this.actionSelectedFirst) });
            }
        })
    }

    attackOn(other: Player) {
        return this.attack > other.defense;
    }

    async die(killReason: string) {
        this.alive = false;
        this.killReason = killReason;

        const user = Game.guild.members.cache.get(this.userId);

        user.roles.remove(Game.serverRoleHandler.roles.get("alive"));
        user.roles.add(Game.serverRoleHandler.roles.get("dead"));
        user.roles.add(Game.serverRoleHandler.roles.get("killed"));

        const houseChannel = <TextChannel> Game.guild.channels.cache.get(this.houseChannelId);
        houseChannel.permissionOverwrites.edit(this.userId, { SendMessages: false });

        Game.kills.push(this);

        const message = await <any> houseChannel.send({
            content: `> <@${this.userId}>`,
            embeds: [ ResponseEmbed("mafia_attack")]
        });
    }

    getActionResults(): Array<number> {
        return [ this.actionSelectedFirst, this.actionSelectedSecond ];
    }
}