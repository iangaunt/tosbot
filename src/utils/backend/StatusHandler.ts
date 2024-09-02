import { Guild, Role, Status } from "discord.js";
import QueueBuilder from "./QueueBuilder";

export default class StatusHandler {
    static roles: Map<string, Promise<Role>>;
    static guild: Guild;

    constructor(guild: Guild) {
        StatusHandler.guild = guild;
    }
    
    static createRoles() {
        const alive = StatusHandler.guild.roles.create({
            name: "Alive",
            color: Number(0x98A6D9),
            hoist: true,
            position: 3,
            mentionable: false
        });

        const dead = StatusHandler.guild.roles.create({
            name: "Dead",
            hoist: true,
            position: 4,
            mentionable: false
        });

        const killed = StatusHandler.guild.roles.create({
            name: "Killed",
            color: Number(0x7D0707),
            position: 5,
            mentionable: false
        });

        const lynched = this.guild.roles.create({
            name: "Lynched",
            color: Number(0xC70000),
            position: 6,
            mentionable: false
        });

        StatusHandler.roles = new Map();
        this.roles.set("alive", alive);
        this.roles.set("dead", dead);
        this.roles.set("killed", killed);
        this.roles.set("lynched", lynched);
        
        return StatusHandler.roles;
    }

    static async assignStartingRoles() {
        const statusRoles = this.createRoles();

        for (let i = 0; i < QueueBuilder.members.length; i++) {
            QueueBuilder.members[i].roles.add(await statusRoles.get("alive"));
        }
    }

    static async cleanupRoles() {
        const arr = Array.from(StatusHandler.roles.keys());

        for (let i = 0; i < arr.length; i++) {
            const role = await StatusHandler.roles.get(arr[i]);
            role.delete("Server clear.").catch(console.error);
        }
    }
}