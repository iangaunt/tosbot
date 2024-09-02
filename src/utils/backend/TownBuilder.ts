import { ChannelType, Guild } from "discord.js";
import QueueBuilder from "./QueueBuilder";

export default class TownBuilder {
    static currentTown: TownBuilder;
    createdChannels: Array<string>;
    guild: Guild;

    constructor(guild: Guild) {
        this.guild = guild;
        this.createdChannels = [];
    }

    async create() {
        TownBuilder.currentTown = this;

        const town = this.guild.channels.create({
            name: "Town",
            type: ChannelType.GuildCategory
        });
    
        const townID = (await town).id;
        this.createdChannels.push(townID);

        const townSquare = this.guild.channels.create({
            name: "town-square",
            type: ChannelType.GuildText,
            parent: townID
        });
        this.createdChannels.push((await townSquare).id);

        const afterlife = this.guild.channels.create({
            name: "afterlife",
            type: ChannelType.GuildText,
            parent: townID
        });
        this.createdChannels.push((await afterlife).id);
    
        const houses = this.guild.channels.create({
            name: "Houses",
            type: ChannelType.GuildCategory
        });

        const houseId = (await houses).id;
        this.createdChannels.push(houseId);

        for (let i = 1; i <= 1; i++) {
            const house = this.guild.channels.create({
                name: "house-" + i,
                type: ChannelType.GuildText,
                parent: houseId
            });
            this.createdChannels.push((await house).id);
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