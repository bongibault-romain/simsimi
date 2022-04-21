import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import LearnError from "../errors/learn/LearnError.js";
import { hasNitroEmotes } from "../utils/formatMessages.js";
import learn from "../utils/learn.js";

@Discord()
export abstract class learnCommand {
  @Slash("learn", { description: "Apprends à réagir à une phrase" })
  private async learn(
    @SlashOption("question", { description: "Phrase à laquelle je dois réagir" })
    sentence: string,
    @SlashOption("réponse", { description: "Phrase par laquelle je devrais répondre" })
    answer: string,
    interaction: CommandInteraction
  ) {
    if (!sentence || !answer) {
      await interaction.reply({ content: "Tu dois préciser une phrase à laquelle je dois réagir et une phrase par laquelle je devrais répondre !", ephemeral: true });
      return;
    }

    await interaction.deferReply({
      ephemeral: true,
    });

    try {
      await learn(sentence, answer, interaction.user);

      const responseEmbed = new MessageEmbed()
        .setTitle("Merci pour ton aide !")
            .setDescription("Je viens d'apprendre une nouvelle phrase.")
            .setFields([
              {
                inline: true,
                name: "Lorsque l'on me dira",
                value: sentence,
              },
              {
                inline: true,
                name: "Je répondrai peut-être",
                value: answer,
              }
            ])
            .setColor("#ffcc00");

      if(hasNitroEmotes(answer)) 
        responseEmbed.setFooter({
          text: "Attention, ton message contient un emoji Discord : Il risque de ne pas bien s'afficher par la suite."
        });
      


      await interaction.editReply({
        embeds: [ responseEmbed]
      });
    } catch (e) {
      if (e instanceof LearnError) 
        return interaction.editReply(e.message);
      
      console.error(e);
    }
  }
}