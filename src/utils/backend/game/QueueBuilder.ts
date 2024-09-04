import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, Guild, GuildMember, User } from "discord.js";
import PlayerRoleHandler from "./PlayerRoleHandler";
import Game from "../../../global/Game";

export default class QueueBuilder {
    currentQueue: QueueBuilder;
    members: Array<GuildMember>;
    players: number;

    guild: Guild;
    private rolelist: Array<string>;
    
    playerRoleHandler: PlayerRoleHandler;

    constructor(guild: Guild) {
        this.guild = guild;
        this.players = 0;
        this.members = [];
    }

    async create(interaction) {
        const join = new ButtonBuilder()
            .setCustomId("join")
            .setLabel("Join")
            .setStyle(ButtonStyle.Success)

        const leave = new ButtonBuilder()
            .setCustomId("leave")
            .setLabel("Leave")
            .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder().addComponents(join, leave);

        let queueEmbed = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle(`The town is looking for new residents! **[${this.players} / 15]**`)
            .setDescription("Please click on the \"Join\" button to participate in the current game. If you want to leave the queue, click on the \"Leave\" button.")

        let queue = await interaction.reply({ 
            embeds: [ queueEmbed ],
            components: [ row ]
        });

        const collectorFilter = i => i === i;
        const collector = queue.createMessageComponentCollector({ 
            componentType: ComponentType.Button,
            collectorFilter, 
            time: 3_000 
        })
        
        collector.on("collect", async (buttonInteraction) => {
            if (buttonInteraction.customId === "join") {
                if (this.members.indexOf(buttonInteraction.member) > -1) {
                    await buttonInteraction.reply({ content: 'You are already in the queue.', ephemeral: true });
                    return;
                } else {
                    this.players++;
                    this.members.push(buttonInteraction.member);
                }

                queueEmbed.setTitle(`The town is looking for new residents! **[${this.players} / 15]**`)
                interaction.editReply({ 
                    embeds: [ queueEmbed ],
                    components: [ row ]
                })
                
                await buttonInteraction.reply({ content: 'You have joined the queue.', ephemeral: true });
                return;
            } 
            
            if (buttonInteraction.customId === "leave") {
                if (this.members.indexOf(buttonInteraction.member) == -1) {
                    await buttonInteraction.reply({ content: 'You are not currently in the queue.', ephemeral: true });
                    return;
                } else {
                    this.players--;
                    const idPos = this.members.indexOf(buttonInteraction.member);
                    this.members.splice(idPos, 1);
                }

                queueEmbed.setTitle(`The town is looking for new residents! **[${this.players} / 15]**`)
                interaction.editReply({ 
                    embeds: [ queueEmbed ],
                    components: [ row ]
                })

                await buttonInteraction.reply({ content: 'You have left the queue.', ephemeral: true });
                return;
            }
        });

        collector.on("end", () => {
            join.setDisabled(true);
            leave.setDisabled(true);

            let playerList = "";
            for (let i = 0; i < this.members.length; i++) {
                playerList += "`#" + (i + 1) + "` **-** <@" + this.members[i].id + ">\n"
            }

            interaction.editReply({
                embeds: [ 
                    new EmbedBuilder()
                        .setColor(0x7FFF00)
                        .setTitle(`The town has found ${this.players} new residents!`)
                        .setDescription("The queue is now closed. To those who have opted into the game, please prepare to be moved into your house channels. Spectators will be unable to see house channels until the end of the game. \n\n **Player List:**\n" + playerList)
                ],
                components: []
            })

            Game.serverRoleHandler.assignStartingRoles();
            this.assignPlayerRoles(this.rolelist);
        })
    }

    setRolelist(rolelist: Array<string>) {
        this.rolelist = rolelist;
    }

    assignPlayerRoles(rolelist: Array<string>) {
        const playerRoles = new PlayerRoleHandler(this.guild, this.members, rolelist);
        this.playerRoleHandler = playerRoles;
    }
}