import { Guild, PermissionsBitField, Role, TextChannel } from "discord.js";
import Game from "../../../global/Game";

/**
 * Handles the creation and editing of roles on the guild. Used
 * for controlling who can speak in certain channels.
 */
export default class ServerRoleHandler {
    roles: Map<string, string>;
    guild: Guild;

    /**
     * Initializes a new ServerRoleHandler by passing in the guild to work with.
     * 
     * @param guild The guild to make roles for.
     */
    constructor(guild: Guild) {
        this.guild = guild;
    }

    /**
     * Creates a series of roles that are important for the game, such as
     * the Alive and Dead roles, Killed vs. Lynched.
     */
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

    /**
     * Returns the map of roles (matches name to role ID).
     * 
     * @returns The map of roles (may be empty).
     */
    getRoleMap(): Map<string, string> {
        return this.roles;
    }

    /**
     * Assigns the Alive role to all starting players and moves them
     * into their individual channels, ordered by number. The players
     * are nicknamed depending on their internal number. Has nothing
     * to do with the rolelist.
     */
    async assignStartingRoles() {
        // Moves through all of the members in the queue and gives them a nickname + role.
        for (let i = 0; i < Game.queueBuilder.members.length; i++) {
            const member = Game.queueBuilder.members[i];
            member.roles.add(this.roles.get("alive"));

            // This if statement is here because if I am in the game, the game will
            // crash if it tries to edit my nickname :( [ server owner ]
            if (member.id != this.guild.ownerId) {
                member.setNickname("[ " + (i + 1) + " ] - " + member.user.displayName);
                const channel: TextChannel = <TextChannel>this.guild.channels.cache.get(Game.townBuilder.createdChannels.get("house-" + (i + 1)));
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

    /**
     * Deletes all of the roles used in the game.
     */
    async cleanupRoles() {
        const arr = Array.from(Game.serverRoleHandler.roles.keys());

        for (let i = 0; i < arr.length; i++) {
            const role = this.guild.roles.cache.get(Game.serverRoleHandler.roles.get(arr[i]));
            role.delete("Server clear.").catch(console.error);
        }
    }
}