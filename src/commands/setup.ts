import { Channel, CommandInteraction } from "discord.js";
import { Discord, Permission, Slash, SlashGroup, SlashOption } from "discordx";
import { addChannel, isRegisteredChannel, removeChannel } from "../database/channels.js";
import { admins, guildOwner } from "../utils/permissionResolver.js";

@Discord()
@Permission(false)
@Permission(guildOwner)
@Permission(admins)
@SlashGroup({ description: "Configure le bot", name: "config" })
@SlashGroup({ description: "Configure les permissions de configuration du bot", name: "permission", root: "config" })
@SlashGroup({ description: "Configure les channels où le bot réponds aux messages.", name: "channel", root: "config" })
export class Setup {
  @SlashGroup("channel", "config")
  @Slash("remove", { description: "Configure le bot pour qu'il ne réponde plus à toutes les phrases de un salon" })
  private async remove(
    @SlashOption("channel", { description: "Active ou désactive le bot dans ce salon", required: true, type: "CHANNEL" })
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
  @Slash("add", { description: "Configure le bot pour qu'il réponde à toutes les phrases de un salon" })
  private async add(
    @SlashOption("channel", { description: "Active ou désactive le bot dans ce salon", required: true, type: "CHANNEL" })
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
