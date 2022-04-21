import knex from "./knex.js";

export interface Question {
    id: number;
    message: string;
    author_discord_id: string;
    created_at: Date;
}

export async function count(): Promise<number> {
  return ((await knex.table("questions").count("* as count"))[0] as any).count;
}

export async function get(question: string): Promise<Question | null> {
  return knex.select("*").from("questions").where({ message: question }).first() || null;
}

export async function getAll(): Promise<Question[]> {
    return knex.select("*").from("questions");
}

export async function add(question: string, authorId: string) {
    return knex.table("questions").insert({ 
        author_discord_id: authorId,
        message: question, 
    });
}

export async function remove(question: string) {
    return knex.table("questions").where({ message: question }).delete();
}