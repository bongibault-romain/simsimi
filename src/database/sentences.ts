import path from "path";
import * as fs from "fs";
import stringSimilarity from "string-similarity";
import { dirname } from "@discordx/importer";
import knex from "./knex.js";

const sentencesFilePath = path.join(dirname(import.meta.url), "../../data/sentences.json");
fs.existsSync(path.join(sentencesFilePath, "../")) || fs.mkdirSync(path.join(sentencesFilePath, "../"));
fs.existsSync(sentencesFilePath) || fs.writeFileSync(sentencesFilePath, "{}");

export async function add(sentence: string, answer: string, authorId: string) {
  let rawQuestion = await knex.select("*").from("questions").where({
    message: Buffer.from(sentence, "utf8").toString("base64"),
  }).first();
  
  if(!rawQuestion) {
    const [questionId] = await knex.table("questions").insert({
      author_discord_id: authorId,
      message: Buffer.from(sentence, "utf8").toString("base64"),
    });

    rawQuestion = {id: questionId};
  }

  await knex.table("answers").insert({
    author_discord_id: authorId,
    message: Buffer.from(answer, "utf8").toString("base64"),
    question_id: rawQuestion.id,
  });
}

export async function get(question: string) {
  const rawQuestion = await knex.select("*").from("questions");
  
  if(rawQuestion.length === 0) return null;

  const found = rawQuestion.find((q) => Buffer.from(q.message, "base64").toString("utf8") === question);
  if (found) {
    const foundAnwsers = await knex.select("*").from("answers").where({
      question_id: found.id,
    });

    return foundAnwsers.length > 0 ? foundAnwsers.map((a) => Buffer.from(a.message, "base64").toString("utf8")) : null;
  }

  const matchingSentences = stringSimilarity.findBestMatch(question, rawQuestion.map(q => Buffer.from(q.message, "base64").toString("utf8")));

  if (matchingSentences.bestMatch.rating > 0.3) {
    const result = matchingSentences.ratings.filter(r => Math.abs(matchingSentences.bestMatch.rating - r.rating) < 0.1 && r.rating > 0.3);
    const selected = result[Math.round(Math.random() * (result.length - 1))];
    
    const selectedQuestion = rawQuestion.find(q => q.message === Buffer.from(selected.target, "utf8").toString("base64"));
    const answers = (await knex.select("*").from("answers").where({
      question_id: selectedQuestion.id
    })).map(a => Buffer.from(a.message, "base64").toString("utf8"));
    
    return answers.length > 0 ? answers : null;
  }

  return null;
}

export async function exists(question: string, answer: string) {
  const dQuestion = await knex.select("*").from("questions").where({
    message: Buffer.from(question, "utf8").toString("base64"),
  }).first();
  
  if(!dQuestion) return false;

  return knex.select("*").from("answers").where({
      message: Buffer.from(answer, "utf8").toString("base64"),
      question_id: dQuestion.id,
  }).first().then(a => !!a);
}