const { MessageEmbed } = require('discord.js');
const getRandomHexColor = require("../functions/getRandomHexColor");

function getServerInfo(client, message) {
        const { guild, author } = message;
        const { name, owner, region, memberCount, createdAt, emojis, roles, afkTimeout } = guild;
        const guildEmojis = emojis.cache.map(emoji => `${ emoji }`).join(', ');
        const guildRoles = roles.cache.map(role => `${ role }`).join(', ');

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
            .addField(`Emojis(${ guildEmojis.split(', ').length })`, guildEmojis.length && guildEmojis.length <= 500 ? guildEmojis : guildEmojis.length > 500 ? `${ guildEmojis.slice(0, 500) }...` : 'N/A')
            .addField(`Roles(${ guildRoles.split(', ').length })`, guildRoles.length && guildRoles.length <= 500 ? guildRoles : guildRoles.length > 500 ? `${ guildRoles.slice(0, 500) }...` : 'N/A')
            .addField('Requested by', author)
            .setFooter('Time', client.user.displayAvatarURL())
            .setTimestamp();

            message.reply(InfoEmbed);
}

module.exports = getServerInfo;
