const { MessageEmbed } = require('discord.js');

function sendMessageOnNewServerJoin(client) {
    const joinEmbed = new MessageEmbed()
        .setDescription('Sup nerds, what\'s shaking? **Jeff** here, the buggiest bot you can find. To get started, run `~help`. The default prefix is `~` however, it\'s customizable. Read the help message for details.');

    client.on('guildCreate', guild => {
        if(guild.systemChannel) return guild.systemChannel.send(joinEmbed).catch(() => {});

        return guild.channels.cache
            .find(channel => channel.type === 'text' && channel.permissionsFor(client.user).has('SEND_MESSAGES'))
            .send(joinEmbed)
            .catch(() => {});
    });
}

module.exports = sendMessageOnNewServerJoin;
