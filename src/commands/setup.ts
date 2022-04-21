import { CommandInteraction, Role } from "discord.js";
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
@SlashGroup({ description: "Configure les salons du bot", name: "channel", root: "config" })
@SlashGroup({ description: "Configure les permissions de configuration du bot", name: "permission", root: "config" })
export class Setup {
  @SlashGroup("channel","config")
  @Slash("here", { description: "Configure le bot pour qu'il réponde à toutes les phrases de ce salon" })
  private async here(
    @SlashOption("activation", { description: "Active ou désactive le bot dans ce salon", required: false, type: "BOOLEAN" })
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

  private async refreshPermissions(interaction: CommandInteraction) {
    await interaction.deferReply();

    await bot.initApplicationPermissions();

    await interaction.editReply({ content: "Je viens de réactualiser les permissions requises pour les commandes !" });
  }

  @SlashGroup("permission", "config")
  @Slash("role", { description: "Configure les permissions requises pour un role" })
  private async role(
    @SlashOption("role", { description: "Le role à configurer" })
    role: Role,
    @SlashOption("autorisation", { description: "Autorise ou non le role à utiliser la commande", required: true })
    autorisation: boolean,
    interaction: CommandInteraction) {
    if (!role) { await interaction.reply({ content: "Tu dois mentionner un role pour utiliser cette commande !", ephemeral: true }); return; }
    if (autorisation && isRegisteredChannel(role.id)) {
      await interaction.reply({ content: "Ce role est déjà autorisé à utiliser cette commande !", ephemeral: true }); return;
    }
    if (!autorisation && !isRegisteredChannel(role.id)) {
      await interaction.reply({ content: "Ce role n'est pas autorisé à utiliser cette commande !", ephemeral: true }); return;
    }

    await interaction.deferReply();

    if (autorisation) { addChannel(role.id); await interaction.editReply({ content: "Ce role est maintenant autorisé à utiliser cette commande !" }); }
    else { removeChannel(role.id); await interaction.editReply({ content: "Ce role n'est plus autorisé à utiliser cette commande !" }); }

    await this.refreshPermissions(interaction);
  }
}