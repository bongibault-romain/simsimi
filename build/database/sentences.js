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
exports.removeAll = exports.remove = exports.add = exports.get = exports.exists = exports.strictExists = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const string_similarity_1 = __importDefault(require("string-similarity"));
const strictExists = (question, anwser = null) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "../..", "database.json"), "utf8"));
    if (anwser != null) {
        return Array.isArray(data.messages[question]) && data.messages[question].includes(anwser);
    }
    else {
        return Array.isArray(data.messages[question]);
    }
});
exports.strictExists = strictExists;
const exists = (question) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.get)(question)).length > 0;
});
exports.exists = exists;
const get = (question) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "../..", "database.json"), "utf8"));
    if (data.messages[question]) {
        return data.messages[question];
    }
    const possibilities = string_similarity_1.default.findBestMatch(question, Object.keys(data.messages));
    if (possibilities.bestMatch.rating > 0.3) {
        const result = possibilities.ratings.filter(r => Math.abs(possibilities.bestMatch.rating - r.rating) < 0.1 && r.rating > 0.3).map(r => data.messages[r.target]);
        console.log('match with', possibilities);
        console.log('result: ', result);
        return result[Math.round(Math.random() * (result.length - 1))];
    }
    return [];
});
exports.get = get;
const add = (question, answer) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "../..", "database.json"), "utf8"));
    if (!Array.isArray(data.messages[question])) {
        data.messages[question] = [];
    }
    data.messages[question].push(answer);
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "../..", "database.json"), JSON.stringify(data, null, 4));
});
exports.add = add;
const remove = (question, answer) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.remove = remove;
const removeAll = (question) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.removeAll = removeAll;
