const { MessageEmbed } = require('discord.js');
const getRandomHexColor = require('../../functions/getRandomHexColor');

module.exports = {
    aliases: ['serverInfo', 'sInfo', 'si'],
    execute: message =>  {
        const { guild, author } = message;
        const { name, owner, region, memberCount, createdAt, emojis, roles, afkTimeout } = guild;

        const guildEmojis = emojis.cache.map(emoji => `${ emoji }`);
        const joinedGuildEmojis = guildEmojis.join(', ');
        const guildRoles = roles.cache.map(role => `${ role }`);
        const joinedGuildRoles = guildRoles.join(', ');

        const InfoEmbed = new MessageEmbed()
            .setTitle('**Server Info :face_with_monocle:**')
            .setThumbnail(guild.iconURL())
            .setColor(getRandomHexColor())
            .addField('Name', name, true)
            .addField('Owner', owner, true)
            .addField('Region', region, true)
            .addField('Member count', memberCount, true)
            .addField('Created on', createdAt, true)
            .addField('AFK timeout', `${ afkTimeout / 60 }min`, true)
            .addField(`Emojis(${ guildEmojis.length })`, guildEmojis.length && guildEmojis.length <= 10 ? joinedGuildEmojis : guildEmojis.length > 10 ? `${ guildEmojis.slice(0, 10) }... and ${ guildEmojis.length - 10 } more.` : 'N/A')
            .addField(`Roles(${ guildRoles.length })`, guildRoles.length && guildRoles.length <= 10 ? joinedGuildRoles : guildRoles.length > 10 ? `${ guildRoles.slice(0, 10) }... and ${ guildRoles.length - 10 } more.` : 'N/A')
            .setFooter(`Requested by • ${ author.tag }`)
            .setTimestamp();

            message.reply(InfoEmbed);
    }
};
