import { add } from "../database/sentences.js";
import LearnAtCharacterNotAllowedError from "../errors/learn/LearnAtCharacterNotAllowedError.js";
import LearnEmptyStringError from "../errors/learn/LearnEmptyStringError.js";
import LearnTooLongError from "../errors/learn/LearnTooLongError.js";
import { format } from "./formatMessages.js";

const MAX_LENGTH = parseInt(process.env.MAX_LENGTH || "") || 400;

export default function learn(sentence: string, answer: string) {
  const formatedSentence = format(sentence, { toLowerCase: true });
  const formatedAnswer = format(answer);

  if (!formatedSentence || !formatedAnswer) throw new LearnEmptyStringError;

  if (formatedSentence.length > MAX_LENGTH || formatedAnswer.length > MAX_LENGTH) throw new LearnTooLongError(MAX_LENGTH);

  if (formatedSentence.includes("@") || formatedAnswer.includes("@")) throw new LearnAtCharacterNotAllowedError;

  add(formatedSentence, formatedAnswer);
}
