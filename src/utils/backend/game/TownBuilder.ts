import { ChannelType, Guild, PermissionsBitField } from "discord.js";
import QueueBuilder from "./QueueBuilder";
import ChannelHandler from "../server/ChannelHandler";
import ServerRoleHandler from "../server/ServerRoleHandler";

export default class TownBuilder {
    static currentTown: TownBuilder;
    createdChannels: Map<string, string>;
    guild: Guild;

    constructor(guild: Guild) {
        this.guild = guild;
        this.createdChannels = new Map<string, string>();
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
        this.createdChannels.set("town", townID);

        const townSquare = await ChannelHandler.createChannelPerms(
            this.guild, "town-square", 
            ChannelType.GuildText, townID,
            [
                {
                    id: (await ServerRoleHandler.roles.get("alive")).id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    deny: [PermissionsBitField.Flags.AttachFiles]
                },
                {
                    id: (await ServerRoleHandler.roles.get("dead")).id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                    deny: [PermissionsBitField.Flags.SendMessages]
                },
                {
                    id: this.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                }
            ]
        );

        this.createdChannels.set("town-square", townSquare.id);

        const afterlife = await ChannelHandler.createChannelPerms(
            this.guild, "afterlife", 
            ChannelType.GuildText, townID,
            [
                {
                    id: (await ServerRoleHandler.roles.get("alive")).id,
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                },
                {
                    id: (await ServerRoleHandler.roles.get("dead")).id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    deny: [PermissionsBitField.Flags.AttachFiles]
                },
                {
                    id: this.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                }
            ]
        );
        this.createdChannels.set("afterlife", afterlife.id);
    
        const houses = await ChannelHandler.createCategory(this.guild, "Houses");
        const housesID = houses.id;
        this.createdChannels.set("houses", housesID);

        for (let i = 1; i <= 3; i++) {
            const house = await ChannelHandler.createChannelPerms(
                this.guild, "house-" + i, 
                ChannelType.GuildText, housesID,
                [
                    {
                        id: (await ServerRoleHandler.roles.get("player" + i)).id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        deny: [PermissionsBitField.Flags.CreateInstantInvite]
                    },
                    {
                        id: this.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    }
                ]
            );
            this.createdChannels.set("house-" + i, house.id);
        }
    }

    async clear() {
        const ids = Array.from(this.createdChannels.values());
        for (let i = 0; i < ids.length; i++) {
            this.guild.channels.delete(ids[i], "The game is over / was forcefully reset.");
            TownBuilder.currentTown = null;
            QueueBuilder.currentQueue = null;
        }
        this.createdChannels = new Map<string, string>();
    }
}