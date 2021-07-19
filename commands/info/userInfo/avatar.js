const { MessageEmbed } = require('discord.js');
const getRandomHexColor = require('../../../functions/getRandomHexColor');

module.exports = {
    aliases: ['avatar', 'av', 'pfp', 'dp'],
    maxArguments: 1,
    expectedArguments: '<member_mention>(optional)',
    execute: message =>  {
        const { mentions, guild, author } = message;
    
        const targetUser = mentions.users.first() || author;
        const targetMember = guild.members.cache.get(targetUser.id);

        const InfoEmbed = new MessageEmbed()
            .setTitle(`**User Avatar of** ${ targetMember.user.tag }`)
            .setColor(getRandomHexColor())
            .setImage(targetUser.displayAvatarURL({ dynamic : true, size: 4096 }) || 'https://cdn.discordapp.com/embed/avatars/0.png')
            .setFooter(`Requested by • ${ author.tag }`);

        message.reply(InfoEmbed);
    }
};
