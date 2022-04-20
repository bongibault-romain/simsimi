"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command_1 = __importDefault(require("../../commands/command"));
const get_1 = __importDefault(require("../../utils/get"));
class GetCommand extends command_1.default {
    get name() {
        return "get";
    }
    get description() {
        return "Learn a new command";
    }
    get parameters() {
        return [
            {
                name: "question",
                type: "STRING",
                required: true,
                description: "The question to ask",
            },
        ];
    }
    run(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = interaction.options.getString("question", true);
            (0, get_1.default)(question)
                .then((answers) => {
                interaction.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setTitle(['La question "**', question, '**" est liée à :'].join(""))
                            .setColor("#3366ff")
                            .setDescription([answers].join("")),
                    ],
                });
            })
                .catch((messageEmbed) => {
                interaction.reply({ embeds: [messageEmbed] });
            });
        });
    }
}
exports.default = GetCommand;
