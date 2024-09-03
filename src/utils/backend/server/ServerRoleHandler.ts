import { Guild, PermissionsBitField, Role } from "discord.js";
import QueueBuilder from "../game/QueueBuilder";
import Game from "../../../global/Game";

export default class ServerRoleHandler {
    roles: Map<string, Promise<Role>>;
    guild: Guild;

    constructor(guild: Guild) {
        this.guild = guild;
    }
    
    async createRoles() {
        const alive = this.guild.roles.create({
            name: "Alive",
            color: Number(0x98A6D9),
            hoist: true,
            position: 10,
            mentionable: false
        });

        const dead = this.guild.roles.create({
            name: "Dead",
            hoist: true,
            position: 11,
            mentionable: false,
        });

        const killed = this.guild.roles.create({
            name: "Killed",
            color: Number(0x7D0707),
            position: 12,
            mentionable: false
        });

        const lynched = this.guild.roles.create({
            name: "Lynched",
            color: Number(0xC70000),
            position: 13,
            mentionable: false
        });

        this.roles = new Map();
        this.roles.set("alive", alive);
        this.roles.set("dead", dead);
        this.roles.set("killed", killed);
        this.roles.set("lynched", lynched);
        
        for (let i = 1; i <= 3; i++) {
            const num = this.guild.roles.create({
                name: i.toString(),
                position: 13 + i,
                mentionable: true
            })
            this.roles.set("player" + i, num);
        }

        (await alive).setPermissions([
            PermissionsBitField.Flags.Connect, 
            PermissionsBitField.Flags.SendMessages, 
            PermissionsBitField.Flags.Speak,
            PermissionsBitField.Flags.ViewChannel
        ]);

        (await dead).setPermissions([
            PermissionsBitField.Flags.Connect, 
            PermissionsBitField.Flags.SendMessages, 
            PermissionsBitField.Flags.ViewChannel
        ]);

        return this.roles;
    }

    async assignStartingRoles() {
        for (let i = 0; i < Game.queueBuilder.members.length; i++) {
            const member = Game.queueBuilder.members[i];
            member.roles.add(await this.roles.get("alive"));
            member.roles.add(await this.roles.get("player" + (i + 1)));

            if (member.id != this.guild.ownerId) {
                member.setNickname("[ " + (i + 1) + " ] - " + member.user.displayName);
            }
        }
    }

    async cleanupRoles() {
        const arr = Array.from(Game.serverRoleHandler.roles.keys());

        for (let i = 0; i < arr.length; i++) {
            const role = await Game.serverRoleHandler.roles.get(arr[i]);
            role.delete("Server clear.").catch(console.error);
        }
    }
}