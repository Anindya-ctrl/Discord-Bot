const { NHentai } = require('nhentai.js-api');
const nhentai = new NHentai();
const { MessageEmbed } = require('discord.js');
const getRandomHexColor = require('../../../functions/getRandomHexColor');

module.exports = {
    aliases: ['nhentai', 'nh'],
    description: 'Get doujins using 6-digit codes.',
    minArguments: 1,
    maxArguments: 1,
    expectedArguments: '<6-digit code>',
    execute: async (message, arguments, client) =>  {
        const { channel } = message;
        if(!channel.nsfw) return message.react('🚫').catch(() => {});
        
        const [ searchKey ] = arguments;
        if(!+searchKey || searchKey.length !== 6) return message.reply('make sure to provide a 6 digit code so I can search for a certain doujin');
    
        const initialMessage = await message.reply('searching, sit tight...');
        let currentPage = 1;

        nhentai.hentai(`https://nhentai.net/g/${ searchKey }`).then(async doujin => {
            const { title, cleanTitle, tags, cover, id, images, uploaded } = doujin;

            const embedTitle = title !== cleanTitle ? `\`${ title || 'N/A' }\` | \`${ cleanTitle || 'N/A' }\`` : title;
            const embedTags = tags.tags.reduce((res, { name, amountString }) => {
                res.push(`${ name }(${ amountString })`);
                return res;
            }, []).join(', ');
            const embedArtists = tags.artists.reduce((res, { name, amount }) => {
                res.push(`${ name }(${ amount })`);
                return res;
            }, []).join(', ');
            const embedImage = images[currentPage - 1];

            const replyEmbed = new MessageEmbed()
                .setColor(getRandomHexColor())
                .setTitle(embedTitle)
                .setThumbnail(cover)
                .addField('Tags', embedTags)
                .addField('Code', id)
                .addField('Artist(s)', embedArtists)
                // .addField('Favorites', favorites)
                .setImage(embedImage)
                .setFooter(`Page: ${ currentPage }/${ images.length } • Uploaded in ${ new Date(uploaded) }`);

            await initialMessage.delete();
            channel.send(replyEmbed).then(async message => {
                await message.react('⬅️');
                await message.react('➡️');
    
                let timeOver = false;
                setTimeout(() => timeOver = true, 60 * 60 * 1000);

                client.on('messageReactionAdd', (reaction, user) => {
                    if(timeOver) return ;
    
                    if(reaction.message.id === message.id && reaction.emoji.name === '⬅️') {
                        message.reactions.resolve('⬅️').users.remove(user.id);
                        currentPage !== 1 ? currentPage -= 1 : currentPage = images.length;

                        message.edit(
                            new MessageEmbed()
                                .setColor(getRandomHexColor())
                                .setTitle(embedTitle)
                                .setThumbnail(cover)
                                .addField('Tags', embedTags)
                                .addField('Artist(s)', embedArtists)
                                .addField('Code', id)
                                // .addField('Favorites', favorites)
                                .setImage(images[currentPage - 1])
                                .setFooter(`Page: ${ currentPage }/${ images.length } • Uploaded in ${ new Date(uploaded) }`)
                        );
                    } else if(reaction.message.id === message.id && reaction.emoji.name === '➡️') {
                        message.reactions.resolve('➡️').users.remove(user.id);
                        currentPage !== images.length ? currentPage += 1 : currentPage = 1;
    
                        message.edit(
                            new MessageEmbed()
                                .setColor(getRandomHexColor())
                                .setTitle(embedTitle)
                                .setThumbnail(cover)
                                .addField('Tags', embedTags)
                                .addField('Artist(s)', embedArtists)
                                .addField('Code', id)
                                // .addField('Favorites', favorites)
                                .setImage(images[currentPage - 1])
                                .setFooter(`Page: ${ currentPage }/${ images.length } • Uploaded in ${ new Date(uploaded) }`)
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
