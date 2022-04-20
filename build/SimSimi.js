"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const manager_1 = __importDefault(require("./commands/manager"));
const manager_2 = __importDefault(require("./listeners/manager"));
class SimSimi {
    constructor() {
        this.client = new discord_js_1.Client({
            intents: [
                'GUILDS',
                'GUILD_MESSAGES',
                'DIRECT_MESSAGE_TYPING',
                'DIRECT_MESSAGES'
            ]
        });
        this.listenerManager = new manager_2.default(this);
        this.commandManager = new manager_1.default(this);
    }
    start() {
        this.listenerManager.load();
        this.commandManager.load();
        return this.client.login(process.env.TOKEN);
    }
}
exports.default = SimSimi;
