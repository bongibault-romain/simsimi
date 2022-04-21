import { Message, MessageEmbed } from "discord.js";
import { strictExists, get, exists } from "../../database/sentences";
import { getSimsimiChannelId } from "../../database/settings";
import Listener from "../../listeners/listener";
import { format } from "../../utils/format";
import learn from "../../utils/learn";

export default class MessageCreate extends Listener<"messageCreate"> {
  public get name(): "messageCreate" {
    return "messageCreate";
  }

  public async run(message: Message<boolean>): Promise<any> {
    if (this.bot.client.user) {
      if (!message.reference) {
        if (message.mentions.users.has(this.bot.client.user.id)) {
          await message.react("💬");

          await message.channel.send({
            embeds: [
              new MessageEmbed()
                .setTitle("Salut " + message.member?.user.username + " !")
                .setColor("#ffcc00")
                .setDescription(
                  "Tu cherches une liste des commandes ?" +
                    "\n" +
                    "Tapes ``/`` pour trouver ton bonheur !" +
                    "\n" +
                    "" +
                    "\n" +
                    "Tu ne peux pas encore discuter avec moi sur ce serveur car les administrateurs n'ont pas encore défini de **salon Simsimi** !" +
                    "\n" +
                    "Il peut être défini à l'aide de la commande ``/setup here``" +
                    "\n" +
                    "" +
                    "\n" +
                    "En attendant, tu peux me parler par messages privés." +
                    "\n" +
                    "" +
                    "\n" +
                    "Mon fonctionnement est simple : n'importe qui peut m'apprendre quoi répondre à n'importe quel message !" +
                    "\n" +
                    "Tu peux donc tomber sur **n'importe quoi** ! Fais attention !" +
                    "\n" +
                    "" +
                    "\n" +
                    "Si tu rencontres un message que tu juges inapproprié, tu peux le signaler à mon créateur **M0NS#3608**."
                )
                .setFooter({
                  text:
                    "Je suis présent sur " +
                    this.bot.client.guilds.cache.size +
                    " serveurs !" +
                    " Il y a plus de " +
                    this.bot.client.guilds.cache
                      .map((g) => g.memberCount)
                      .reduce((a, b) => a + b) +
                    " membres sur tous ces serveurs !",
                }),
            ],
          });
        }
      }

      if (
        !message.author.bot &&
        message.guildId &&
        !message.content.includes("@")
      ) {
        if (message.channelId == (await getSimsimiChannelId(message.guildId))) {
          if (
            message.reference &&
            message.reference.messageId &&
            message.reference.channelId &&
            message.reference.guildId
          ) {
            const fastLearn = this.bot.commandManager.getFastLearn(
              message.reference.messageId
            );

            if (fastLearn) {
              const answerChannel = this.bot.client.guilds
                .resolve(message.reference.guildId)
                ?.channels.resolve(message.reference.channelId);

              if (answerChannel?.isText()) {
                let anwser = message.content;

                learn(fastLearn.question, anwser)
                  .then((embed) => {
                    message.reply({
                      embeds: [embed]
                    })
                  })

                this.bot.commandManager.removeFastLearn(
                  message.reference.messageId
                );
                return;
              }
            }
          }

          if (await exists(format(message.content))) {
            const responses = await get(format(message.content));

            message.reply({
              content:
                responses[Math.round(Math.random() * (responses.length - 1))],
            });
          } else {
            const fastLearnMessage = await message.reply({
              embeds: [
                new MessageEmbed()
                  .setTitle(["Hey ", message.author.username, " !"].join(""))
                  .setColor("#3333ff")
                  .setDescription(
                    "Je ne sais pas quoi répondre à cela. Peux-tu me l'apprendre ?" +
                      "\n" +
                      "" +
                      "\n" +
                      "**Méthode rapide** : Réponds à ce message en y écrivant la réponse de ton message pour me l'apprendre." +
                      "\n" +
                      "" +
                      "\n" +
                      "Sinon, utilises ``/learn`` !"
                  ),
              ],
            });

            this.bot.commandManager.addFastLearn(
              format(message.content),
              fastLearnMessage.id
            );
          }
        }
      }
    }
  }
}
