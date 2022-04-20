import {
  CommandInteraction,
  CacheType,
  Client,
  MessageEmbed,
  Permissions,
} from "discord.js";
import Command from "../../commands/command";
import { CommandParameter } from "../../commands/commandParameter";
import { exists, get } from "../../database/sentences";
import {
  getSimsimiChannelId,
  getSimsimiMessageId,
  setSimsimiChannelId,
} from "../../database/settings";
import { format, isVoid } from "../../utils/format";
import learn from "../../utils/learn";

export default class SetUpCommand extends Command {
  public get name(): string {
    return "setup";
  }

  public get description(): string {
    return "Learn a new command";
  }

  public get parameters(): CommandParameter[] {
    return [
      {
        name: "here",
        description: "Setup the SimSimi channel here.",
        type: "SUB_COMMAND",
        required: true,
      },
      {
        name: "remove",
        description: "Remove the SimSimi channel from your server.",
        type: "SUB_COMMAND",
        required: true,
      },
    ];
  }

  public async run(
    interaction: CommandInteraction<CacheType>,
    client: Client<boolean>
  ): Promise<any> {
    if (interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
      if (interaction.options.getSubcommand(true) == "here") {
        return await this.here(interaction);
      } else if (interaction.options.getSubcommand(true) == "remove") {
        return await this.remove(interaction);
      }
    } else {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Oups !")
            .setColor("#cc0000")
            .setDescription(
              "Seuls les administrateurs du serveur peuvent exécuter cette commande."
            ),
        ],
      });
    }
  }

  private async remove(interaction: CommandInteraction) {
    if (interaction.guildId) {
      const interactionChannelId = await getSimsimiChannelId(
        interaction.guildId
      );

      if (interactionChannelId) {
        const oldMessageId = await getSimsimiMessageId(interaction.guildId);

        const oldChannel =
          interaction.guild?.channels.resolve(interactionChannelId);

        if (oldChannel?.isText() && oldMessageId) {
          oldChannel.messages.resolve(oldMessageId)?.delete();
        }

        await setSimsimiChannelId(interaction.guildId, null, null);

        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Suppression effectuée !")
              .setColor("#33cc00")
              .setDescription(
                [
                  "Je ne pourrai plus discuter avec les membres dans le salon **",
                  oldChannel,
                  "**.",
                ].join("")
              ),
          ],
        });
      }
    }
  }

  private async here(interaction: CommandInteraction) {
    if (interaction.guildId) {
      const interactionChannelId = await getSimsimiChannelId(
        interaction.guildId
      );

      if (interactionChannelId == interaction.channelId) {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Oups !")
              .setColor("#cc0000")
              .setDescription("Le salon Simsimi est déjà défini à celui-ci !"),
          ],
        });
      } else {
        const oldMessageId = await getSimsimiMessageId(interaction.guildId);

        if (interactionChannelId) {
          const oldMessageChannel =
            interaction.guild?.channels.resolve(interactionChannelId);

          if (oldMessageChannel?.isText() && oldMessageId) {
            await oldMessageChannel.messages.resolve(oldMessageId)?.delete();
          }
        }

        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Modification effectuée !")
              .setColor("#33cc00")
              .setDescription(
                [
                  "Désormais, je discuterai avec les membres dans **",
                  interaction.channel,
                  "** !",
                ].join("")
              ),
          ],
          ephemeral: true,
        });

        if (interaction.channel) {
          const newMessage = await interaction.channel.send({
            embeds: [
              new MessageEmbed()
                .setTitle("Bonjour !")
                .setColor("#ffcc00")
                .setDescription(
                  "Je suis **Simsimi**. Discutons ensemble !" +
                    "\n" +
                    "Il te suffit d'envoyer des messages dans ce salon." +
                    "\n" +
                    "" +
                    "\n" +
                    "Tu peux aussi m'apprendre de nouvelles choses !" +
                    "\n" +
                    "Utilises ``/learn`` pour m'apprendre quoi répondre à la phrase que tu souhaites." +
                    "\n" +
                    "" +
                    "\n" +
                    "Attention, tu peux tomber sur **n'importe quoi** !" +
                    "\n" +
                    "Sois averti. Si tu constates une réponse qui n'aurait pas lieu d'être, contacte mon créateur **M0NS#3608** "
                ),
            ],
          });

          await newMessage.pin();

          await setSimsimiChannelId(
            interaction.guildId,
            interaction.channelId,
            newMessage.id
          );
        }
      }
    }
  }
}
