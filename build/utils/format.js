"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasNitroEmotes = exports.isVoid = exports.format = void 0;
const format = (message) => {
    return message.replace('`', '').trim();
};
exports.format = format;
const isVoid = (message) => {
    return message.replace("*", "").replace("_", "").trim().length == 0;
};
exports.isVoid = isVoid;
const hasNitroEmotes = (message) => {
    if (message.indexOf(":") + 1 != message.lastIndexOf(":") + 1) {
        return true;
    }
    return false;
};
exports.hasNitroEmotes = hasNitroEmotes;
