import { User } from "discord.js";
import { add, exists } from "../database/sentences.js";
import LearnAlreadyExistsError from "../errors/learn/LearnAlreadyExists.js";
import LearnAtCharacterNotAllowedError from "../errors/learn/LearnAtCharacterNotAllowedError.js";
import LearnEmptyStringError from "../errors/learn/LearnEmptyStringError.js";
import LearnTooLongError from "../errors/learn/LearnTooLongError.js";
import { Emotion } from "../typing/emotion.js";
import { format } from "./formatMessages.js";

const MAX_LENGTH = parseInt(process.env.MAX_LENGTH || "") || 400;

export default async function learn(sentence: string, answer: string, emotion: Emotion | null, author: User) {
  const formatedSentence = format(sentence, { toLowerCase: true });
  const formatedAnswer = format(answer);

  if (!formatedSentence || !formatedAnswer) throw new LearnEmptyStringError;

  if (formatedSentence.length > MAX_LENGTH || formatedAnswer.length > MAX_LENGTH) throw new LearnTooLongError(MAX_LENGTH);

  if (formatedSentence.includes("@") || formatedAnswer.includes("@")) throw new LearnAtCharacterNotAllowedError;

  if(await exists(formatedSentence, formatedAnswer, emotion)) throw new LearnAlreadyExistsError;

  add(formatedSentence, formatedAnswer, emotion, author.id);
}
