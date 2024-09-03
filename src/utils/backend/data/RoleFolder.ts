import roledata from "../../../../public/roles/roledata.json"

export default class RoleFolder {
    static folder: Map<string, Map<string, Array<string>>> = null;

    static buildRoleFolder() {
        if (RoleFolder.folder != null) return;
        RoleFolder.folder = new Map<string, Map<string, Array<string>>>();

        for (let role in roledata) {
            const category = roledata[role].category;
            const categoryArr = category.split(" ");

            const umbrella = categoryArr[0];
            const specific = categoryArr[1];

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

    static generateAvailabilityMap(): Map<string, Array<string>> {
        if (RoleFolder.folder == null) return null;

        const availabilityMap = new Map<string, Array<string>>();

        const folderKeys = Array.from(RoleFolder.folder.keys());
        for (let umbrella of folderKeys) {
            const umbrellaMap = RoleFolder.folder.get(umbrella);
            const umbrellaKeys = Array.from(umbrellaMap.keys());

            for (let specific of umbrellaKeys) {
                const specificArr = umbrellaMap.get(specific);
                const categoryArr = new Array<string>();

                for (let i = 0; i < specificArr.length; i++) {
                    if (specificArr[i] !== "Pestilence") categoryArr.push(specificArr[i]);
                }

                availabilityMap.set(umbrella + " " + specific, categoryArr);
            }
        }

        return availabilityMap;
    }
}