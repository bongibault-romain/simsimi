"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_1 = __importDefault(require("../app/commands/get"));
const learn_1 = __importDefault(require("../app/commands/learn"));
const setup_1 = __importDefault(require("../app/commands/setup"));
class CommandManager {
    constructor(bot) {
        this.bot = bot;
        this.commands = [];
        this.fastLearnMessages = [];
    }
    load() {
        this.register(new learn_1.default(this.bot));
        this.register(new get_1.default(this.bot));
        this.register(new setup_1.default(this.bot));
    }
    unload() {
    }
    register(command) {
        this.commands.push(command);
    }
    exists(name) {
        return this.commands.some(command => command.name === name);
    }
    get(interaction) {
        return this.commands.find(cmd => cmd.name === interaction.commandName) || null;
    }
    addFastLearn(question, messageId) {
        this.fastLearnMessages.push({
            question,
            messageId
        });
    }
    removeFastLearn(messageId) {
        this.fastLearnMessages = this.fastLearnMessages.filter(msg => msg.messageId !== messageId);
    }
    getFastLearn(messageId) {
        const msg = this.fastLearnMessages.find(msg => msg.messageId === messageId);
        return msg || null;
    }
}
exports.default = CommandManager;
