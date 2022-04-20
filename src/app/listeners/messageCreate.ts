import { Message, MessageEmbed } from "discord.js";
import Listener from "../../listeners/listener";

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
    }
  }
}
