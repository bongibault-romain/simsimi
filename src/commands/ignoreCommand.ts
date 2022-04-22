import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { add, exists, remove } from "../database/ingored_users.js";

@Discord()
export class Ingore {

    @Slash("ignore", { description: "Te permet d'être ignoré par moi-même." })
    public async ignore(interaction: CommandInteraction) {

        await interaction.deferReply({
            ephemeral: true,
        });

        if(await exists(interaction.user.id)) {
            await remove(interaction.user.id);
            await interaction.editReply({ content: "Vous n'êtes plus ignoré par le bot." });
        } else {
            await add(interaction.user.id);
            await interaction.editReply({ content: "Vous êtes ignoré par le bot." });
        }
    }

}
