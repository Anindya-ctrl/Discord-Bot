const { MessageEmbed } = require('discord.js');
const { API } = require('nhentai-api');
const api = new API();
const getRandomHexColor = require('../functions/getRandomHexColor');

function nhentai(message) {
    const { channel, content } = message;
    if(!channel.nsfw) return message.react('🚫').catch(() => {});
    
    const searchKey = content.split(/[ ]+/).slice(1).join(' ');
    if(!+searchKey) return message.reply('make sure to provide a code so I can search for a certain doujin');

    if(+searchKey) {
        api.getBook(searchKey).then(book => {
            const { title, tags, cover } = book;
    
            const replyEmbed = new MessageEmbed()
                .setColor(getRandomHexColor())
                .addField('Titles', `__English:__ ${ title.english || 'N/A' }, __Japanese:__ ${ title.japanese || 'N/A' }`)
                .addField('Tags', 
                    tags.reduce((res, tag) => {
                        res.push(tag.name);
    
                        return res;
                    }, []).join(', ')
                )
                .addField('Code', book.id)
                .addField('Favorites', book.favorites)
                .addField('Pages', book.pages.length)
                .setImage(api.getImageURL(cover));
            message.reply(replyEmbed);
        }).catch(err => console.error(err));
    } else {
        // api.search(searchKey).then(book => {
        //     console.log(book);
        // }).catch(err => console.error(err));
    }
}

module.exports = nhentai;
