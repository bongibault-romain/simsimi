import { CommandInteraction } from "discord.js";
import { Discord, Permission, Slash, SlashGroup, SlashOption } from "discordx";
import { addChannel, isRegisteredChannel, removeChannel } from "../database/settings.js";
import { bot } from "../index.js";
import { admins, configAllowedRoles, guildOwner } from "../utils/permissionResolver.js";

@Discord()
@Permission(false)
@Permission(guildOwner)
@Permission(admins)
@Permission(configAllowedRoles)
@SlashGroup({ description: "Configure le bot", name: "config" })
@SlashGroup("config")
export class Setup {
  @Slash("here", { description: "Configure le bot pour qu'il réponde à toutes les phrases de ce salon" })
  private async here(
    @SlashOption("activation", { description: "Active ou désactive le bot dans ce salon", type: "BOOLEAN" })
    enable = true,
    interaction: CommandInteraction) {
    if (!interaction.channel) { await interaction.reply({ content: "Tu dois être dans un salon pour utiliser cette commande !", ephemeral: true }); return; }
    if (enable && isRegisteredChannel(interaction.channel?.id)) {
      await interaction.reply({ content: "Ce salon est déjà configuré pour répondre aux phrases !", ephemeral: true }); return;
    }
    if (!enable && !isRegisteredChannel(interaction.channel?.id)) {
      await interaction.reply({ content: "Ce salon n'est pas configuré pour répondre aux phrases !", ephemeral: true }); return;
    }

    await interaction.deferReply();

    if (enable) { addChannel(interaction.channel.id); await interaction.editReply({ content: "Ce salon est maintenant configuré pour répondre aux phrases !" }); }
    else { removeChannel(interaction.channel.id); await interaction.editReply({ content: "Ce salon n'est plus configuré pour répondre aux phrases !" }); }
  }

  @Slash("refreshpermissions", { description: "Réactualise les permissions du bot" })
  private async refreshPermissions(interaction: CommandInteraction) {
    await interaction.deferReply();

    await bot.initApplicationPermissions();

    await interaction.editReply({ content: "Je viens de réactualiser les permissions requises pour les commandes !" });
  }
}