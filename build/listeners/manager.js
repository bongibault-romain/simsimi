"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interactionCreate_1 = __importDefault(require("../app/listeners/interactionCreate"));
const messageCreate_1 = __importDefault(require("../app/listeners/messageCreate"));
const ready_1 = __importDefault(require("../app/listeners/ready"));
class ListenerManager {
    constructor(bot) {
        this.bot = bot;
    }
    load() {
        this.register(new ready_1.default(this.bot));
        this.register(new interactionCreate_1.default(this.bot));
        this.register(new messageCreate_1.default(this.bot));
    }
    unload() {
    }
    register(listener) {
        this.bot.client.on(listener.name, (...args) => listener.run(...args));
    }
}
exports.default = ListenerManager;
