async function nqn(client, message) {
    const { content, channel, member, author } = message;
    let changeableMessage = content.split(/[ ]+/).slice(1).join(' ');

    // const emojisInMessage = changeableMessage.match(/:.+?:/g);
    // if(!emojisInMessage) return ;

    // await emojisInMessage.forEach(async emoji => {
    //     const emojiName = emoji.slice(1, emoji.length - 1);
    //     if(author.client.emojis.cache.find(authorEmoji => authorEmoji.name === emojiName)) return ;
    //     console.log('test');

    //     const clientEmoji = await client.emojis.cache.find(clinetEmoji => clinetEmoji.name === emojiName)?.toString();
    //     if(clientEmoji) changeableMessage = changeableMessage.replace(emoji, clientEmoji);
    //     console.log(clientEmoji);
    // });
    
    channel.createWebhook(member.nickname || author.username, {
        avatar: author.displayAvatarURL({ dynamic: true }),
    }).then(async webhook => {
        const { username } = webhook;
        
        await message.delete();
        await webhook.send(changeableMessage, {
            username,
            avatarURL: author.displayAvatarURL({ dynamic: true }),
        });
        
        webhook.delete();
    }).catch(err => console.error(err));
}

module.exports = nqn;
