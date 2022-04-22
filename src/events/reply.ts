import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ArgsOf, Client, Discord, On } from "discordx";
import { get } from "../database/sentences.js";
import { isRegisteredChannel } from "../database/channels.js";
import LearnError from "../errors/learn/LearnError.js";
import { format, hasNitroEmotes } from "../utils/formatMessages.js";
import learn from "../utils/learn.js";
import * as fastlearn from "../stores/fastlearn.js";
import { getEmotionEmoji } from "../utils/emotion.js";
import * as questions from "./../database/questions.js";
import * as answers from "./../database/answers.js";
import { getHorodateConsole } from "../utils/horodatage.js";

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

      const button = new MessageButton().setLabel("Invite moi sur ton serveur !").setURL("https://discord.com/api/oauth2/authorize?client_id=842013575341801483&permissions=412317215808&scope=bot%20applications.commands").setStyle("LINK");

      await message.channel.send({
        components: [
          new MessageActionRow().setComponents(button)
        ],
        embeds: [
          new MessageEmbed()
            .setTitle(`Salut ${message.member?.displayName} !`)
            .setDescription(`Tu cherches une liste des commandes ?
            Tapes \`/\` pour trouver ton bonheur !

            Tu ne peux pas encore discuter avec moi sur ce serveur car les administrateurs n'ont pas encore défini de **salon Simsimi** !
            Pour définir ce salon il faut contacter les gérants du bot  <@238684010182606850> et <@276084901583781888> (temporaire).

            En attendant, tu peux me parler par messages privés !

            Mon fonctionnement est simple: n'importe qui peut m'apprendre quoi répondre à n'importe quel message !

            Tu peux donc tomber sur **n'importe quoi** ! Fais attention !

            Si tu rencontres un message que tu juges inapproprié, tu peux le signaler à mes créateurs <@238684010182606850> et <@276084901583781888> !`)
            .setFooter({
              text: `Je suis présent sur ${bot.guilds.cache.size} serveurs ! Il y a plus de ${bot.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} membres sur tous ces serveurs !`,
            })
            .setColor("#ffcc00"),
        ],
      });
    }

    if(message.reference && !message.author.bot && !message.content.includes("@") && message.content.length > 0 && message.reference.messageId) {
      const channel = (await bot.channels.fetch(message.reference.channelId));

      if(channel?.isText()) {
        const replyTo = await channel.messages.fetch(message.reference.messageId );


        if(format(replyTo.content).length > 0 && !format(replyTo.content).includes("@") && !replyTo.author.bot) {


          const q = await questions.get(format(replyTo.content));
          let qId = q?.id;

          if(!qId) 
            qId = await questions.add(format(replyTo.content), null);          

          await answers.addFromQuestionId(qId, format(message.content), null);

          console.log(`${getHorodateConsole()}\t[INFO]\tLearn from public channel !`);
        }
      }
    }

    if (!message.author.bot && message.guildId && !message.content.includes("@")) 
      if (await isRegisteredChannel(message.channelId)) {
        if (message.type === "REPLY" && message.reference && message.reference.messageId) {
          const fastlearnData = fastlearn.get(message.reference.messageId);

          if (fastlearnData) 

            try {
              await learn(fastlearnData.question, message.content, null, message.author);

              await message.reply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Merci !")
                    .setDescription(`Je viens de m'apprendre à répondre à \`${fastlearnData.question}\` par \`${message.content}\` !
                    
                    ${hasNitroEmotes(message.content) ? "**Attention, ton message contient un emoji Discord : Il risque de ne pas bien s'afficher par la suite.**" : ""}`)
                    .setColor("#ffcc00"),
                ]
              });

              fastlearn.remove(message.reference.messageId);
              return;
            } catch (e) {
              console.error(e);
              if (e instanceof LearnError) { await e.replyToUser(message); return; }
              console.error(e); return;
            }
          
        
        }

        if (message.reference?.messageId && !message.channel.messages.resolve(message.reference.messageId)?.author.bot) return;

        const formatedMessage = format(message.content, { toLowerCase: true });
        if (!formatedMessage) return;
        const answers_ = await get(formatedMessage);

        if (answers_) { 
          const answer = answers_[Math.round(Math.random() * (answers_.length - 1))];

          const reaction = getEmotionEmoji(answer.emotion);
          if(reaction)
            await message.react(reaction);

          await message.channel.sendTyping();

          setTimeout(async () => {
            await message.reply({
              content: answer.message,
            }); 
          }, answer.message.length * 10 < 2000 ? answer.message.length * 10 : 2000);
            
          return;
        }

        const fastlearnMessage = await message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(`Hey ${message.member?.displayName} !`)
              .setDescription(`Je ne sais pas quoi répondre à cela. Peux-tu me l'apprendre ?

              **Méthode rapide** : Réponds à ce message en y écrivant la réponse de ton message pour me l'apprendre.

              Sinon, utilises \`\`/learn\`\` !`)
              .setColor("#3333ff")
          ]
        });

        fastlearn.add(fastlearnMessage.id, message.content);
      }
    
  }
}
