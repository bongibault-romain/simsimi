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
const discord_js_1 = require("discord.js");
const listener_1 = __importDefault(require("../../listeners/listener"));
class Ready extends listener_1.default {
    get name() {
        return "ready";
    }
    run(client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('ready');
            (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
                status: "online",
                activities: [
                    {
                        name: "vos messages !",
                        type: "LISTENING",
                    },
                ],
            });
            // let c = this.bot.client.guilds.resolve('848281422427193374')?.channels.resolve('966367568803823646');
            // if(c?.isText()) c.send('Mais t\'es conne ou quoi ?')
            const members = client.guilds.cache
                .map((g) => g.memberCount)
                .reduce((a, b) => a + b);
            (yield client.users.fetch('238684010182606850')).send({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("Toc Toc !")
                        .setColor("#33cc00")
                        .setDescription("Coucou M0NS, je suis réveillé (une nouvelle fois) !")
                        .setFields({
                        name: "Nombre de membres",
                        value: "Je suis présent sur des serveurs avec : **" +
                            members +
                            "** membres",
                    }),
                ],
            });
        });
    }
}
exports.default = Ready;
