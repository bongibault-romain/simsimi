import { MessageEmbed } from "discord.js";
import { hasNitroEmotes, format, isVoid } from "./format";
import * as sentences from "./../database/sentences";

export default async (
  question: string,
  answer: string
): Promise<MessageEmbed> => {
    question = format(question);
    answer = format(answer);

  if (isVoid(answer) || isVoid(question)) {
    if (format(answer).length == 0) {
      return new MessageEmbed()
        .setTitle("Oups !")
        .setColor("#cc0000")
        .setDescription(
          "Ta question et ta réponse sont vides !" +
            "\n" +
            "Je ne peux pas rien apprendre..."
        );
    }

    if (format(question).length == 0) {
      return new MessageEmbed()
        .setTitle("Oups !")
        .setColor("#cc0000")
        .setDescription(
          "Ta question est vide !" + "\n" + "Je ne peux pas rien apprendre..."
        );
    }

    return new MessageEmbed()
      .setTitle("Oups !")
      .setColor("#cc0000")
      .setDescription(
        "Ta question et ta réponse sont vides !" +
          "\n" +
          "Je ne peux pas rien apprendre..."
      );
  }

  if (answer.length > process.env.MAX_LENGTH || question.length > process.env.MAX_LENGTH) {
    if (answer.length > process.env.MAX_LENGTH) {
      return new MessageEmbed()
        .setTitle("Oups !")
        .setColor("#cc0000")
        .setDescription(
          [
            "Ta réponse est trop longue." +
              "\n" +
              "Retentes avec quelque chose de moins de **",
            process.env.MAX_LENGTH,
            "** caractères !",
          ].join("")
        );
    }

    if (question.length > process.env.MAX_LENGTH) {
      return new MessageEmbed()
        .setTitle("Oups !")
        .setColor("#cc0000")
        .setDescription(
          [
            "Ta question est trop longue." +
              "\n" +
              "Retentes avec quelque chose de moins de **",
            process.env.MAX_LENGTH,
            "** caractères !",
          ].join("")
        );
    }

    return new MessageEmbed()
      .setTitle("Oups !")
      .setColor("#cc0000")
      .setDescription(
        [
          "Ta question et ta réponse sont trop longues." +
            "\n" +
            "Retentes avec quelque chose de moins de **",
          process.env.MAX_LENGTH,
          "** caractères !",
        ].join("")
      );
  }

  if (answer.includes("@") || question.includes("@")) {
    if (answer.includes("@")) {
      return new MessageEmbed()
        .setTitle("Oups !")
        .setColor("#cc0000")
        .setDescription("Ta réponse ne peut contenir d'``@`` !");
    }

    if (question.includes("@")) {
      return new MessageEmbed()
        .setTitle("Oups !")
        .setColor("#cc0000")
        .setDescription("Ta question ne peut contenir d'``@`` !");
    }

    return new MessageEmbed()
      .setTitle("Oups !")
      .setColor("#cc0000")
      .setDescription(
        "Ta question et ta réponse ne peuvent contenir d'``@`` !"
      );
  }


    console.log(question, answer);
  if (await sentences.strictExists(question, answer)) {
    return new MessageEmbed()
      .setTitle("Oups !")
      .setColor("#cc0000")
      .setDescription(
        "J'ai déjà appris à répondre cela face à cette question."
      );
  }

  await sentences.add(question, answer);

  return new MessageEmbed()
    .setTitle("D'accord !")
    .setColor("#ffcc00")
    .setDescription(
      [
        "Désormais, lorsque l'on me demandera \"``",
        question,
        '``", je répondrai peut être "``',
        answer,
        '``" !' +
          "\n" +
          (hasNitroEmotes(answer)
            ? "\n" +
              "" +
              "\n" +
              "" +
              "\n" +
              "**Attention, ton message contient un emoji Discord : Il risque de ne pas bien s'afficher par la suite.**"
            : ""),
      ].join("")
    );
};
