import { dirname } from "@discordx/importer";
import * as fs from "fs";
import path from "path";
import knex from "./knex.js";

export const IDsFilePath = path.join(dirname(import.meta.url), "../../data/IDs.json");
fs.existsSync(path.join(IDsFilePath, "../")) || fs.mkdirSync(path.join(IDsFilePath, "../"));
fs.existsSync(IDsFilePath) || fs.writeFileSync(IDsFilePath, JSON.stringify({ channels: [], configAllowedRoles: [], guilds: [] }));

export async function addRole(roleId: string) {
  return knex.table("permissions").insert({
    role_discord_id: roleId
  });
}

export async function removeRole(roleId: string) {
  return knex.table("permissions").where({
    role_discord_id: roleId,
  }).delete();
}

export async function getRoles(): Promise<string[]> {
  return (await knex.select("*").from("permissions")).map((row: any) => row.role_discord_id);
}

export async function isAllowedRole(roleId: string): Promise<boolean> {
  return (await knex.table("permissions").where({
    role_discord_id: roleId,
  })).length > 0;
}