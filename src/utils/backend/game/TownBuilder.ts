import { ChannelType, Guild, PermissionsBitField } from "discord.js";
import QueueBuilder from "./QueueBuilder";
import ChannelCreator from "../server/ChannelCreator";
import ServerRoleHandler from "../server/ServerRoleHandler";
import Game from "../../../global/Game";

export default class TownBuilder {
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
        const town = await ChannelCreator.createCategory(this.guild, "Town");
        const townID = town.id;
        this.createdChannels.set("town", townID);

        const townSquare = await ChannelCreator.createChannelPerms(
            this.guild, "town-square", 
            ChannelType.GuildText, townID,
            [
                {
                    id: (await Game.serverRoleHandler.roles.get("alive")).id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    deny: [PermissionsBitField.Flags.AttachFiles]
                },
                {
                    id: (await Game.serverRoleHandler.roles.get("dead")).id,
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

        const afterlife = await ChannelCreator.createChannelPerms(
            this.guild, "afterlife", 
            ChannelType.GuildText, townID,
            [
                {
                    id: (await Game.serverRoleHandler.roles.get("alive")).id,
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                },
                {
                    id: (await Game.serverRoleHandler.roles.get("dead")).id,
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
    
        const houses = await ChannelCreator.createCategory(this.guild, "Houses");
        const housesID = houses.id;
        this.createdChannels.set("houses", housesID);

        for (let i = 1; i <= 3; i++) {
            const house = await ChannelCreator.createChannelPerms(
                this.guild, "house-" + i, 
                ChannelType.GuildText, housesID,
                [
                    {
                        id: (await Game.serverRoleHandler.roles.get("player" + i)).id,
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
            Game.townBuilder = null;
            Game.queueBuilder.currentQueue = null;
        }
        this.createdChannels = new Map<string, string>();
    }
}