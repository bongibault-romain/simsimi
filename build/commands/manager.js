"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_1 = __importDefault(require("../app/commands/get"));
const learn_1 = __importDefault(require("../app/commands/learn"));
class CommandManager {
    constructor(bot) {
        this.bot = bot;
        this.commands = [];
    }
    load() {
        this.register(new learn_1.default(this.bot));
        this.register(new get_1.default(this.bot));
    }
    unload() {
    }
    register(command) {
        this.commands.push(command);
    }
    exists(name) {
        return this.commands.some(command => command.name === name);
    }
    get(name) {
        return this.commands.find(command => command.name === name) || null;
    }
}
exports.default = CommandManager;
