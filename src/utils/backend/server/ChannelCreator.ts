import { ChannelType, Guild } from "discord.js";

export default class ChannelCreator {
    static async createCategory(guild: Guild, name: string) {
        return guild.channels.create({
            name: name,
            type: ChannelType.GuildCategory
        })
    }

    static async createCategoryPerms(guild: Guild, name: string, channelType, permissionOverwrites) {
        return guild.channels.create({
            name: name,
            type: ChannelType.GuildCategory,
            permissionOverwrites: permissionOverwrites
        })
    }

    static async createChannel(guild: Guild, name: string, channelType, parent: string) {
        return guild.channels.create({
            name: name,
            type: channelType,
            parent: parent
        })
    }

    static async createChannelPerms(guild: Guild, name: string, channelType, parent: string, permissionOverwrites) {
        console.log(name);
        return guild.channels.create({
            name: name,
            type: channelType,
            parent: parent,
            permissionOverwrites: permissionOverwrites
        })
    }
}