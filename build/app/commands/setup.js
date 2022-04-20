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
const command_1 = __importDefault(require("../../commands/command"));
const settings_1 = require("../../database/settings");
class SetUpCommand extends command_1.default {
    get name() {
        return "setup";
    }
    get description() {
        return "Learn a new command";
    }
    get parameters() {
        return [
            {
                name: "here",
                description: "Setup the SimSimi channel here.",
                type: "SUB_COMMAND",
                required: true,
            },
            {
                name: "remove",
                description: "Remove the SimSimi channel from your server.",
                type: "SUB_COMMAND",
                required: true,
            },
        ];
    }
    run(interaction, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = interaction.memberPermissions) === null || _a === void 0 ? void 0 : _a.has(discord_js_1.Permissions.FLAGS.ADMINISTRATOR)) {
                if (interaction.options.getSubcommand(true) == "here") {
                    return yield this.here(interaction);
                }
                else if (interaction.options.getSubcommand(true) == "remove") {
                    return yield this.remove(interaction);
                }
            }
            else {
                yield interaction.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setTitle("Oups !")
                            .setColor("#cc0000")
                            .setDescription("Seuls les administrateurs du serveur peuvent exécuter cette commande."),
                    ],
                });
            }
        });
    }
    remove(interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.guildId) {
                const interactionChannelId = yield (0, settings_1.getSimsimiChannelId)(interaction.guildId);
                if (interactionChannelId) {
                    const oldMessageId = yield (0, settings_1.getSimsimiMessageId)(interaction.guildId);
                    const oldChannel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.resolve(interactionChannelId);
                    if ((oldChannel === null || oldChannel === void 0 ? void 0 : oldChannel.isText()) && oldMessageId) {
                        (_b = oldChannel.messages.resolve(oldMessageId)) === null || _b === void 0 ? void 0 : _b.delete();
                    }
                    yield (0, settings_1.setSimsimiChannelId)(interaction.guildId, null, null);
                    yield interaction.reply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setTitle("Suppression effectuée !")
                                .setColor("#33cc00")
                                .setDescription([
                                "Je ne pourrai plus discuter avec les membres dans le salon **",
                                oldChannel,
                                "**.",
                            ].join("")),
                        ],
                    });
                }
            }
        });
    }
    here(interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.guildId) {
                const interactionChannelId = yield (0, settings_1.getSimsimiChannelId)(interaction.guildId);
                if (interactionChannelId == interaction.channelId) {
                    interaction.reply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setTitle("Oups !")
                                .setColor("#cc0000")
                                .setDescription("Le salon Simsimi est déjà défini à celui-ci !"),
                        ],
                    });
                }
                else {
                    const oldMessageId = yield (0, settings_1.getSimsimiMessageId)(interaction.guildId);
                    if (interactionChannelId) {
                        const oldMessageChannel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.resolve(interactionChannelId);
                        if ((oldMessageChannel === null || oldMessageChannel === void 0 ? void 0 : oldMessageChannel.isText()) && oldMessageId) {
                            yield ((_b = oldMessageChannel.messages.resolve(oldMessageId)) === null || _b === void 0 ? void 0 : _b.delete());
                        }
                    }
                    yield interaction.reply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setTitle("Modification effectuée !")
                                .setColor("#33cc00")
                                .setDescription([
                                "Désormais, je discuterai avec les membres dans **",
                                interaction.channel,
                                "** !",
                            ].join("")),
                        ],
                        ephemeral: true,
                    });
                    if (interaction.channel) {
                        const newMessage = yield interaction.channel.send({
                            embeds: [
                                new discord_js_1.MessageEmbed()
                                    .setTitle("Bonjour !")
                                    .setColor("#ffcc00")
                                    .setDescription("Je suis **Simsimi**. Discutons ensemble !" +
                                    "\n" +
                                    "Il te suffit d'envoyer des messages dans ce salon." +
                                    "\n" +
                                    "" +
                                    "\n" +
                                    "Tu peux aussi m'apprendre de nouvelles choses !" +
                                    "\n" +
                                    "Utilises ``/learn`` pour m'apprendre quoi répondre à la phrase que tu souhaites." +
                                    "\n" +
                                    "" +
                                    "\n" +
                                    "Attention, tu peux tomber sur **n'importe quoi** !" +
                                    "\n" +
                                    "Sois averti. Si tu constates une réponse qui n'aurait pas lieu d'être, contacte mon créateur **M0NS#3608** "),
                            ],
                        });
                        yield newMessage.pin();
                        yield (0, settings_1.setSimsimiChannelId)(interaction.guildId, interaction.channelId, newMessage.id);
                    }
                }
            }
        });
    }
}
exports.default = SetUpCommand;
