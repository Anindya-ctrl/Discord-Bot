const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const getRandomHexColor = require('../../../functions/getRandomHexColor');

module.exports = {
    aliases: ['reveal', 'rv', 'whois'],
    maxArguments: 1,
    expectedArguments: '<member_mention(optional)>',
    execute: message =>  {
        const { mentions, guild, author } = message;
        let targetUser = mentions.users.first() || author;

        const targetMember = guild.members.cache.get(targetUser.id);
        const targetMemberRoles = targetMember.roles.cache.map(role =>`${ role }`);

        const InfoEmbed = new MessageEmbed()
            .setTitle('**User Reveal :eyes:**')
            .setColor(getRandomHexColor())
            .setThumbnail(targetUser.displayAvatarURL({ dynamic : true }) || 'https://cdn.discordapp.com/embed/avatars/0.png')
            .addField('Username', targetUser.username)
            .addField('Nickname', targetMember.nickname || 'N/A')
            .addField('Status', targetUser.presence.status)
            .addField('Bot', `${ targetUser.bot }`)
            .addField('Joined on', moment.utc(targetMember.joinedAt).format('dddd, MMMM Do, YYYY'))
            .addField('Account created on', moment.utc(targetUser.createdAt).format('dddd, MMMM Do, YYYY'))
            .addField(`Roles(${ targetMemberRoles.length })`, targetMemberRoles.join(', '))
            .addField('Requested by', author)
            .setFooter(`Requested by • ${ author.tag }`)
            .setTimestamp();

        message.reply(InfoEmbed);
    }
};
