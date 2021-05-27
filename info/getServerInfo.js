const getRandomHexColor = require("../functions/getRandomHexColor");

function getServerInfo(client, Discord, message) {
        const { guild, author } = message;
        const { name, owner, region, memberCount, createdAt, emojis, afkTimeout } = guild;
        const guildEmojis = emojis.cache.map(emoji => `${ emoji }`);

        const InfoEmbed = new Discord.MessageEmbed()
            .setTitle('**Server Info :face_with_monocle:**')
            .setThumbnail(guild.iconURL())
            .setColor(getRandomHexColor())
            .addField('Name', name)
            .addField('Owner', owner)
            .addField('Region', region)
            .addField('Member count', memberCount)
            .addField('Created on', createdAt)
            .addField('AFK timeout', `${ afkTimeout / 60 }min`)
            .addField(`Emoji(s)`, guildEmojis.length > 0 ? guildEmojis.length : 'N/A')
            .addField('Requested by', author)
            .setFooter('Time', client.user.displayAvatarURL())
            .setTimestamp();

            message.reply(InfoEmbed);
}

module.exports = getServerInfo;
