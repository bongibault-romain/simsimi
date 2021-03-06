import { Answer } from "../typing/answer.js";
import { decrypt, encrypt } from "../utils/encryption.js";
import knex from "./knex.js";
import * as questions from "./questions.js";

export async function countAll(): Promise<number> {
    return ((await knex.table("answers").count("* as count"))[0] as any).count;
}

export async function getAllFromQuestion(questionMessage: string): Promise<Answer[]> {
    const question = await questions.get(questionMessage);

    if(!question) return [];

    return decrypt((await knex.select("*").from("answers").where({ question_id: question.id })) as Answer[]);
}

export async function getFromQuestion(questionMessage: string, answerMessage: string): Promise<Answer | null> {
    const question = await questions.get(questionMessage);

    if(!question) return null;

    return knex.select("*").from("answers").where({  message: encrypt(answerMessage), question_id: question.id }).first() || null;
}

export async function addFromQuestion(questionMessage: string, answerMessage: string, authorId: string | null) {
    const question = await questions.get(questionMessage);

    if(!question) throw new Error("Missing question");
    
    return knex.table("answers").insert({
        author_discord_id: authorId,
        message: encrypt(answerMessage),
        question_id: question.id,
    });
}

export async function addFromQuestionId(questionId: number, answerMessage: string, authorId: string | null) {
    return knex.table("answers").insert({
        author_discord_id: authorId,
        message: encrypt(answerMessage),
        question_id: questionId,
    });
}

export async function removeAllFromQuestion(questionMessage: string) {
    const question = await questions.get(questionMessage);

    if(!question) return;

    return knex.table("answers").where({ question_id: question.id }).delete();
}


export async function removeFromQuestion(questionMessage: string, answerMessage: string) {
    const question = await questions.get(questionMessage);

    if(!question) return;

    return knex.table("answers").where({ message: encrypt(answerMessage), question_id: question.id }).delete();
}

export async function existsFromQuestion(questionMessage: string, answerMessage: string) {
    return await getFromQuestion(questionMessage, answerMessage) !== null;
}

export async function countFromQuestion(questionMessage: string): Promise<number> {
    const question = await questions.get(questionMessage);

    if(!question) return 0;

    return ((await knex.table("answers").where({ question_id: question.id }).count("* as count"))[0] as any).count;
}


