import { Guild, PermissionsBitField, Role } from "discord.js";
import QueueBuilder from "../game/QueueBuilder";

export default class ServerRoleHandler {
    static roles: Map<string, Promise<Role>>;
    static guild: Guild;

    constructor(guild: Guild) {
        ServerRoleHandler.guild = guild;
    }
    
    static async createRoles() {
        const alive = ServerRoleHandler.guild.roles.create({
            name: "Alive",
            color: Number(0x98A6D9),
            hoist: true,
            position: 3,
            mentionable: false
        });

        const dead = ServerRoleHandler.guild.roles.create({
            name: "Dead",
            hoist: true,
            position: 4,
            mentionable: false,
        });

        const killed = ServerRoleHandler.guild.roles.create({
            name: "Killed",
            color: Number(0x7D0707),
            position: 5,
            mentionable: false
        });

        const lynched = ServerRoleHandler.guild.roles.create({
            name: "Lynched",
            color: Number(0xC70000),
            position: 6,
            mentionable: false
        });

        ServerRoleHandler.roles = new Map();
        ServerRoleHandler.roles.set("alive", alive);
        ServerRoleHandler.roles.set("dead", dead);
        ServerRoleHandler.roles.set("killed", killed);
        ServerRoleHandler.roles.set("lynched", lynched);

        console.log(ServerRoleHandler.roles);
        
        for (let i = 1; i <= 3; i++) {
            const num = ServerRoleHandler.guild.roles.create({
                name: i.toString(),
                position: 6 + i,
                mentionable: true
            })
            ServerRoleHandler.roles.set("player" + i, num);
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

        return ServerRoleHandler.roles;
    }

    static async assignStartingRoles() {
        for (let i = 0; i < QueueBuilder.members.length; i++) {
            const member = QueueBuilder.members[i];
            member.roles.add(await ServerRoleHandler.roles.get("alive"));
            member.roles.add(await ServerRoleHandler.roles.get("player" + (i + 1)));

            if (member.id != ServerRoleHandler.guild.ownerId) {
                member.setNickname("[ " + (i + 1) + " ] - " + member.user.displayName);
            }
        }
    }

    static async cleanupRoles() {
        const arr = Array.from(ServerRoleHandler.roles.keys());

        for (let i = 0; i < arr.length; i++) {
            const role = await ServerRoleHandler.roles.get(arr[i]);
            role.delete("Server clear.").catch(console.error);
        }
    }
}