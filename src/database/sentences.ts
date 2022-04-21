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
    message: sentence
  }).first();
  
  if(!rawQuestion) {
    const [questionId] = await knex.table("questions").insert({
      author_discord_id: authorId,
      message: sentence,
    });

    rawQuestion = {id: questionId};
  }

  await knex.table("answers").insert({
    author_discord_id: authorId,
    message: answer,
    question_id: rawQuestion.id,
  });
}

export async function get(question: string) {
  const rawQuestion = await knex.select("*").from("questions");
  
  if(rawQuestion.length === 0) return null;

  const found = rawQuestion.find((q) => q.message === question);
  if (found) return found;

  const matchingSentences = stringSimilarity.findBestMatch(question, rawQuestion.map(q => q.message));

  if (matchingSentences.bestMatch.rating > 0.3) {
    const result = matchingSentences.ratings.filter(r => Math.abs(matchingSentences.bestMatch.rating - r.rating) < 0.1 && r.rating > 0.3);
    const selected = result[Math.round(Math.random() * (result.length - 1))];
    
    const selectedQuestion = rawQuestion.find(q => q.message === selected.target);
    const answers = (await knex.select("*").from("answers").where({
      question_id: selectedQuestion.id
    })).map(a => a.message);
    
    return answers.length > 0 ? answers : null;
  }

  return null;
}