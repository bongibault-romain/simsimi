import { Channel, CommandInteraction, Role } from "discord.js";
import { Discord, Permission, Slash, SlashGroup, SlashOption } from "discordx";
import { addChannel, isRegisteredChannel, removeChannel } from "../database/channels.js";
import { addRole, isAllowedRole, removeRole } from "../database/permissions.js";
import { bot } from "../index.js";
import { admins, configAllowedRoles, guildOwner } from "../utils/permissionResolver.js";

@Discord()
@Permission(false)
@Permission(guildOwner)
@Permission(admins)
@Permission(configAllowedRoles)
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
    
      await interaction.deferReply({ephemeral: true});

    if (isRegisteredChannel(channel.id)) {    
      removeChannel(interaction.channel.id); 
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
    
      await interaction.deferReply({ephemeral: true});

    if (!isRegisteredChannel(channel.id)) {    
      addChannel(interaction.channel.id); 
      await interaction.editReply({ content: "Ce salon est maintenant configuré pour répondre aux phrases !" });
    } else 
      await interaction.editReply({ content: "Ce salon était déjà configuré pour répondre aux phrases." });
    
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
    if (autorisation && isAllowedRole(role.id)) {
      await interaction.reply({ content: "Ce role est déjà autorisé à utiliser cette commande !", ephemeral: true }); return;
    }
    if (!autorisation && !isAllowedRole(role.id)) {
      await interaction.reply({ content: "Ce role n'est pas autorisé à utiliser cette commande !", ephemeral: true }); return;
    }

    await interaction.deferReply();

    if (autorisation) { addRole(role.id); await interaction.editReply({ content: "Ce role est maintenant autorisé à utiliser cette commande !" }); }
    else { removeRole(role.id); await interaction.editReply({ content: "Ce role n'est plus autorisé à utiliser cette commande !" }); }

    await this.refreshPermissions(interaction);
  }
}