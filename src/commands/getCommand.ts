import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { getAllFromQuestion } from "../database/answers.js";
import { format } from "../utils/formatMessages.js";

@Discord()
export class Get {

    @Slash("get", {
        description: "Permet de récupérer toutes les réponses à une question",
    })
    public async get(
        @SlashOption("question", {
            required: true,
            type: "STRING",
        })
        question: string,
        interaction: CommandInteraction
    ) {
        await interaction.deferReply({
            ephemeral: true,
        });

        const answers = await getAllFromQuestion(format(question, { toLowerCase: true }));

        if(answers.length > 0) 
            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Voici les réponses possible pour cette question :")
                        .setDescription(answers.map(a => `- \`${a.message}\` (${a.id})`).join("\n"))
                        .setColor("AQUA"),
                ]
            });
         else 
            interaction.editReply("Aucune réponse n'a été trouvée pour cette question.");
        

    }

}