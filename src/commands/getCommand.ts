import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { getAllFromQuestion } from "../database/answers.js";
import { format } from "../utils/formatMessages.js";

@Discord()
export class Get {

    @Slash("get", {
        description: "Pour observer les réponses d'une question.",
    })
    public async get(
        @SlashOption("question", {
            description: "Question à laquelle je dois obtenir les réponses.",
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
                        .setTitle("Voici les réponses possibles pour cette question :")
                        .setDescription(answers.map(a => `- \`${a.message}\` (${a.id})`).join("\n"))
                        .setColor("AQUA"),
                ]
            });
         else 
            interaction.editReply("Aucune réponse n'a été trouvée pour cette question.");
        

    }

}
