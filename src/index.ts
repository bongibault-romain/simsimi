import Discord from 'discord.js';
const { MessageEmbed } = Discord;
import fs from 'fs';
import stringSimilarity from 'string-similarity';
import SimSimi from './SimSimi';

const sample_words = ['et', 'ou', 'de', 'la', 'les', 'des', 'dont', 'dans', 'en', 'j\'', 't\''];

let database = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
const save = () => {
    fs.writeFileSync('./database.json', JSON.stringify(database, null, 2), 'utf8');
}

require('dotenv').config();

const maxLength = 400; //! max length

const research = (message: string) => {
    if(Array.isArray(database.messages[message]) && database.messages[message].length > 0) {
        return database.messages[message];
    }

    // remove all sample_words from message
    for (let i = 0; i < sample_words.length; i++) {
        message = message.replace(sample_words[i], '');
    }

    const matches = (stringSimilarity.findBestMatch(cleanUp(message).toLowerCase(), Object.keys(database.messages)));

    console.log('Not found, Best match: ' + matches.bestMatch.target + ' with a distance of ' + matches.bestMatch.rating);

    if(matches.bestMatch.rating > 0.3) {
        const bestMatches = matches.ratings.filter(match => Math.abs(match.rating - matches.bestMatch.rating) <= 0.2 && match.rating != 0);
        
        console.log("Best Matches: ", bestMatches);

        const picked = bestMatches[Math.round(Math.random() * (bestMatches.length - 1))].target;
        
        return database.messages[picked];
    }

    return [];
}

const bot = new Discord.Client({
    intents: [
        'GUILDS',
        'GUILD_MESSAGES',
        'DIRECT_MESSAGE_TYPING',
        'DIRECT_MESSAGES'
    ]
});

let fastLearnsMessagesIds: any = [];

bot.on('interactionCreate', async (interaction) => {
    const member = interaction.guild?.members.resolve(interaction.member.user.id);

    if (interaction.isCommand()) {

        if (interaction.commandName == "setup") {

            if ((interaction.member).permissions.has('ADMINISTRATOR')) {

                if (interaction.options.getSubcommand() == 'here') {

                    if (database.channels[interaction.guildId] == interaction.channelId) {
                        await interaction.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(('Oups !'))
                                .setColor(('#cc0000'))
                                .setDescription(('Le salon Simsimi est déjà défini à celui-ci !'))
                            ]
                        });
                    } else {
                        if(database.channels[interaction.guildId]) {
                            const channel = interaction.guild.channels.resolve(database.channels[interaction.guildId]);
                            
                            if(channel.isText()) {
                                await channel.messages.delete(database.setupMessages[interaction.guildId]);
                            }
                        }

                        database.channels[interaction.guildId] = interaction.channelId;
                        save();

                        await interaction.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(('Modification effectuée !'))
                                .setColor(('#33cc00'))
                                .setDescription(((['Désormais, je discuterai avec les membres dans **', interaction.channel, '** !'].join(''))))
                            ]
                        });
                        const m = await interaction.channel.send({
                            embeds: [new MessageEmbed()
                                .setTitle(('Bonjour !'))
                                .setColor(('#ffcc00'))
                                .setDescription((('Je suis **Simsimi**. Discutons ensemble !' + '\n' +
                                    'Il te suffit d\'envoyer des messages dans ce salon.' + '\n' +
                                    '' + '\n' +
                                    'Tu peux aussi m\'apprendre de nouvelles choses !' + '\n' +
                                    'Utilises ``/learn`` pour m\'apprendre quoi répondre à la phrase que tu souhaites.' + '\n' +
                                    '' + '\n' +
                                    'Attention, tu peux tomber sur **n\'importe quoi** !' + '\n' +
                                    'Sois averti. Si tu constates une réponse qui n\'aurait pas lieu d\'être, contacte mon créateur **M0NS#3608** ')))
                            ]
                        });

                        if(m.pinnable) await m.pin();
                        database.setupMessages[interaction.guildId] = m.id;
                        save();


                    }
                } else if (interaction.options.getSubcommand('remove') == 'remove') {

                    if (database.channels[interaction.guildId]) {
                        await interaction.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(('Suppression effectuée !'))
                                .setColor(('#33cc00'))
                                .setDescription(['Je ne pourrai plus discuter avec les membres dans le salon **', bot.channels.resolve(database.channels[interaction.guildId]), '**.'].join(''))
                            ]
                        });

                        if(database.setupMessages[interaction.guildId]) {
                            const channel = interaction.guild.channels.resolve(database.channels[interaction.guildId]);
                            
                            if(channel.isText()) {
                                await channel.messages.delete(database.setupMessages[interaction.guildId]);
                            }
                        }

                        database.setupMessages[interaction.guildId] = null;
                        database.channels[interaction.guildId] = null;
                        save();
                    } else {
                        await interaction.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(('Oups !'))
                                .setColor(('#cc0000'))
                                .setDescription((('Il n\'y a pas de salon Simsimi défini sur ce serveur.' + '\n' +
                                    'Utilises ``/setup here`` pour en définir un.')))
                            ]
                        });
                    }

                }

            } else {
                await interaction.reply({
                    embeds: [new MessageEmbed()
                        .setTitle(('Oups !'))
                        .setColor(('#cc0000'))
                        .setDescription(('Seuls les administrateurs du serveur peuvent exécuter cette commande.'))
                    ]
                });
            }
        }

    }

})

bot.on('messageCreate', async (message) => {   

    if(message.author.bot) return;

    if(message.channel.type != 'DM' && message.channelId != database.channels[message.guild.id] && !message.content.includes('@')) {
        if(message.reference && cleanUp(message.content).toLowerCase().length > 0) {
            const replyToGuild = bot.guilds.resolve(message.reference.guildId);
            if(replyToGuild) {
                const replyToChannel = replyToGuild.channels.resolve(message.reference.channelId);
                
                if(replyToChannel) {
                    const replyToMessage = replyToChannel.messages.resolve(message.reference.messageId);   
                    
                    if(cleanUp(replyToMessage.content).toLowerCase().length > 0 && !replyToMessage.author.bot && !replyToMessage.content.includes('@')) {
                        if(!Array.isArray(database.messages[cleanUp(replyToMessage.content).toLowerCase()])) {
                            database.messages[cleanUp(replyToMessage.content).toLowerCase()] = [];
                        }  

                        console.log('Learned from public discussion.');

                        database.messages[cleanUp(replyToMessage.content).toLowerCase()].push(cleanUp(message.content).toLowerCase());
                        save();
                    }
                }
            }
        }
    }

    if(message.reference) {
        const m = fastLearnsMessagesIds.find((mess: any) => mess.messageId == message.reference?.messageId);
        
        if(m) {
            console.log('[Learn] Learned response "',cleanUp(message.content),'" for question "',cleanUp(m.question),'" from user ', message.author.username,'.')

            learn(cleanUp(m.question), cleanUp(message.content), async (m) => {
                fastLearnsMessagesIds = fastLearnsMessagesIds.filter((a: any) => a.messageId != message.reference?.messageId);

                await message.reply(m)
            });
            return;
        }

    } 
    
    // if(bot.user?.id && message.mentions.users.has(bot.user.id) && !message.reference) {
    //     message.react('💬');

    //     if (message.guildId && !database.channels[message.guildId]) {
    //         message.channel.send({
    //             embeds: [new MessageEmbed()
    //                 .setTitle(((['Salut ', message.member?.user.username, ' !'].join(''))))
    //                 .setColor(('#ffcc00'))
    //                 .setDescription((('Tu cherches une liste des commandes ?' + '\n' +
    //                     'Tapes ``/`` pour trouver ton bonheur !' + '\n' +
    //                     '' + '\n' +
    //                     'Tu ne peux pas encore discuter avec moi sur ce serveur car les administrateurs n\'ont pas encore défini de **salon Simsimi** !' + '\n' +
    //                     'Il peut être défini à l\'aide de la commande ``/setup here``' + '\n' +
    //                     '' + '\n' +
    //                     'En attendant, tu peux me parler par messages privés.' + '\n' +
    //                     '' + '\n' +
    //                     'Mon fonctionnement est simple : n\'importe qui peut m\'apprendre quoi répondre à n\'importe quel message !' + '\n' +
    //                     'Tu peux donc tomber sur **n\'importe quoi** ! Fais attention !' + '\n' +
    //                     '' + '\n' +
    //                     'Si tu rencontres un message que tu juges inapproprié, tu peux le signaler à mon créateur **M0NS#3608**.')))
    //                     .setFooter('Je suis présent sur ' + bot.guilds.cache.size + ' serveurs !')
    //             ]
    //         });
    //     } else {
    //         await message.channel.send({
    //             embeds: [new MessageEmbed()
    //                 .setTitle(((['Salut ', message.member?.user.username, ' !'].join(''))))
    //                 .setColor(('#ffcc00'))
    //                 .setDescription(((['Tu cherches une liste des commandes ?' + '\n' +
    //                     'Tapes ``/`` pour trouver ton bonheur !' + '\n' +
    //                     '' + '\n' +
    //                     'Tu peux discuter avec moi sur ce serveur dans le salon **', message.guildId ? bot.channels.resolve(database.channels[message.guildId]) : '', '**.' + '\n' +
    //                     '' + '\n' +
    //                     '' + '\n' +
    //                     'Mon fonctionnement est simple : n\'importe qui peut m\'apprendre quoi répondre à n\'importe quel message !' + '\n' +
    //                     'Tu peux donc tomber sur **n\'importe quoi** ! Fais attention !' + '\n' +
    //                     '' + '\n' +
    //                     'Si tu rencontres un message que tu juges inapproprié, tu peux le signaler à mon créateur **M0NS#3608**.'
    //                 ].join(''))))
    //                 .setFooter({
    //                     text: 'Je suis présent sur ' + bot.guilds.cache.size + ' serveurs !',
    //                 })
    //             ]
    //         });
    //     }
    // } else {
        
    //     if((message.guildId && message.channelId == database.channels[message.guildId] || message.channel.type == 'DM') && !message.author.bot && !message.content.includes('@')) {
    //     const question = cleanUp(message.content);

    //     if(question.length > maxLength) {
    //         await message.reply({
    //             embeds: [new MessageEmbed()
    //                 .setTitle(('Oups !'))
    //                 .setColor(('#cc0000'))
    //                 .setDescription(((['Ta question est trop longue.' + '\n' +
    //                     'Je ne peux pas apprendre de phrase qui dépasse les **', maxLength, '** caractères !'
    //                 ].join(''))))
    //             ]
    //         });
    //     } else {

    //         if(isVoid(question)) {
    //             if(message.content.length == 0) {
    //                 message.channel.send({
    //                     embeds: [new MessageEmbed()
    //                         .setTitle(('Oh !'))
    //                         .setColor(('#6633ff'))
    //                         .setDescription((('ça à l\'air cool ce que tu m\'envoie !' + '\n' +
    //                             'Cependant, je ne sais que lire du texte pour le moment...')))
    //                     ]
    //                 });
    //             } else {
    //                 message.channel.send({
    //                     embeds: [new MessageEmbed()
    //                         .setTitle(('Oups !'))
    //                         .setColor(('#cc0000'))
    //                         .setDescription((('Ton message est vide.' + '\n' +
    //                             'Je ne sais pas quoi y répondre !')))
    //                     ]
    //                 });
    //             }
    //         } else {
    //             const r = research(question.toLowerCase());

    //             if(r.length > 0) {

    //                 await message.channel.sendTyping()

    //                 const responseMessage= r[Math.round(Math.random() * (r.length - 1))];

    //                 setTimeout(async () => {
    //                     await message.reply(capitalize(responseMessage, false))
    //                 }, 10 * responseMessage.length <= 2000 ? 50 * responseMessage.length : 2000);

    //             } else {
    //                 // TODO: research
    //                 const flm = await message.channel.send({
    //                     embeds: [new MessageEmbed()
    //                         .setTitle(((['Hey ', message.author.username, ' !'].join(''))))
    //                         .setColor(('#3333ff'))
    //                         .setDescription((('Je ne sais pas quoi répondre à cela. Peux-tu me l\'apprendre ?' + '\n' +
    //                             '' + '\n' +
    //                             '**Méthode rapide** : Réponds à ce message en y écrivant la réponse de ton message pour me l\'apprendre.' + '\n' +
    //                             '' + '\n' +
    //                             'Sinon, utilises ``/learn`` !')))
    //                     ]
    //                 });

    //                 fastLearnsMessagesIds.push({messageId: flm.id, question: message.content});
    //             }

    //         }

    //     }
    // }}
})

const simSimi = new SimSimi();

simSimi.start()
    .then(() => {
        console.log('bot started')
    })
    .catch((e) => {
        console.log('bot failed to start')
        console.log(e)
    })

