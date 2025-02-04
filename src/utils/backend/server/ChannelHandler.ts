import { ChannelType, Guild } from "discord.js";

/**
 * Creates new channels or categories with specific channel 
 * types and permission overwrites.
 */
export default class ChannelHandler {
    /**
     * Creates a new category in the input guild with a specified name.
     * 
     * @param guild The current guild.
     * @param name The name of the new category.
     */
    static async createCategory(guild: Guild, name: string) {
        return guild.channels.create({
            name: name,
            type: ChannelType.GuildCategory
        })
    }

    /**
     * Creates a new category in the input guild with a specified name
     * and specific permissions. 
     * 
     * @param guild The current guild.
     * @param name The name of the new category.
     * @param permissionOverwrites The permissions for the new category.
     */
    static async createCategoryPerms(guild: Guild, name: string, permissionOverwrites) {
        return guild.channels.create({
            name: name,
            type: ChannelType.GuildCategory,
            permissionOverwrites: permissionOverwrites
        })
    }

    /**
     * Creates a new channel in the input guild with a specified channel type
     * and parent category (channels will not be made without a category).
     * 
     * @param guild The current guild.
     * @param name The name of the new category.
     * @param channelType The type of channel (voice, text, etc.)
     * @param parent The category for this new channel to fall under.
     */
    static async createChannel(guild: Guild, name: string, channelType, parent: string) {
        return guild.channels.create({
            name: name,
            type: channelType,
            parent: parent
        })
    }

    /**
     * Creates a new channel in the input guild with a specified channel type
     * and parent category (channels will not be made without a category). This
     * channel will have specific permissions specified by the overwrites.
     * 
     * @param guild The current guild.
     * @param name The name of the new category.
     * @param channelType The type of channel (voice, text, etc.)
     * @param parent The category for this new channel to fall under.
     * @param permissionOverwrites The new permissions for the channel.
     */
    static async createChannelPerms(guild: Guild, name: string, channelType, parent: string, permissionOverwrites) {
        return guild.channels.create({
            name: name,
            type: channelType,
            parent: parent,
            permissionOverwrites: permissionOverwrites
        })
    }
}