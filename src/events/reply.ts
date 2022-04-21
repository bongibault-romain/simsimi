import { MessageEmbed } from "discord.js";
import { ArgsOf, Client, Discord, On } from "discordx";
import { get } from "../database/sentences.js";
import { isRegisteredChannel } from "../database/settings.js";
import { format } from "../utils/formatMessages.js";

@Discord()
abstract class Reply {
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
      })
    }

    if (!message.author.bot && message.guildId && !message.content.includes('@')) {
      if (await isRegisteredChannel(message.channelId)) {
        const formatedMessage = format(message.content, { toLowerCase: true });
        if (!formatedMessage) return;
        const answers = await get(formatedMessage);

        console.log(answers);

        if (answers) { await message.reply(answers[Math.round(Math.random() * (answers.length - 1))]); return; }

        await message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle(`Hey ${message.author.username} !`)
              .setDescription(`Je ne sais pas quoi répondre à cela. Peuxtu me l'apprendre ?

              **Méthode rapide** : Réponds à ce message en y écrivant la réponse de ton message pour me l'apprendre.

              Sinon, utilises \`\`/learn\`\` !`)
              .setColor("#3333ff")
          ]
        });
      }
    }
  }
}