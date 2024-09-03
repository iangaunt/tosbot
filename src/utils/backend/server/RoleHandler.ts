import { Guild, PermissionsBitField, Role } from "discord.js";
import QueueBuilder from "../game/QueueBuilder";

export default class RoleHandler {
    static roles: Map<string, Promise<Role>>;
    static guild: Guild;

    constructor(guild: Guild) {
        RoleHandler.guild = guild;
    }
    
    static async createRoles() {
        const alive = RoleHandler.guild.roles.create({
            name: "Alive",
            color: Number(0x98A6D9),
            hoist: true,
            position: 3,
            mentionable: false
        });
        
        console.log("made alive");

        const dead = RoleHandler.guild.roles.create({
            name: "Dead",
            hoist: true,
            position: 4,
            mentionable: false,
        });

        console.log("made dead");

        const killed = RoleHandler.guild.roles.create({
            name: "Killed",
            color: Number(0x7D0707),
            position: 5,
            mentionable: false
        });

        console.log("made dead2");

        const lynched = RoleHandler.guild.roles.create({
            name: "Lynched",
            color: Number(0xC70000),
            position: 6,
            mentionable: false
        });

        console.log("made dead3");

        RoleHandler.roles = new Map();
        RoleHandler.roles.set("alive", alive);
        RoleHandler.roles.set("dead", dead);
        RoleHandler.roles.set("killed", killed);
        RoleHandler.roles.set("lynched", lynched);

        console.log("made map");
        
        for (let i = 1; i <= 3; i++) {
            const num = RoleHandler.guild.roles.create({
                name: i.toString(),
                position: 6 + i,
                mentionable: true
            })
            RoleHandler.roles.set("player" + i, num);
        }

        console.log("made hoses");

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
        
        console.log("perms");

        return RoleHandler.roles;
    }

    static async assignStartingRoles() {
        for (let i = 0; i < QueueBuilder.members.length; i++) {
            const member = QueueBuilder.members[i];
            member.roles.add(await RoleHandler.roles.get("alive"));
            member.roles.add(await RoleHandler.roles.get("player" + (i + 1)));

            if (member.id != RoleHandler.guild.ownerId) {
                member.setNickname("[ " + (i + 1) + " ] - " + member.user.displayName);
            }
        }
    }

    static async cleanupRoles() {
        const arr = Array.from(RoleHandler.roles.keys());

        for (let i = 0; i < arr.length; i++) {
            const role = await RoleHandler.roles.get(arr[i]);
            role.delete("Server clear.").catch(console.error);
        }
    }
}