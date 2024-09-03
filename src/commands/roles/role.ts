import { APIApplicationCommandOptionChoice, SlashCommandBuilder } from "discord.js";

import roledata from "../../../public/roles/roledata.json";
import RoleEmbed from "../../utils/visuals/RoleEmbed"
import RoleFolder from "../../utils/backend/data/RoleFolder";

RoleFolder.buildRoleFolder();

const roleOrder: Array<string> = [];
const dropdownChoices: Array<APIApplicationCommandOptionChoice<string>> = [];

for (let i = 0; i < Object.keys(roledata).length; i++) {
    const key = Object.keys(roledata)[i];

    roleOrder.push(key);
    dropdownChoices.push({ name: key, value: key })
}

const rolesOneSlice = roleOrder.slice(0, 25);
const rolesTwoSlice = roleOrder.slice(25, 50);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("Generates a role card, which contains information about the roles in TOSbot.")
        .addStringOption(
            option => option.setName("page1")
                .setDescription("The first 25 roles (A - L). It will return an embed card containing most role information.")
                .addChoices(dropdownChoices.slice(0, 25))
        ).addStringOption(
            option => option.setName("page2")
                .setDescription("The last 25 roles (M - Z). It will return an embed card containing most role information.")
                .addChoices(dropdownChoices.slice(25, 50))
        ),

    async execute(interaction) {
        const chosenRole1 = interaction.options.getString("page1") ?? "random";
        const chosenRole2 = interaction.options.getString("page2") ?? "random";

        if (chosenRole1 === "random" && chosenRole2 === "random") {
            const randomIndex = Math.floor(Math.random() * Object.keys(roledata).length);
            await interaction.reply({ embeds: [
                RoleEmbed(Object.keys(roledata)[randomIndex])
            ]});
            return;
        }

        if (chosenRole1 != "random" || chosenRole2 != "random") {
            let roleIndex = rolesOneSlice.indexOf(chosenRole1);
            let arrayToUse = "1";

            if (roleIndex == -1) {
                roleIndex = rolesTwoSlice.indexOf(chosenRole2);
                arrayToUse = "2";
            }

            if (roleIndex == -1) {
                await interaction.reply({ 
                    content: 'That is not a valid role. Please look at the autofill menu if you are having trouble!', ephemeral: true 
                });
                return;
            } else {
                if (arrayToUse === "1") {
                    await interaction.reply({ embeds: [
                        RoleEmbed(Object.keys(roledata)[roleIndex])
                    ]});
                    return;
                } else {
                    await interaction.reply({ embeds: [
                        RoleEmbed(Object.keys(roledata)[25 + roleIndex])
                    ]});
                    return;
                }
            }
        } 

        await interaction.reply({ 
            content: 'There was an error with your request. Please try again.', ephemeral: true 
        });
    }
}
