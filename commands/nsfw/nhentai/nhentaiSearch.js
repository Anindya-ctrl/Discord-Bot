const { NHentai } = require('nhentai.js-api');
const nhentai = new NHentai();
const { MessageEmbed } = require('discord.js');
const getRandomHexColor = require('../../../functions/getRandomHexColor');
const formatLongNumber = require('../../../functions/formatLongNumber');

const getDoujinInfo = doujin => `__Title__: ${ doujin.title || doujin.cleanTitle }\n__Code__: ${ doujin.id }\n[__Thumbnail__](${ doujin.cover })\n\n`;

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
            let { total, hentai, page, pages } = currentPage;
            if(hentai.length > 20) hentai = hentai.slice(0, 20);

            const embedTitle = `Found ${ formatLongNumber(total) } search results for \`${ searchQuery }\` (sorted by popularity)`;

            const replyEmbed = new MessageEmbed()
                .setColor(getRandomHexColor())
                .setTitle(embedTitle)
                .setFooter(`Page • ${ formatLongNumber(page) }/${ formatLongNumber(pages) }`);
            
            await initialMessage.delete().catch(err => {});
            channel.send(
                hentai.length === 0 ? replyEmbed :
                replyEmbed.setDescription(`${
                    hentai.map(getDoujinInfo).join('')
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
                        let { hentai, page, pages } = currentPage;
                        if(hentai.length > 20) hentai = hentai.slice(0, 20);

                        message.edit(
                            new MessageEmbed()
                                .setColor(getRandomHexColor())
                                .setTitle(embedTitle)
                                .setDescription(`${
                                    hentai.map(getDoujinInfo).join('')
                                }`)
                                .setFooter(`Page • ${ formatLongNumber(page) }/${ formatLongNumber(pages) }`)
                        );
                    } else if(reaction.message.id === message.id && reaction.emoji.name === '➡️') {
                        message.reactions.resolve('➡️').users.remove(user.id);

                        currentPage = await results.next().then(doujin => doujin);
                        let { hentai, page, pages } = currentPage;
                        if(hentai.length > 20) hentai = hentai.slice(0, 20);
    
                        message.edit(
                            new MessageEmbed()
                                .setColor(getRandomHexColor())
                                .setTitle(embedTitle)
                                .setDescription(`${
                                    hentai.map(getDoujinInfo).join('')
                                }`)
                                .setFooter(`Page • ${ formatLongNumber(page) }/${ formatLongNumber(pages) }`)
                        );
                    }
                });
            }).catch(async err => {
                console.error(err);
                await initialMessage.delete().catch(err => {});
                message.reply('an error ocurred while processing your command :(');
            });
        }).catch(err => console.error(err));
    }
};
