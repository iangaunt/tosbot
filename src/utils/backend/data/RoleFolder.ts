import roledata from "../../../../public/roles/roledata.json"

/** Generates a data structure grouping roles by their categories / subcategories. */
export default class RoleFolder {
    // The folder of all 50 roles that can be generated.
    static folder: Map<string, Map<string, Array<string>>> = null;

    /**
     * Generates the role folder for the bot to use. Note that the data structure
     * is static, and therefore should be edited unless it is deep copied.
     * @returns - The role folder. 
     */
    static buildRoleFolder() {
        // Blocks the generation of a new role folder if it already exists.
        if (RoleFolder.folder != null) return;
        RoleFolder.folder = new Map<string, Map<string, Array<string>>>();

        // Loops through every role in the roledata and puts them into a category / subcategory.
        for (let role in roledata) {
            const category = roledata[role].category;
            const categoryArr = category.split(" ");

            // The "umbrella" tag is the faction, the "specific" tag is the toolkit.
            const umbrella = categoryArr[0]; // For example, "Town", "Coven", "Mafia".
            const specific = categoryArr[1]; // For example, "Killing", "Benign", "Evil".

            // If an umbrella / specific object does not exist, make it and add it to the folder.
            // If it exists, then add to the folder through location.
            if (RoleFolder.folder.has(umbrella)) {
                const umbrellaMap = RoleFolder.folder.get(umbrella);
                
                let arr: Array<string> = umbrellaMap.has(specific) ? umbrellaMap.get(specific) : new Array<string>();
                arr.push(role);
                umbrellaMap.set(specific, arr);
            } else {
                RoleFolder.folder.set(umbrella, new Map<string, Array<string>>());
                RoleFolder.folder.get(umbrella).set(specific, [role]);
            }
        }
    }

    /**
     * An availability map is similar to a role folder, but it is one layer deep,
     * meaning the umbrella and specific tags are combined.
     * 
     * ex. the role folder contains "Town" -> "Killing" -> "Veteran",
     * but the availability map contains "Town Killing" -> "Veteran".
     * 
     * This means that an availability map can be transformed into an umbrella map with ease.
     * @returns - The availability map of all roles that can be generated (meaning no Pestilence).
     */
    static generateAvailabilityMap(): Map<string, Array<string>> {
        if (RoleFolder.folder == null) return null;

        // The availability map is not static and is created upon each call.
        const availabilityMap = new Map<string, Array<string>>();

        // Loops through every key in the role folder.
        const folderKeys = Array.from(RoleFolder.folder.keys());
        for (let umbrella of folderKeys) {
            // Fetches the keys from the umbrella ("Town" -> "Killing").
            const umbrellaMap = RoleFolder.folder.get(umbrella);
            const umbrellaKeys = Array.from(umbrellaMap.keys());

            // Loops through every key in the umbrella map.
            for (let specific of umbrellaKeys) {
                const specificArr = umbrellaMap.get(specific);
                const categoryArr = new Array<string>();

                // Adds every role from the subcategory to a new array and adds it to the availability map.
                for (let i = 0; i < specificArr.length; i++) {
                    if (specificArr[i] !== "Pestilence") categoryArr.push(specificArr[i]);
                }

                // ex. "Town Killing" -> ["Veteran", "Vigilante", ...]
                // ex. "Coven Evil" -> ["Coven Leader", "Hex Master", ...]
                availabilityMap.set(umbrella + " " + specific, categoryArr);
            }
        }

        // Returns the availability map.
        return availabilityMap;
    }
}