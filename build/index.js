"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SimSimi_1 = __importDefault(require("./SimSimi"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const simSimi = new SimSimi_1.default();
simSimi.start()
    .then(() => {
    console.log('bot started');
})
    .catch((e) => {
    console.log('bot failed to start');
    console.log(e);
});
