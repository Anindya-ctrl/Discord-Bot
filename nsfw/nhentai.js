const { MessageEmbed } = require('discord.js');
const { API } = require('nhentai-api');
const api = new API();
const getRandomHexColor = require('../functions/getRandomHexColor');

async function nhentai(client, message) {
    const { channel, content } = message;
    if(!channel.nsfw) return message.react('🚫').catch(() => {});
    
    const searchKey = content.split(/[ ]+/).slice(1).join(' ');
    if(!+searchKey || searchKey.length !== 6) return message.reply('make sure to provide a 6 digit code so I can search for a certain doujin');

    const initialMessage = await message.reply('searching, sit tight...');
    let currentPage = 1;

    api.getBook(searchKey).then(async doujin => {
        const { title, tags, cover, id, favorites, pages } = doujin;

        const embedTitle = `\`${ title.english || 'N/A' }\` | \`${ title.japanese || 'N/A' }\``;
        const embedThumbnail = api.getImageURL(cover);
        const embedTags = tags.reduce((res, tag) => {
            res.push(tag.name);

            return res;
        }, []).join(', ');
        const embedImage = api.getImageURL(pages[currentPage - 1]);
        const embedFooter = `Page: ${ currentPage }/${ pages.length }`;

        const replyEmbed = new MessageEmbed()
            .setColor(getRandomHexColor())
            .setTitle(embedTitle)
            .setThumbnail(embedThumbnail)
            .addField('Tags', embedTags)
            .addField('Code', id)
            .addField('Favorites', favorites)
            .setImage(embedImage)
            .setFooter(embedFooter);

        initialMessage.delete();
        await channel.send(replyEmbed).then(async message => {
            await message.react('⬅️');
            await message.react('➡️');

            client.on('messageReactionAdd', (reaction, user) => {
                if(reaction.message.id === message.id && reaction.emoji.name === '⬅️') {
                    message.reactions.resolve('⬅️').users.remove(user.id);
                    currentPage !== 1 ? currentPage -= 1 : currentPage = pages.length;

                    message.edit(
                        new MessageEmbed()
                            .setColor(getRandomHexColor())
                            .setTitle(embedTitle)
                            .setThumbnail(embedThumbnail)
                            .addField('Tags', embedTags)
                            .addField('Code', id)
                            .addField('Favorites', favorites)
                            .setImage(api.getImageURL(pages[currentPage - 1]))
                            .setFooter(`Page: ${ currentPage }/${ pages.length }`)
                    );
                } else if(reaction.message.id === message.id && reaction.emoji.name === '➡️') {
                    message.reactions.resolve('➡️').users.remove(user.id);
                    currentPage !== pages.length ? currentPage += 1 : currentPage = 1;

                    message.edit(
                        new MessageEmbed()
                            .setColor(getRandomHexColor())
                            .setTitle(embedTitle)
                            .setThumbnail(embedThumbnail)
                            .addField('Tags', embedTags)
                            .addField('Code', id)
                            .addField('Favorites', favorites)
                            .setImage(api.getImageURL(pages[currentPage - 1]))
                            .setFooter(`Page: ${ currentPage }/${ pages.length }`)
                    );
                }
            });
        });
        console.log(doujin);
    }).catch(err => {
        console.error(err);
        initialMessage.delete();
        message.reply('an error ocurred while processing your command :(');
    });
}

module.exports = nhentai;
