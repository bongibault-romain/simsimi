import { Interaction } from "discord.js";
import { Client } from "discordx";
import { getHorodateConsole } from "./horodatage.js";

export default function logInteraction(interaction: Interaction, client: Client) {
    let log = `${getHorodateConsole()}\t${interaction.guild?.name}\t${interaction.user.username}\t${interaction.type}`;

    if (interaction.isCommand())
        log += `\t${interaction.commandName}`;

    if (interaction.isMessageComponent()) {
        log += `\t${interaction.customId}`;

        if (interaction.isSelectMenu())
            log += `\t${interaction.values}`;
    }

    if (interaction.isContextMenu()) {
        log += `\t${interaction.commandName}`;

        if (interaction.targetType === "USER")
            log += `\t${client.users.resolve(interaction.targetId)?.username}`;
        else if (interaction.targetType === "MESSAGE")
            log += `\t${interaction.targetId}`;
    }

    return log;
}