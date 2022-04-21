import { MessageEmbed } from "discord.js";
import { ArgsOf, Client, Discord, On } from "discordx";
import { get } from "../database/sentences.js";
import { isRegisteredChannel } from "../database/settings.js";
import LearnError from "../errors/learn/LearnError.js";
import { format, hasNitroEmotes } from "../utils/formatMessages.js";
import learn from "../utils/learn.js";

@Discord()
export abstract class Reply {
  @On("messageCreate")
  private async reply(
    [message]: ArgsOf<"messageCreate">,
    bot: Client
  ) {
    if (!bot.user) return;

    if (!message.reference && message.mentions.users.has(bot.user.id)) {
      await message.react("💬");

      await message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Salut ${message.member?.user.username} !`)
            .setDescription(`Tu cherches une liste des commandes ?
            Tapes \`/\` pour trouver ton bonheur !

            Tu ne peux pas encore discuter avec moi sur ce serveur car les administrateurs n'ont pas encore défini de **salon Simsimi** !
            Il peut être défini à l'aide de la commande \`\`/setup here\`\` !

            En attendant, tu peux me parler par messages privés !

            Mon fonctionnement est simple: n'importe qui peut m'apprendre quoi répondre à n'importe quel message !

            Tu peux donc tomber sur **n'importe quoi** ! Fais attention !

            Si tu rencontres un message que tu juges inapproprié, tu peux le signaler à mon créateur <@238684010182606850> !`)
            .setFooter({
              text: `Je suis présent sur ${bot.guilds.cache.size} serveurs ! Il y a plus de ${bot.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} membres sur tous ces serveurs !`,
            })
            .setColor("#ffcc00"),
        ]
      });
    }

    if (!message.author.bot && message.guildId && !message.content.includes("@")) 
      if (await isRegisteredChannel(message.channelId)) {
        if (message.type === "REPLY" && message.reference && message.reference.messageId) {
          const botMessage = await message.channel.messages.fetch(message.reference.messageId);

          if (!botMessage.reference?.messageId || !botMessage.author.bot || !botMessage.embeds[0]?.description?.endsWith("``fastlearn``")) return;

          const fastLearnSentence = await message.channel.messages.fetch(botMessage.reference.messageId);

          if (!fastLearnSentence) { await message.reply("Je ne peux pas répondre à ce message car il a été supprimé !"); return; }

          try {
            learn(fastLearnSentence.content, message.content);
            await message.reply({
              embeds: [
                new MessageEmbed()
                  .setTitle("Merci !")
                  .setDescription(`Je viens de m'apprendre à répondre à \`${fastLearnSentence.content}\` par \`${message.content}\` !
                  
                  ${hasNitroEmotes(message.content) ? "**Attention, ton message contient un emoji Discord : Il risque de ne pas bien s'afficher par la suite.**" : ""}`)
                  .setColor("#ffcc00"),
              ]
            });
          } catch (e) {
            console.error(e);
            if (e instanceof LearnError) { await e.replyToUser(message); return; }
            console.error(e); return;
          }

        }

        if (message.reference) return;

        const formatedMessage = format(message.content, { toLowerCase: true });
        if (!formatedMessage) return;
        const answers = get(formatedMessage);

        if (answers) { await message.reply(answers[Math.round(Math.random() * (answers.length - 1))]); return; }

        await message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(`Hey ${message.author.username} !`)
              .setDescription(`Je ne sais pas quoi répondre à cela. Peux-tu me l'apprendre ?

              **Méthode rapide** : Réponds à ce message en y écrivant la réponse de ton message pour me l'apprendre.

              Sinon, utilises \`\`/learn\`\` !
              
              \`\`fastlearn\`\``)
              .setColor("#3333ff")
          ]
        });
      }
    
  }
}