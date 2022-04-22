import { Channel, CommandInteraction } from "discord.js";
import { Discord, Permission, Slash, SlashGroup, SlashOption } from "discordx";
import { addChannel, isRegisteredChannel, removeChannel } from "../database/channels.js";
import { admins, guildOwner } from "../utils/permissionResolver.js";

@Discord()
@Permission(false)
@Permission(guildOwner)
@Permission(admins)
@SlashGroup({ description: "Pour configurer mes différents paramètres.", name: "config" })
@SlashGroup({ description: "Pour configurer les salons dans lesquels je pourrai interagir avec les membres.", name: "channel", root: "config" })
export class Setup {
  @SlashGroup("channel", "config")
  @Slash("remove", { description: "Pour définir les salons dans lesquels je peux interagir avec les membres." })
  private async remove(
    @SlashOption("channel", { description: "Salon dans lequel tu veux que je n'intéragisse plus avec les membres.", required: true, type: "CHANNEL" })
    channel: Channel,
    interaction: CommandInteraction) {
    if (!interaction.channel) { await interaction.reply({ content: "Tu dois être dans un salon pour utiliser cette commande !", ephemeral: true }); return; }

    await interaction.deferReply({ ephemeral: true });

    if (await isRegisteredChannel(channel.id)) {
      await removeChannel(channel.id);
      await interaction.editReply({ content: "Ce salon n'est plus configuré pour répondre aux phrases !" });
    } else
      await interaction.editReply({ content: "Ce salon n'était pas configuré pour répondre aux phrases." });

  }
  @SlashGroup("channel", "config")
  @Slash("add", { description: "Salon dans lequel tu veux que j'interagisse avec les membres." })
  private async add(
    @SlashOption("channel", { description: "Salon dans lequel tu veux que j'intéragisse avec les membres.", required: true, type: "CHANNEL" })
    channel: Channel,
    interaction: CommandInteraction) {
    if (!interaction.channel) { await interaction.reply({ content: "Tu dois être dans un salon pour utiliser cette commande !", ephemeral: true }); return; }

    if (!channel.isText()) { await interaction.reply({ content: "Tu dois sélectonner un salon textuel !", ephemeral: true }); return; }

    await interaction.deferReply({ ephemeral: true });

    if (!(await isRegisteredChannel(channel.id))) {
      await addChannel(channel.id);
      await interaction.editReply({ content: "Ce salon est maintenant configuré pour répondre aux phrases !" });
    } else
      await interaction.editReply({ content: "Ce salon était déjà configuré pour répondre aux phrases." });

  }
}
