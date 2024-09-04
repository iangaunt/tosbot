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

        let rolesMap = Game.serverRoleHandler.getRoleMap();
        while (rolesMap.size < 2) {
            rolesMap = Game.serverRoleHandler.getRoleMap();
            await new Promise(f => setTimeout(f, 250));
        }

        const podium = await ChannelCreator.createChannelPerms(
            this.guild, "podium", 
            ChannelType.GuildText, townID,
            [
                {
                    id: rolesMap.get("alive"),
                    deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles]
                },
                {
                    id: rolesMap.get("dead"),
                    deny: [PermissionsBitField.Flags.SendMessages]
                },
                {
                    id: this.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                }
            ]
        );
        this.createdChannels.set("podium", podium.id);

        const townSquare = await ChannelCreator.createChannelPerms(
            this.guild, "town-square", 
            ChannelType.GuildText, townID,
            [
                {
                    id: rolesMap.get("alive"),
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    deny: [PermissionsBitField.Flags.AttachFiles]
                },
                {
                    id: rolesMap.get("dead"),
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
                    id: rolesMap.get("alive"),
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                },
                {
                    id: rolesMap.get("dead"),
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
            const house = await ChannelCreator.createChannel(
                this.guild, "house-" + i, 
                ChannelType.GuildText, housesID
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