import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import LearnError from "../errors/learn/LearnError.js";
import { Emotion } from "../typing/emotion.js";
import { hasNitroEmotes } from "../utils/formatMessages.js";
import learn from "../utils/learn.js";

@Discord()
export abstract class LearnCommand {
  @Slash("learn", { description: "Pour m'apprendre de nouvelles choses ! (Ton identifiant Discord sera enregistré)" })
  private async learn(
    @SlashOption("question", { description: "Phrase à laquelle je dois réagir", required: true, })
    sentence: string,
    @SlashOption("réponse", { description: "Phrase que je répondrai", required: true, })
    answer: string,
    @SlashChoice()
    @SlashChoice({ name: "Amoureux", value: "LOVE" }, { name: "Interrogatif", value: "ASKING" }, { name: "Énervé", value: "ANGRY" }, { name: "Endormi", value: "SLEEPY" }, { name: "Dégouté", value: "DISGUSTED" })
    @SlashOption("émotion", { description: "Réaction que j'aurai face à la question", required: false })
    emotion: Emotion,
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
      await learn(sentence, answer, emotion || null, interaction.user);

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
