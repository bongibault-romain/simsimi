import { ApplicationCommandPermissions, Guild } from "discord.js";
import * as fs from "fs";
import { IDsFilePath } from "../database/settings.js";

export async function guildOwner(guild: Guild): Promise<ApplicationCommandPermissions> {
  return { id: guild.ownerId, permission: true, type: "USER" };
}

export async function admins(guild: Guild): Promise<ApplicationCommandPermissions[]> {
  return (await guild.roles.fetch()).filter(role => role.permissions.has("ADMINISTRATOR")).map(role => ({ id: role.id, permission: true, type: "ROLE" }));
}

export function configAllowedRoles(): Promise<ApplicationCommandPermissions[]> {
  return JSON.parse(fs.readFileSync(IDsFilePath, "utf-8")).configAllowedRoles.map((id: string) => ({ id, permission: true, type: "ROLE" }));
}