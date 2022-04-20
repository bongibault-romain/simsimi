import { Client, MessageEmbed } from "discord.js";
import Listener from "../../listeners/listener";

export default class Ready extends Listener<"ready"> {
  public get name(): "ready" {
    return "ready";
  }

  public async run(client: Client<true>): Promise<any> {
      console.log('ready');
    client.user?.setPresence({
      status: "online",
      activities: [
        {
          name: "vos messages !",
          type: "LISTENING",
        },
      ],
    });

    console.log(this.bot.client.guilds.cache.forEach(g => console.log(g.name)) )

    // let c = this.bot.client.guilds.resolve('848281422427193374')?.channels.resolve('966367568803823646');
    // if(c?.isText()) c.send('Mais t\'es conne ou quoi ?')

    const members = client.guilds.cache
      .map((g) => g.memberCount)
      .reduce((a, b) => a + b);


      const embed = {
        embeds: [
          new MessageEmbed()
            .setTitle("Toc Toc !")
            .setColor("#33cc00")
            .setDescription("Coucou M0NS, je suis réveillé (une nouvelle fois) !")
            .setFields({
              name: "Nombre de membres",
              value:
                "Je suis présent sur des serveurs avec : **" +
                members +
                "** membres",
            }),
        ],
      };
      
    (await client.users.fetch('238684010182606850')).send(embed);
    (await client.users.fetch('276084901583781888')).send(embed);
    (await client.users.fetch('419034807830315011')).send('Je t\'aime! <3');
  }
}
