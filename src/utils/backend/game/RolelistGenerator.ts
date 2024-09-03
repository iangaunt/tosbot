import roledata from "../../../../public/roles/roledata.json"

import RoleFolder from "../data/RoleFolder";

export default class RolelistGenerator {
    availabilityList: Map<string, Array<string>>;

    generateRoleList(rolelistJson: {
        name: string,
        roles: Array<string>
    }) {
        const rolelist: Array<string> = [];

        this.availabilityList = RoleFolder.generateAvailabilityMap();
        const rolelistPriorityOrder: Array<Array<string>> = [[], [], [], []];

        // TODO: add hard limits on mafia + coven + vampire
        let mafiaAmount: number = 0;
        let covenAmount: number = 0;
        let vampireAmount: number = 0;

        for (let i = 0; i < rolelistJson.roles.length; i++) {
            const roleString = rolelistJson.roles[i];
            let priority = -1;
            
            if (this.checkStringForValidRole(roleString)) {
                priority = roleString === "Any" ? 3 : 0;
            } else {
                priority = roleString.indexOf("Random") == -1 ? 1 : 2;
            }

            rolelistPriorityOrder[priority].push(roleString);
        }

        // Priority 0.
        for (let i = 0; i < rolelistPriorityOrder[0].length; i++) {
            let role = rolelistPriorityOrder[0][i];
            let categoryArr = this.availabilityList.get(roledata[role].category);

            if (roledata[role].unique) {
                const roleIndex = categoryArr.indexOf(role);
                
                if (roleIndex != -1) {
                    categoryArr.splice(roleIndex, 1);
                    this.availabilityList.set(roledata[role].category, categoryArr);
                    rolelist.push(role);
                } else {
                    role = this.generateRandomNonUnique();
                    rolelist.push(role);
                }
            } else {
                rolelist.push(role);
            }
        }

        // Priority 1.
        for (let i = 0; i < rolelistPriorityOrder[1].length; i++) {
            const category = rolelistPriorityOrder[1][i];
            const categoryArr = this.availabilityList.get(category);
            
            const role = categoryArr[Math.floor(Math.random() * categoryArr.length)];
            
            if (roledata[role].unique) {
                categoryArr.splice(categoryArr.indexOf(role), 1);
            }
            rolelist.push(role);
        }

        let availabilityListKeys = Array.from(this.availabilityList.keys());
        for (let key in Array.from(this.availabilityList.keys())) {
            const splitCategory = availabilityListKeys[key].split(" ");
            const umbrella = splitCategory[0];

            let roleArr: Array<string>;
            if (this.availabilityList.has(umbrella)) {
                roleArr = this.availabilityList.get(umbrella);
            } else {
                roleArr = [];
            }

            const arr = this.availabilityList.get(availabilityListKeys[key]);
            for (let i = 0; i < arr.length; i++) {
                roleArr.push(arr[i]);
            }

            this.availabilityList.set(umbrella, roleArr);
            this.availabilityList.set(availabilityListKeys[key], null);
        }

        // Priority 2.
        for (let i = 0; i < rolelistPriorityOrder[2].length; i++) {
            const splitCategory = rolelistPriorityOrder[2][i].split(" ")[0];
            const categoryArr = this.availabilityList.get(splitCategory);

            const role = categoryArr[Math.floor(Math.random() * categoryArr.length)];
            
            if (roledata[role].unique) {
                categoryArr.splice(categoryArr.indexOf(role), 1);
            }
            rolelist.push(role);
        }

        const remainingRoles = [];

        availabilityListKeys = Array.from(this.availabilityList.keys());
        for (let i = 0; i < availabilityListKeys.length; i++) {
            const key = availabilityListKeys[i];
            if (key.indexOf(" ") > -1) continue;

            for (let j = 0; j < this.availabilityList.get(key).length; j++) {
                remainingRoles.push(this.availabilityList.get(key)[j]);
            }
        }

        // Priority 3.
        for (let i = 0; i < rolelistPriorityOrder[3].length; i++) {
            const role = remainingRoles[Math.floor(Math.random() * remainingRoles.length)];
            
            if (roledata[role].unique) {
                remainingRoles.splice(remainingRoles.indexOf(role), 1);
            }
            rolelist.push(role);
        }

        let vampireIndexCheck = rolelist.indexOf("Vampire");
        if (vampireIndexCheck == -1) {
            let assortedTownies = ["Sheriff", "Lookout", "Investigator", "Spy", "Tracker", "Trapper"];

            let vampireHunterIndexCheck = rolelist.indexOf("Vampire Hunter");
            while (vampireHunterIndexCheck != -1) {
                rolelist[vampireHunterIndexCheck] = this.generateRandomNonUnique();
                vampireHunterIndexCheck = rolelist.indexOf("Vampire Hunter");
            }
        }

        let mafiaKillingCheck = remainingRoles.indexOf("Godfather") == -1 || remainingRoles.indexOf("Mafioso") == -1;
        if (mafiaKillingCheck == false) {
            let mafiaIndex = -1;

            for (let i = 0; i < rolelist.length; i++) {
                const role = rolelist[i];
                if (roledata[role].category.indexOf("Mafia") != -1) {
                    mafiaIndex = i;
                }
            }

            rolelist[mafiaIndex] = "Mafioso";
            remainingRoles.splice(remainingRoles.indexOf("Mafioso"), 1);
        }

        this.shuffle(rolelist);
        return rolelist;
    }

    shuffle(arr: Array<string>) {
        for (let i = 0; i < arr.length; i++) {
            let random = Math.floor(Math.random() * arr.length);

            let temp = arr[i];
            arr[i] = arr[random];
            arr[random] = temp;
        }
    }

    generateRandomNonUnique() {
        let assortedRoles = ["Lookout", "Investigator", "Spy", "Tracker", "Trapper", "Survivor", "Arsonist", "Serial Killer", "Guardian Angel", "Jester"];
        return assortedRoles[Math.floor(Math.random() * assortedRoles.length)];
    }

    checkStringForValidRole(role: string): boolean {
        return role.indexOf("Town") == -1 && role.indexOf("Mafia") == -1 
            && role.indexOf("Coven") == -1 && role.indexOf("Neutral") == -1;
    }
}

