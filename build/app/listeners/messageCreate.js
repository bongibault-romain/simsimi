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
class MessageCreate extends listener_1.default {
    get name() {
        return "messageCreate";
    }
    run(message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.bot.client.user) {
                if (!message.reference) {
                    if (message.mentions.users.has(this.bot.client.user.id)) {
                        yield message.react("💬");
                        yield message.channel.send({
                            embeds: [
                                new discord_js_1.MessageEmbed()
                                    .setTitle("Salut " + ((_a = message.member) === null || _a === void 0 ? void 0 : _a.user.username) + " !")
                                    .setColor("#ffcc00")
                                    .setDescription("Tu cherches une liste des commandes ?" +
                                    "\n" +
                                    "Tapes ``/`` pour trouver ton bonheur !" +
                                    "\n" +
                                    "" +
                                    "\n" +
                                    "Tu ne peux pas encore discuter avec moi sur ce serveur car les administrateurs n'ont pas encore défini de **salon Simsimi** !" +
                                    "\n" +
                                    "Il peut être défini à l'aide de la commande ``/setup here``" +
                                    "\n" +
                                    "" +
                                    "\n" +
                                    "En attendant, tu peux me parler par messages privés." +
                                    "\n" +
                                    "" +
                                    "\n" +
                                    "Mon fonctionnement est simple : n'importe qui peut m'apprendre quoi répondre à n'importe quel message !" +
                                    "\n" +
                                    "Tu peux donc tomber sur **n'importe quoi** ! Fais attention !" +
                                    "\n" +
                                    "" +
                                    "\n" +
                                    "Si tu rencontres un message que tu juges inapproprié, tu peux le signaler à mon créateur **M0NS#3608**.")
                                    .setFooter({
                                    text: "Je suis présent sur " +
                                        this.bot.client.guilds.cache.size +
                                        " serveurs !" +
                                        " Il y a plus de " +
                                        this.bot.client.guilds.cache
                                            .map((g) => g.memberCount)
                                            .reduce((a, b) => a + b) +
                                        " membres sur tous ces serveurs !",
                                }),
                            ],
                        });
                    }
                }
            }
        });
    }
}
exports.default = MessageCreate;
