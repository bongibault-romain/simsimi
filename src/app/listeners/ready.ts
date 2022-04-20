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

    const members = client.guilds.cache
      .map((g) => g.memberCount)
      .reduce((a, b) => a + b);

    (await client.users.fetch('238684010182606850')).send({
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
    });
  }
}
