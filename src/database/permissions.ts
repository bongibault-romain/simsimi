import knex from "./knex.js";

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