import { ChannelType, Guild, PermissionsBitField } from "discord.js";
import QueueBuilder from "./QueueBuilder";
import ChannelHandler from "../server/ChannelHandler";
import RoleHandler from "../server/RoleHandler";

export default class TownBuilder {
    static currentTown: TownBuilder;
    createdChannels: Array<string>;
    guild: Guild;

    constructor(guild: Guild) {
        this.guild = guild;
        this.createdChannels = [];
    }

    async createChannel(name: string, type) {
        return this.guild.channels.create({
            name: name,
            type: type
        })
    }

    async create() {
        TownBuilder.currentTown = this;

        const town = await ChannelHandler.createCategory(this.guild, "Town");
        const townID = town.id;
        this.createdChannels.push(townID);

        const townSquare = await ChannelHandler.createChannelPerms(
            this.guild, "town-square", 
            ChannelType.GuildText, townID,
            [
                {
                    id: (await RoleHandler.roles.get("alive")).id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    deny: [PermissionsBitField.Flags.AttachFiles]
                },
                {
                    id: (await RoleHandler.roles.get("dead")).id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                    deny: [PermissionsBitField.Flags.SendMessages]
                },
                {
                    id: this.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                }
            ]
        );

        this.createdChannels.push(townSquare.id);

        const afterlife = await ChannelHandler.createChannelPerms(
            this.guild, "afterlife", 
            ChannelType.GuildText, townID,
            [
                {
                    id: (await RoleHandler.roles.get("alive")).id,
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                },
                {
                    id: (await RoleHandler.roles.get("dead")).id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    deny: [PermissionsBitField.Flags.AttachFiles]
                },
                {
                    id: this.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                }
            ]
        );
        this.createdChannels.push(afterlife.id);
    
        const houses = await ChannelHandler.createCategory(this.guild, "Houses");
        const housesID = houses.id;
        this.createdChannels.push(housesID);

        for (let i = 1; i <= 3; i++) {
            const house = await ChannelHandler.createChannelPerms(
                this.guild, "house-" + i, 
                ChannelType.GuildText, housesID,
                [
                    {
                        id: (await RoleHandler.roles.get("player" + i)).id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        deny: [PermissionsBitField.Flags.CreateInstantInvite]
                    },
                    {
                        id: this.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    }
                ]
            );
            this.createdChannels.push(house.id);
        }
    }

    async clear() {
        for (let i = 0; i < this.createdChannels.length; i++) {
            this.guild.channels.delete(this.createdChannels[i], "The game is over / was forcefully reset.");
            TownBuilder.currentTown = null;
            QueueBuilder.currentQueue = null;
        }
    }
}