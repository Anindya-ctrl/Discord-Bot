function reactOnOwnerMention(client) {
    client.on('message', message => {
        const { mentions, guild } = message;

        mentions.users.forEach(user => {
            if(user.id === guild.owner.id) return message.react('852889379500195851');
        });

    });
}

module.exports = reactOnOwnerMention;
