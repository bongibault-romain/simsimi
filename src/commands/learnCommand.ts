import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import LearnError from "../errors/learn/LearnError.js";
import { hasNitroEmotes } from "../utils/formatMessages.js";
import learn from "../utils/learn.js";

@Discord()
export abstract class learnCommand {
  @Slash("learn")
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

    await interaction.deferReply();

    try {
      learn(sentence, answer);
      await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("Merci !")
            .setDescription(`Je viens de m'apprendre à répondre à \`${sentence}\` par \`${answer}\` !
            
            ${hasNitroEmotes(answer) ? "**Attention, ton message contient un emoji Discord : Il risque de ne pas bien s'afficher par la suite.**" : ""}`)
            .setColor("#ffcc00"),
        ]
      });
    } catch (e) {
      if (e instanceof LearnError) 
        await e.replyToUser(interaction);
      
      console.error(e);
    }
  }
}