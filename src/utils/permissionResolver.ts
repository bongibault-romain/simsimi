import { ApplicationCommandPermissions, Guild } from "discord.js";
import { getRoles } from "../database/permissions.js";

export async function guildOwner(guild: Guild): Promise<ApplicationCommandPermissions> {
  return { id: guild.ownerId, permission: true, type: "USER" };
}

export async function admins(guild: Guild): Promise<ApplicationCommandPermissions[]> {
  return (await guild.roles.fetch()).filter(role => role.permissions.has("ADMINISTRATOR")).map(role => ({ id: role.id, permission: true, type: "ROLE" }));
}

export async function configAllowedRoles(): Promise<ApplicationCommandPermissions[]> {
  return (await getRoles()).map((id: string) => ({ id, permission: true, type: "ROLE" }));
}