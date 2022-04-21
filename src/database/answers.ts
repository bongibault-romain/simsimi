import knex from "./knex.js";

export async function count() {
    return ((await knex.table("answers").count("* as count"))[0] as any).count;
}