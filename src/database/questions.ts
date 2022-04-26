import { Question } from "../typing/question.js";
import knex from "./knex.js";

import { decrypt, encrypt } from "./../utils/encryption.js";

export async function count(): Promise<number> {
  return ((await knex.table("questions").count("* as count"))[0] as any).count;
}

export async function get(question: string): Promise<Question | null> {
  return knex.select("*").from("questions").where({ message: encrypt(question) }).first() || null;
}

export async function exists(question: string) {
    return await get(question) !== null;
}

export async function getAll(): Promise<Question[]> {
    return decrypt((await knex.select("*").from("questions")) as Question[]);
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
        message: encrypt(question),
    }))[0];
}

export async function remove(question: string) {
    return knex.table("questions").where({ message: encrypt(question) }).delete();
}