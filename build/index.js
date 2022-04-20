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
const discord_js_1 = __importDefault(require("discord.js"));
const { MessageEmbed } = discord_js_1.default;
const fs_1 = __importDefault(require("fs"));
const string_similarity_1 = __importDefault(require("string-similarity"));
const SimSimi_1 = __importDefault(require("./SimSimi"));
const sample_words = ['et', 'ou', 'de', 'la', 'les', 'des', 'dont', 'dans', 'en', 'j\'', 't\''];
let database = JSON.parse(fs_1.default.readFileSync('./database.json', 'utf8'));
const save = () => {
    fs_1.default.writeFileSync('./database.json', JSON.stringify(database, null, 2), 'utf8');
};
require('dotenv').config();
const maxLength = 400; //! max length
const research = (message) => {
    if (Array.isArray(database.messages[message]) && database.messages[message].length > 0) {
        return database.messages[message];
    }
    // remove all sample_words from message
    for (let i = 0; i < sample_words.length; i++) {
        message = message.replace(sample_words[i], '');
    }
    const matches = (string_similarity_1.default.findBestMatch(cleanUp(message).toLowerCase(), Object.keys(database.messages)));
    console.log('Not found, Best match: ' + matches.bestMatch.target + ' with a distance of ' + matches.bestMatch.rating);
    if (matches.bestMatch.rating > 0.3) {
        const bestMatches = matches.ratings.filter(match => Math.abs(match.rating - matches.bestMatch.rating) <= 0.2 && match.rating != 0);
        console.log("Best Matches: ", bestMatches);
        const picked = bestMatches[Math.round(Math.random() * (bestMatches.length - 1))].target;
        return database.messages[picked];
    }
    return [];
};
const bot = new discord_js_1.default.Client({
    intents: [
        'GUILDS',
        'GUILD_MESSAGES',
        'DIRECT_MESSAGE_TYPING',
        'DIRECT_MESSAGES'
    ]
});
let fastLearnsMessagesIds = [];
const cleanUp = (message) => {
    return message.replace('`', '').trim();
};
const isVoid = (message) => {
    return message.replace('*', '').replace('_', '').trim() == '';
};
const hasNitroEmotes = (message) => {
    if (message.indexOf(':') + 1 != message.lastIndexOf(':') + 1) {
        return true;
    }
    return false;
};
const learn = (question, response, send) => __awaiter(void 0, void 0, void 0, function* () {
    if (response.length > maxLength && question.length > maxLength) {
        send({
            embeds: [new MessageEmbed()
                    .setTitle(('Oups !'))
                    .setColor(('#cc0000'))
                    .setDescription(((['Ta question et ta réponse sont trop longues.' + '\n' +
                        'Retentes avec quelque chose de moins de **', maxLength, '** caractères !'
                ].join(''))))
            ]
        });
    }
    else if (response.length > maxLength) {
        send({
            embeds: [new MessageEmbed()
                    .setTitle(('Oups !'))
                    .setColor(('#cc0000'))
                    .setDescription(((['Ta réponse est trop longue.' + '\n' +
                        'Retentes avec quelque chose de moins de **', maxLength, '** caractères !'
                ].join(''))))
            ]
        });
    }
    else if (question.length > maxLength) {
        send({
            embeds: [new MessageEmbed()
                    .setTitle(('Oups !'))
                    .setColor(('#cc0000'))
                    .setDescription(((['Ta question est trop longue.' + '\n' +
                        'Retentes avec quelque chose de moins de **', maxLength, '** caractères !'
                ].join(''))))
            ]
        });
    }
    else {
        if (question.includes('@') && response.includes('@')) {
            send({
                embeds: [new MessageEmbed()
                        .setTitle(('Oups !'))
                        .setColor(('#cc0000'))
                        .setDescription(('Ta question et ta réponse ne peuvent contenir d\'``@`` !'))
                ]
            });
        }
        else if (question.includes('@')) {
            send({
                embeds: [new MessageEmbed()
                        .setTitle(('Oups !'))
                        .setColor(('#cc0000'))
                        .setDescription(('Ta question ne peut contenir d\'``@`` !'))
                ]
            });
        }
        else if (response.includes('@')) {
            send({
                embeds: [new MessageEmbed()
                        .setTitle(('Oups !'))
                        .setColor(('#cc0000'))
                        .setDescription(('Ta réponse ne peut contenir d\'``@`` !'))
                ]
            });
        }
        else {
            if (isVoid(question) && isVoid(response)) {
                send({
                    embeds: [new MessageEmbed()
                            .setTitle(('Oups !'))
                            .setColor(('#cc0000'))
                            .setDescription((('Ta question et ta réponse sont vides !' + '\n' +
                            'Je ne peux pas rien apprendre...')))
                    ]
                });
            }
            else if (isVoid(question)) {
                send({
                    embeds: [new MessageEmbed()
                            .setTitle(('Oups !'))
                            .setColor(('#cc0000'))
                            .setDescription((('Ta question est vide !' + '\n' +
                            'Je ne peux pas rien apprendre...')))
                    ]
                });
            }
            else if (isVoid(response)) {
                send({
                    embeds: [new MessageEmbed()
                            .setTitle(('Oups !'))
                            .setColor(('#cc0000'))
                            .setDescription((('Ta réponse est vide !' + '\n' +
                            'Je ne peux pas rien répondre...')))
                    ]
                });
            }
            else {
                if (Array.isArray(database.messages[question.toLowerCase()]) && database.messages[question.toLowerCase()].includes(response)) {
                    send({
                        embeds: [new MessageEmbed()
                                .setTitle(('Oups !'))
                                .setColor(('#cc0000'))
                                .setDescription(('J\'ai déjà appris à répondre cela face à cette question.'))
                        ]
                    });
                }
                else {
                    if (!Array.isArray(database.messages[question.toLowerCase()]))
                        database.messages[question.toLowerCase()] = [];
                    database.messages[question.toLowerCase()].push(response);
                    save();
                    if (database.messages[question.toLowerCase()].length == 1) {
                        send({
                            embeds: [new MessageEmbed()
                                    .setTitle(('D\'accord !'))
                                    .setColor(('#ffcc00'))
                                    .setDescription(((['Désormais, lorsque l\'on me demandera "``', question, '``", je répondrai "``', response, '``" !' + '\n' + (hasNitroEmotes(response) ? ('\n' +
                                        '' + '\n' +
                                        '' + '\n' +
                                        '**Attention, ton message contient un emoji Discord : Il risque de ne pas bien s\'afficher par la suite.**') : '')
                                ].join(''))))
                            ]
                        });
                    }
                    else {
                        send({
                            embeds: [new MessageEmbed()
                                    .setTitle(('D\'accord !'))
                                    .setColor(('#ffcc00'))
                                    .setDescription(((['Désormais, lorsque l\'on me demandera "``', question, '``", en plus d\'autres réponses, je répondrai "``', response, '``" !' + (hasNitroEmotes(response) ? ('\n' +
                                        '' + '\n' +
                                        '' + '\n' +
                                        '**Attention, ton message contient un emoji Discord : Il risque de ne pas bien s\'afficher par la suite.**') : '')
                                ].join(''))))
                            ]
                        });
                    }
                }
            }
        }
    }
});
// bot.on('interactionCreate', async (interaction) => {
//     const member = interaction.guild?.members.resolve(interaction.member.user.id);
//     if (interaction.isCommand()) {
//         if (interaction.commandName == "setup") {
//             if ((interaction.member).permissions.has('ADMINISTRATOR')) {
//                 if (interaction.options.getSubcommand('here') == 'here') {
//                     if (database.channels[interaction.guildId] == interaction.channelId) {
//                         await interaction.reply({
//                             embeds: [new MessageEmbed()
//                                 .setTitle(('Oups !'))
//                                 .setColor(('#cc0000'))
//                                 .setDescription(('Le salon Simsimi est déjà défini à celui-ci !'))
//                             ]
//                         });
//                     } else {
//                         if(database.channels[interaction.guildId]) {
//                             const channel = interaction.guild.channels.resolve(database.channels[interaction.guildId]);
//                             if(channel.isText()) {
//                                 await channel.messages.delete(database.setupMessages[interaction.guildId]);
//                             }
//                         }
//                         database.channels[interaction.guildId] = interaction.channelId;
//                         save();
//                         await interaction.reply({
//                             embeds: [new MessageEmbed()
//                                 .setTitle(('Modification effectuée !'))
//                                 .setColor(('#33cc00'))
//                                 .setDescription(((['Désormais, je discuterai avec les membres dans **', interaction.channel, '** !'].join(''))))
//                             ]
//                         });
//                         const m = await interaction.channel.send({
//                             embeds: [new MessageEmbed()
//                                 .setTitle(('Bonjour !'))
//                                 .setColor(('#ffcc00'))
//                                 .setDescription((('Je suis **Simsimi**. Discutons ensemble !' + '\n' +
//                                     'Il te suffit d\'envoyer des messages dans ce salon.' + '\n' +
//                                     '' + '\n' +
//                                     'Tu peux aussi m\'apprendre de nouvelles choses !' + '\n' +
//                                     'Utilises ``/learn`` pour m\'apprendre quoi répondre à la phrase que tu souhaites.' + '\n' +
//                                     '' + '\n' +
//                                     'Attention, tu peux tomber sur **n\'importe quoi** !' + '\n' +
//                                     'Sois averti. Si tu constates une réponse qui n\'aurait pas lieu d\'être, contacte mon créateur **M0NS#3608** ')))
//                             ]
//                         });
//                         if(m.pinnable) await m.pin();
//                         database.setupMessages[interaction.guildId] = m.id;
//                         save();
//                     }
//                 } else if (interaction.options.getSubcommand('remove') == 'remove') {
//                     if (database.channels[interaction.guildId]) {
//                         await interaction.reply({
//                             embeds: [new MessageEmbed()
//                                 .setTitle(('Suppression effectuée !'))
//                                 .setColor(('#33cc00'))
//                                 .setDescription(['Je ne pourrai plus discuter avec les membres dans le salon **', bot.channels.resolve(database.channels[interaction.guildId]), '**.'].join(''))
//                             ]
//                         });
//                         if(database.setupMessages[interaction.guildId]) {
//                             const channel = interaction.guild.channels.resolve(database.channels[interaction.guildId]);
//                             if(channel.isText()) {
//                                 await channel.messages.delete(database.setupMessages[interaction.guildId]);
//                             }
//                         }
//                         database.setupMessages[interaction.guildId] = null;
//                         database.channels[interaction.guildId] = null;
//                         save();
//                     } else {
//                         await interaction.reply({
//                             embeds: [new MessageEmbed()
//                                 .setTitle(('Oups !'))
//                                 .setColor(('#cc0000'))
//                                 .setDescription((('Il n\'y a pas de salon Simsimi défini sur ce serveur.' + '\n' +
//                                     'Utilises ``/setup here`` pour en définir un.')))
//                             ]
//                         });
//                     }
//                 }
//             } else {
//                 await interaction.reply({
//                     embeds: [new MessageEmbed()
//                         .setTitle(('Oups !'))
//                         .setColor(('#cc0000'))
//                         .setDescription(('Seuls les administrateurs du serveur peuvent exécuter cette commande.'))
//                     ]
//                 });
//             }
//         }
//         if (interaction.commandName == "learn") {
//             const question = cleanUp(interaction.options.get('question'));
//             const response = cleanUp(interaction.options.get('reponse'));
//             console.log('[Learn] Learned response "',response,'" for question "',question,'" from user ', interaction.member.user.username,'.')
//             learn(question, response, async (m) => {
//                 await interaction.reply(m)
//             });
//         }
//         if(interaction.commandName == "get") {
//             const question = cleanUp(interaction.options.get('question'));
//             if(question.length > maxLength) {
//                 await interaction.reply({
//                     embeds: [new MessageEmbed()
//                         .setTitle(('Oups !'))
//                         .setColor(('#cc0000'))
//                         .setDescription(((['Ta question est trop longue.' + '\n' +
//                             'Je ne peux pas apprendre de phrase qui dépasse les **', maxLength, '** caractères !'
//                         ].join(''))))
//                     ]
//                 });
//             } else {
//                 if(isVoid(question)) {
//                     await interaction.reply({
//                         embeds: [new MessageEmbed()
//                             .setTitle(('Oups !'))
//                             .setColor(('#cc0000'))
//                             .setDescription((('Ta question est vide !' + '\n' +
//                                 'Je ne peux pas avoir rien appris...')))
//                         ]
//                     });
//                 } else {
//                     const r = research(cleanUp(question).toLowerCase()).map((m) => "``" + m + "``");
//                     if(r.length > 0) {
//                         await interaction.reply({
//                             embeds: [new MessageEmbed()
//                                 .setTitle(((['La question "**', question, '**" est liée à :'].join(''))))
//                                 .setColor(('#3366ff'))
//                                 .setDescription((([r].join(''))))
//                             ]
//                         });
//                     } else {
//                         // TODO: research
//                         await interaction.reply({
//                             embeds: [new MessageEmbed()
//                                 .setTitle(('Oups !'))
//                                 .setColor(('#cc0000'))
//                                 .setDescription(('Cette question n\'est pas présente dans ma mémoire.'))
//                             ]
//                         });
//                     }
//                 }
//             }
//         }
//     }
// })
// bot.on('messageCreate', async (message) => {   
//     if(message.author.bot) return;
//     if(message.channel.type != 'DM' && message.channelId != database.channels[message.guild.id] && !message.content.includes('@')) {
//         if(message.reference && cleanUp(message.content).toLowerCase().length > 0) {
//             const replyToGuild = bot.guilds.resolve(message.reference.guildId);
//             if(replyToGuild) {
//                 const replyToChannel = replyToGuild.channels.resolve(message.reference.channelId);
//                 if(replyToChannel) {
//                     const replyToMessage = replyToChannel.messages.resolve(message.reference.messageId);   
//                     if(cleanUp(replyToMessage.content).toLowerCase().length > 0 && !replyToMessage.author.bot && !replyToMessage.content.includes('@')) {
//                         if(!Array.isArray(database.messages[cleanUp(replyToMessage.content).toLowerCase()])) {
//                             database.messages[cleanUp(replyToMessage.content).toLowerCase()] = [];
//                         }  
//                         console.log('Learned from public discussion.');
//                         database.messages[cleanUp(replyToMessage.content).toLowerCase()].push(cleanUp(message.content).toLowerCase());
//                         save();
//                     }
//                 }
//             }
//         }
//     }
//     if(message.reference) {
//         const m = fastLearnsMessagesIds.find((mess: any) => mess.messageId == message.reference?.messageId);
//         if(m) {
//             console.log('[Learn] Learned response "',cleanUp(message.content),'" for question "',cleanUp(m.question),'" from user ', message.author.username,'.')
//             learn(cleanUp(m.question), cleanUp(message.content), async (m) => {
//                 fastLearnsMessagesIds = fastLearnsMessagesIds.filter((a: any) => a.messageId != message.reference?.messageId);
//                 await message.reply(m)
//             });
//             return;
//         }
//     } 
//     if(bot.user?.id && message.mentions.users.has(bot.user.id) && !message.reference) {
//         message.react('💬');
//         if (message.guildId && !database.channels[message.guildId]) {
//             message.channel.send({
//                 embeds: [new MessageEmbed()
//                     .setTitle(((['Salut ', message.member?.user.username, ' !'].join(''))))
//                     .setColor(('#ffcc00'))
//                     .setDescription((('Tu cherches une liste des commandes ?' + '\n' +
//                         'Tapes ``/`` pour trouver ton bonheur !' + '\n' +
//                         '' + '\n' +
//                         'Tu ne peux pas encore discuter avec moi sur ce serveur car les administrateurs n\'ont pas encore défini de **salon Simsimi** !' + '\n' +
//                         'Il peut être défini à l\'aide de la commande ``/setup here``' + '\n' +
//                         '' + '\n' +
//                         'En attendant, tu peux me parler par messages privés.' + '\n' +
//                         '' + '\n' +
//                         'Mon fonctionnement est simple : n\'importe qui peut m\'apprendre quoi répondre à n\'importe quel message !' + '\n' +
//                         'Tu peux donc tomber sur **n\'importe quoi** ! Fais attention !' + '\n' +
//                         '' + '\n' +
//                         'Si tu rencontres un message que tu juges inapproprié, tu peux le signaler à mon créateur **M0NS#3608**.')))
//                         .setFooter('Je suis présent sur ' + bot.guilds.cache.size + ' serveurs !')
//                 ]
//             });
//         } else {
//             await message.channel.send({
//                 embeds: [new MessageEmbed()
//                     .setTitle(((['Salut ', message.member?.user.username, ' !'].join(''))))
//                     .setColor(('#ffcc00'))
//                     .setDescription(((['Tu cherches une liste des commandes ?' + '\n' +
//                         'Tapes ``/`` pour trouver ton bonheur !' + '\n' +
//                         '' + '\n' +
//                         'Tu peux discuter avec moi sur ce serveur dans le salon **', message.guildId ? bot.channels.resolve(database.channels[message.guildId]) : '', '**.' + '\n' +
//                         '' + '\n' +
//                         '' + '\n' +
//                         'Mon fonctionnement est simple : n\'importe qui peut m\'apprendre quoi répondre à n\'importe quel message !' + '\n' +
//                         'Tu peux donc tomber sur **n\'importe quoi** ! Fais attention !' + '\n' +
//                         '' + '\n' +
//                         'Si tu rencontres un message que tu juges inapproprié, tu peux le signaler à mon créateur **M0NS#3608**.'
//                     ].join(''))))
//                     .setFooter({
//                         text: 'Je suis présent sur ' + bot.guilds.cache.size + ' serveurs !',
//                     })
//                 ]
//             });
//         }
//     } else {
//         if((message.guildId && message.channelId == database.channels[message.guildId] || message.channel.type == 'DM') && !message.author.bot && !message.content.includes('@')) {
//         const question = cleanUp(message.content);
//         if(question.length > maxLength) {
//             await message.reply({
//                 embeds: [new MessageEmbed()
//                     .setTitle(('Oups !'))
//                     .setColor(('#cc0000'))
//                     .setDescription(((['Ta question est trop longue.' + '\n' +
//                         'Je ne peux pas apprendre de phrase qui dépasse les **', maxLength, '** caractères !'
//                     ].join(''))))
//                 ]
//             });
//         } else {
//             if(isVoid(question)) {
//                 if(message.content.length == 0) {
//                     message.channel.send({
//                         embeds: [new MessageEmbed()
//                             .setTitle(('Oh !'))
//                             .setColor(('#6633ff'))
//                             .setDescription((('ça à l\'air cool ce que tu m\'envoie !' + '\n' +
//                                 'Cependant, je ne sais que lire du texte pour le moment...')))
//                         ]
//                     });
//                 } else {
//                     message.channel.send({
//                         embeds: [new MessageEmbed()
//                             .setTitle(('Oups !'))
//                             .setColor(('#cc0000'))
//                             .setDescription((('Ton message est vide.' + '\n' +
//                                 'Je ne sais pas quoi y répondre !')))
//                         ]
//                     });
//                 }
//             } else {
//                 const r = research(question.toLowerCase());
//                 if(r.length > 0) {
//                     await message.channel.sendTyping()
//                     const responseMessage= r[Math.round(Math.random() * (r.length - 1))];
//                     setTimeout(async () => {
//                         await message.reply(capitalize(responseMessage, false))
//                     }, 10 * responseMessage.length <= 2000 ? 50 * responseMessage.length : 2000);
//                 } else {
//                     // TODO: research
//                     const flm = await message.channel.send({
//                         embeds: [new MessageEmbed()
//                             .setTitle(((['Hey ', message.author.username, ' !'].join(''))))
//                             .setColor(('#3333ff'))
//                             .setDescription((('Je ne sais pas quoi répondre à cela. Peux-tu me l\'apprendre ?' + '\n' +
//                                 '' + '\n' +
//                                 '**Méthode rapide** : Réponds à ce message en y écrivant la réponse de ton message pour me l\'apprendre.' + '\n' +
//                                 '' + '\n' +
//                                 'Sinon, utilises ``/learn`` !')))
//                         ]
//                     });
//                     fastLearnsMessagesIds.push({messageId: flm.id, question: message.content});
//                 }
//             }
//         }
//     }}
// })
const simSimi = new SimSimi_1.default();
simSimi.start()
    .then(() => {
    console.log('bot started');
})
    .catch((e) => {
    console.log('bot failed to start');
    console.log(e);
});
