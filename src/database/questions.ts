import knex from "./knex.js";

export async function count() {
    return ((await knex.table("questions").count("* as count"))[0] as any).count;
}