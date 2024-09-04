import { Guild, PermissionsBitField, Role, TextChannel } from "discord.js";
import QueueBuilder from "../game/QueueBuilder";
import Game from "../../../global/Game";

export default class ServerRoleHandler {
    roles: Map<string, string>;
    guild: Guild;

    constructor(guild: Guild) {
        this.guild = guild;
    }
    
    async createRoles() {
        this.roles = new Map<string, string>();

        const alive = await this.guild.roles.create({
            name: "Alive",
            color: Number(0x98A6D9),
            hoist: true,
            position: 10,
            mentionable: false,
            permissions: [
                PermissionsBitField.Flags.Connect, 
                PermissionsBitField.Flags.SendMessages, 
                PermissionsBitField.Flags.Speak,
                PermissionsBitField.Flags.ViewChannel
            ]
        });
        this.roles.set("alive", alive.id);

        const dead = await this.guild.roles.create({
            name: "Dead",
            hoist: true,
            position: 11,
            mentionable: false,
            permissions: [
                PermissionsBitField.Flags.Connect, 
                PermissionsBitField.Flags.SendMessages, 
                PermissionsBitField.Flags.ViewChannel
            ]
        });
        this.roles.set("dead", dead.id);

        const killed = await this.guild.roles.create({
            name: "Killed",
            color: Number(0x7D0707),
            position: 12,
            mentionable: false
        });
        this.roles.set("killed", killed.id);

        const lynched = await this.guild.roles.create({
            name: "Lynched",
            color: Number(0xC70000),
            position: 13,
            mentionable: false
        });
        this.roles.set("lynched", lynched.id);;
    }

    getRoleMap(): Map<string, string> {
        return this.roles;
    }

    async assignStartingRoles() {
        for (let i = 0; i < Game.queueBuilder.members.length; i++) {
            const member = Game.queueBuilder.members[i];
            member.roles.add(this.roles.get("alive"));

            if (member.id != this.guild.ownerId) {
                member.setNickname("[ " + (i + 1) + " ] - " + member.user.displayName);
                const channel: TextChannel = <TextChannel> this.guild.channels.cache.get(Game.townBuilder.createdChannels.get("house-" + (i + 1)));
                channel.permissionOverwrites.set([
                    {
                        id: member.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        deny: [PermissionsBitField.Flags.CreateInstantInvite]
                    },
                    {
                        id: this.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    }
                ])
            }
        }
    }

    async cleanupRoles() {
        const arr = Array.from(Game.serverRoleHandler.roles.keys());

        for (let i = 0; i < arr.length; i++) {
            const role = this.guild.roles.cache.get(await Game.serverRoleHandler.roles.get(arr[i]));
            role.delete("Server clear.").catch(console.error);
        }
    }
}