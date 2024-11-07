import { BaseMessageOptions, ChannelType, Guild, PermissionsBitField, TextChannel } from "discord.js";

import Game from "../../../global/Game";
import ChannelHandler from "../server/ChannelHandler";
import DaytimeEmbed from "../../visuals/embeds/DaytimeEmbed";
import NighttimeEmbed from "../../visuals/embeds/NighttimeEmbed";
import BasicEmbed from "../../visuals/embeds/BasicEmbed";

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
        const town = await ChannelHandler.createCategory(this.guild, "Town");
        const townID = town.id;
        this.createdChannels.set("town", townID);

        let rolesMap = Game.serverRoleHandler.getRoleMap();
        while (rolesMap.size < 2) {
            rolesMap = Game.serverRoleHandler.getRoleMap();
            await new Promise(f => setTimeout(f, 100));
        }

        const podium = await ChannelHandler.createChannelPerms(
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

        const townSquare = await ChannelHandler.createChannelPerms(
            this.guild, "town-square", 
            ChannelType.GuildText, townID,
            [
                {
                    id: rolesMap.get("alive"),
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles]
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

        const afterlife = await ChannelHandler.createChannelPerms(
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
    
        const houses = await ChannelHandler.createCategory(this.guild, "Houses");
        const housesID = houses.id;
        this.createdChannels.set("houses", housesID);

        for (let i = 1; i <= 3; i++) {
            const house = await ChannelHandler.createChannelPerms(
                this.guild, "house-" + i, 
                ChannelType.GuildText, housesID,
                [
                    {
                        id: this.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    }
                ]
            );
            this.createdChannels.set("house-" + i, house.id);
        }
    }

    async openChannel(urId: string, channelId: string) {
        const channel: TextChannel = <TextChannel> this.guild.channels.cache.get(channelId);
        channel.permissionOverwrites.edit(urId, { ViewChannel: true, SendMessages: true })
    }

    async closeChannel(urId: string, channelId: string) {
        const channel: TextChannel = <TextChannel> this.guild.channels.cache.get(channelId);
        channel.permissionOverwrites.edit(urId, { ViewChannel: true, SendMessages: false })
    }

    async sendMessage(base: BaseMessageOptions) {
        const townSquare: TextChannel = <TextChannel> this.guild.channels.cache.get(this.createdChannels.get("town-square"));
        townSquare.send(base);
    }

    async sendTimeMessage(type: string, num: number) {
        const townSquare: TextChannel = <TextChannel> this.guild.channels.cache.get(this.createdChannels.get("town-square"));
        const base = <BaseMessageOptions> {
            content: "> <@&" + Game.serverRoleHandler.roles.get("alive") +">",
            embeds: [ (type == "day" ? DaytimeEmbed(num) : NighttimeEmbed(num, false)) ]
        }

        const timeMessage = townSquare.send(base);
    }

    async sendEndingMessage(type: string) {
        const townSquare: TextChannel = <TextChannel> this.guild.channels.cache.get(this.createdChannels.get("town-square"));
        const base = <BaseMessageOptions> {
            embeds: [ (type == "day" ? BasicEmbed("daytime_end") : BasicEmbed("nighttime_end")) ]
        }

        const timeMessage = townSquare.send(base); 
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