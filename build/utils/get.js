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
const sentences = __importStar(require("./../database/sentences"));
const format_1 = require("./format");
exports.default = (question) => __awaiter(void 0, void 0, void 0, function* () {
    question = (0, format_1.format)(question);
    if ((0, format_1.isVoid)(question)) {
        throw new discord_js_1.MessageEmbed(new discord_js_1.MessageEmbed()
            .setTitle("Oups !")
            .setColor("#cc0000")
            .setDescription("Ta question est vide !" +
            "\n" +
            "Je ne peux pas avoir rien appris..."));
    }
    if (question.length > process.env.MAX_LENGTH) {
        throw new discord_js_1.MessageEmbed()
            .setTitle("Oups !")
            .setColor("#cc0000")
            .setDescription([
            "Ta question est trop longue." +
                "\n" +
                "Je ne peux pas apprendre de phrase qui dépasse les **",
            process.env.MAX_LENGTH,
            "** caractères !",
        ].join(""));
    }
    if (!(yield sentences.exists(question))) {
        throw new discord_js_1.MessageEmbed()
            .setTitle("Oups !")
            .setColor("#cc0000")
            .setDescription("Cette question n'est pas présente dans ma mémoire.");
    }
    return yield sentences.get(question);
});
