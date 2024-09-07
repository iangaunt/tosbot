

/** 
 * A class which models the setup of the objects held in the `roles.json` file. 
 * 
 * @param color - The color of the role, which is shown in the embed (like in `/role` or `/my`).
 * @param emoji - The unique icon of the role, used in graveyards and embeds.
 * 
 * @param description - The description of the role. Typically very lengthy and has rich text formatting.
 * 
 * @param category - The category of the role (ex. "Town Killing" or "Mafia Deception"). 
 * The category can be split into the umbrella or the specific.
 * 
 * @param unique - `true` if only one copy of the role can exist per town, `false` if otherwise.
 */
export class RoleData {
    color: string;
    emoji: string;
    description: Array<string>;
    category: string;
    unique: boolean;
    attack: number;
    defense: number;
}

export class Rolelist {
    name: string;
    role: Array<string>;
}