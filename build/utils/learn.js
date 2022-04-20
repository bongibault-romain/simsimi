"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const format_1 = require("./format");
const sentences = __importStar(require("./../database/sentences"));
exports.default = (question, answer) => __awaiter(void 0, void 0, void 0, function* () {
    question = (0, format_1.format)(question);
    answer = (0, format_1.format)(answer, false);
    if ((0, format_1.isVoid)(answer) || (0, format_1.isVoid)(question)) {
        if ((0, format_1.format)(answer).length == 0) {
            return new discord_js_1.MessageEmbed()
                .setTitle("Oups !")
                .setColor("#cc0000")
                .setDescription("Ta question et ta réponse sont vides !" +
                "\n" +
                "Je ne peux pas rien apprendre...");
        }
        if ((0, format_1.format)(question).length == 0) {
            return new discord_js_1.MessageEmbed()
                .setTitle("Oups !")
                .setColor("#cc0000")
                .setDescription("Ta question est vide !" + "\n" + "Je ne peux pas rien apprendre...");
        }
        return new discord_js_1.MessageEmbed()
            .setTitle("Oups !")
            .setColor("#cc0000")
            .setDescription("Ta question et ta réponse sont vides !" +
            "\n" +
            "Je ne peux pas rien apprendre...");
    }
    if (answer.length > process.env.MAX_LENGTH || question.length > process.env.MAX_LENGTH) {
        if (answer.length > process.env.MAX_LENGTH) {
            return new discord_js_1.MessageEmbed()
                .setTitle("Oups !")
                .setColor("#cc0000")
                .setDescription([
                "Ta réponse est trop longue." +
                    "\n" +
                    "Retentes avec quelque chose de moins de **",
                process.env.MAX_LENGTH,
                "** caractères !",
            ].join(""));
        }
        if (question.length > process.env.MAX_LENGTH) {
            return new discord_js_1.MessageEmbed()
                .setTitle("Oups !")
                .setColor("#cc0000")
                .setDescription([
                "Ta question est trop longue." +
                    "\n" +
                    "Retentes avec quelque chose de moins de **",
                process.env.MAX_LENGTH,
                "** caractères !",
            ].join(""));
        }
        return new discord_js_1.MessageEmbed()
            .setTitle("Oups !")
            .setColor("#cc0000")
            .setDescription([
            "Ta question et ta réponse sont trop longues." +
                "\n" +
                "Retentes avec quelque chose de moins de **",
            process.env.MAX_LENGTH,
            "** caractères !",
        ].join(""));
    }
    if (answer.includes("@") || question.includes("@")) {
        if (answer.includes("@")) {
            return new discord_js_1.MessageEmbed()
                .setTitle("Oups !")
                .setColor("#cc0000")
                .setDescription("Ta réponse ne peut contenir d'``@`` !");
        }
        if (question.includes("@")) {
            return new discord_js_1.MessageEmbed()
                .setTitle("Oups !")
                .setColor("#cc0000")
                .setDescription("Ta question ne peut contenir d'``@`` !");
        }
        return new discord_js_1.MessageEmbed()
            .setTitle("Oups !")
            .setColor("#cc0000")
            .setDescription("Ta question et ta réponse ne peuvent contenir d'``@`` !");
    }
    console.log(question, answer);
    if (yield sentences.strictExists(question, answer)) {
        return new discord_js_1.MessageEmbed()
            .setTitle("Oups !")
            .setColor("#cc0000")
            .setDescription("J'ai déjà appris à répondre cela face à cette question.");
    }
    yield sentences.add(question, answer);
    return new discord_js_1.MessageEmbed()
        .setTitle("D'accord !")
        .setColor("#ffcc00")
        .setDescription([
        "Désormais, lorsque l'on me demandera \"``",
        question,
        '``", je répondrai peut être "``',
        answer,
        '``" !' +
            "\n" +
            ((0, format_1.hasNitroEmotes)(answer)
                ? "\n" +
                    "" +
                    "\n" +
                    "" +
                    "\n" +
                    "**Attention, ton message contient un emoji Discord : Il risque de ne pas bien s'afficher par la suite.**"
                : ""),
    ].join(""));
});
