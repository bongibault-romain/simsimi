import knex from "./knex.js";

export interface Question {
    id: number;
    message: string;
    author_discord_id: string;
    created_at: Date;
}

// TODO: ENCODE AND DECODE

export async function count(): Promise<number> {
  return ((await knex.table("questions").count("* as count"))[0] as any).count;
}

export async function get(question: string): Promise<Question | null> {
  return knex.select("*").from("questions").where({ message: Buffer.from(question, "utf8").toString("base64") }).first() || null;
}

export async function exists(question: string) {
    return await get(question) !== null;
}

export async function getAll(): Promise<Question[]> {
    return knex.select("*").from("questions");
}

/**
 * 
 * @param question 
 * @param authorId 
 * @returns {number} Question Id
 */
export async function add(question: string, authorId: string | null): Promise<number> {
    return (await knex.table("questions").insert({ 
        author_discord_id: authorId,
        message: Buffer.from(question, "utf8").toString("base64"),
    }))[0];
}

export async function remove(question: string) {
    return knex.table("questions").where({ message: Buffer.from(question, "utf8").toString("base64") }).delete();
}