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
        this.bot.client.on(listener.name, (...args) => __awaiter(this, void 0, void 0, function* () { return listener.run(...args); }));
    }
}
exports.default = ListenerManager;
