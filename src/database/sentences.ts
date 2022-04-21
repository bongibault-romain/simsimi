import path from "path";
import * as fs from "fs";
import stringSimilarity from "string-similarity";
import { dirname } from "@discordx/importer";

const sentencesFilePath = path.join(dirname(import.meta.url), "../../data/sentences.json");

export function add(sentence: string, answer: string) {
  const sentences = JSON.parse(fs.readFileSync(sentencesFilePath, "utf8"));

  if (sentences[sentence]) sentences[sentence].push(answer);
  else sentences[sentence] = [answer];

  fs.writeFileSync(sentencesFilePath, JSON.stringify(sentences));
}

export function get(question: string) {
  const sentences = JSON.parse(fs.readFileSync(sentencesFilePath, "utf8"));

  if (sentences[question]) return sentences[question];

  const matchingSentences = stringSimilarity.findBestMatch(question, Object.keys(sentences));

  if (matchingSentences.bestMatch.rating > 0.3) {
    const result = matchingSentences.ratings.filter(r => Math.abs(matchingSentences.bestMatch.rating - r.rating) < 0.1 && r.rating > 0.3).map(r => sentences[r.target]);
    return result[Math.round(Math.random() * (result.length - 1))];
  }

  return null;
}