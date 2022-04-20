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
const command_1 = __importDefault(require("../../commands/command"));
const learn_1 = __importDefault(require("../../utils/learn"));
class LearnCommand extends command_1.default {
    get name() {
        return 'learn';
    }
    get description() {
        return 'Learn a new command';
    }
    get parameters() {
        return [
            {
                name: 'question',
                type: 'STRING',
                required: true,
                description: 'The question to ask',
            },
            {
                name: 'answer',
                type: 'STRING',
                required: true,
                description: 'The answer to the question',
            }
        ];
    }
    run(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = interaction.options.getString('question', true);
            const answer = interaction.options.getString('reponse', true);
            return interaction.reply({
                embeds: [
                    yield (0, learn_1.default)(question, answer)
                ]
            });
        });
    }
}
exports.default = LearnCommand;
