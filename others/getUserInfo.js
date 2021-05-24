const getRandomHexColor = require('../functions/getRandomHexColor');
const moment = require('moment');

function getUserInfo(client, Discord, message) {
    const { mentions, guild, author } = message;

    const targetUser = mentions.users.first();

    if(!targetUser) {
        message.reply('bruh... you actually didn\'t mention a valid member lol~');
    } else {
        const targetMember = guild.members.cache.get(targetUser.id);
        const targetMemberRoles = targetMember.roles.cache.map(role =>`${ role }`);

        const InfoEmbed = new Discord.MessageEmbed()
            .setTitle('**User Reveal :eyes:**')
            .setColor(getRandomHexColor())
            .setThumbnail(targetUser.avatarURL() || 'https://cdn.discordapp.com/embed/avatars/0.png')
            .addField('Username', targetUser.username)
            .addField('Nickname', targetMember.nickname || 'N/A')
            .addField('Status', targetUser.presence.status)                                                // ALWAYS SHOWS OFFLINE FOR SOME SEASON :(
            .addField('Bot', `${ targetUser.bot }`)
            .addField('Joined on', moment.utc(targetMember.joinedAt).format('dddd, MMMM Do, YYYY'))
            .addField('Account created on', moment.utc(targetUser.createdAt).format('dddd, MMMM Do, YYYY'))
            .addField(`Roles(${ targetMemberRoles.length })`, targetMemberRoles.join(', '))
            .addField('Requested by', author)
            .setFooter('Time:', client.user.displayAvatarURL())
            .setTimestamp();

        message.reply(InfoEmbed);
    }
}

module.exports = getUserInfo;
