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
exports.getSimsimiMessageId = exports.getSimsimiChannelId = exports.setSimsimiChannelId = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const setSimsimiChannelId = (guildId, channelId, messageId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "../..", "database.json"), "utf8"));
    data.channels[guildId] = channelId;
    data.setupMessages[guildId] = messageId;
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "../..", "database.json"), JSON.stringify(data, null, 4), "utf8");
});
exports.setSimsimiChannelId = setSimsimiChannelId;
const getSimsimiChannelId = (guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "../..", "database.json"), "utf8"));
    return data.channels[guildId] || null;
});
exports.getSimsimiChannelId = getSimsimiChannelId;
const getSimsimiMessageId = (guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "../..", "database.json"), "utf8"));
    return data.setupMessages[guildId] || null;
});
exports.getSimsimiMessageId = getSimsimiMessageId;
