const { NHentai } = require('nhentai.js-api');
const nhentai = new NHentai();
const { MessageEmbed } = require('discord.js');
const getRandomHexColor = require('../../../functions/getRandomHexColor');

module.exports = {
    aliases: ['nhentaiS', 'nhS'],
    description: 'Search doujins.',
    minArguments: 1,
    expectedArguments: '<search_query>',
    execute: async (message, arguments, client) =>  {
        const { channel } = message;
        if(!channel.nsfw) return message.react('🚫').catch(() => {});
        
        const searchQuery = arguments.join(' ');
    
        const initialMessage = await message.reply('searching, sit tight...');

        nhentai.search(searchQuery, 'all time').then(async results => {
            let currentPage = results;
            const { total, hentai, page, pages } = currentPage;

            const replyEmbed = new MessageEmbed()
                .setColor(getRandomHexColor())
                .setTitle(`Found ${ total } search results for \`${ searchQuery }\` (sorted by popularity)`)
                .setFooter(`Page • ${ page }/${ pages }`);
            
            await initialMessage.delete();
            channel.send(
                hentai.length === 0 ? replyEmbed :
                replyEmbed.setDescription(`${
                    hentai.map(doujin => `__Title__: ${ doujin.title || doujin.cleanTitle }\n__Code__: ${ doujin.id }\n\n`).join('')
                }`)
            ).then(async message => {
                await message.react('⬅️');
                await message.react('➡️');
    
                let timeOver = false;
                setTimeout(() => timeOver = true, 60 * 60 * 1000);

                client.on('messageReactionAdd', async (reaction, user) => {
                    if(timeOver) return ;
    
                    if(reaction.message.id === message.id && reaction.emoji.name === '⬅️') {
                        message.reactions.resolve('⬅️').users.remove(user.id);
                        currentPage = await results.previous().then(doujin => doujin);
                        const { hentai, page, pages } = currentPage;

                        message.edit(
                            new MessageEmbed()
                                .setColor(getRandomHexColor())
                                .setColor(getRandomHexColor())
                                .setDescription(`${
                                    hentai.map(doujin => `__Title__: ${ doujin.title || doujin.cleanTitle }\n__Code__: ${ doujin.id }\n\n`).join('')
                                }`)
                                .setFooter(`Page • ${ page }/${ pages }`)
                        );
                    } else if(reaction.message.id === message.id && reaction.emoji.name === '➡️') {
                        message.reactions.resolve('➡️').users.remove(user.id);
                        currentPage = await results.next().then(doujin => doujin);
                        const { hentai, page, pages } = currentPage;
    
                        message.edit(
                            new MessageEmbed()
                                .setColor(getRandomHexColor())
                                .setTitle(`Found ${ total } search results for \`${ searchQuery }\` (sorted by popularity)`)
                                .setDescription(`${
                                    hentai.map(doujin => `__Title__: ${ doujin.title || doujin.cleanTitle }\n__Code__: ${ doujin.id }\n\n`).join('')
                                }`)
                                .setFooter(`Page • ${ page }/${ pages }`)
                        );
                    }
                });
            }).catch(async err => {
                console.error(err);
                await initialMessage.delete();
                message.reply('an error ocurred while processing your command :(');
            });
        }).catch(err => console.error(err));
    }
};
