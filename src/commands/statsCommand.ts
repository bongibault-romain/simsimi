import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash } from "discordx";
import * as answers from "../database/answers.js";
import * as questions from "../database/questions.js";

@Discord()
export abstract class StatsCommand {

    @Slash("stats", { description: "Pour afficher mes différentes statistiques." })
    private async stats(interaction: CommandInteraction) {

        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Quelques Statistiques")
                    .setDescription(`Je connais **${await questions.count()}** questions et **${await answers.countAll()}** réponses.`)
                    .setColor("#3333ff")
            
                ],
        });
    }

}
