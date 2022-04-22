import knex from "./knex.js";

export async function exists(userId: string) {
    return (await knex.select("*").from("ignored_users").where({ user_discord_id: userId }).first()) !== undefined;
}

export async function add(userId: string) {
    return knex.table("ignored_users").insert({
        user_discord_id: userId
    });
}

export async function remove(userId: string) {
    return knex.table("ignored_users").where({
        user_discord_id: userId
    }).delete();
}