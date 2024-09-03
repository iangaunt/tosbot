import roledata from "../../../../public/roles/roledata.json"
import RoleData from "./RoleData";

export default class PlayerRole {
    name: string;
    faction: string;
    category: string;

    constructor(name: string) {
        this.name = name;
        const data: RoleData = roledata[name];
        
        this.category = data.category;
        this.faction = this.category.split(" ")[0];
    }
}