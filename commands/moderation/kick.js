const { MessageEmbed, MessageMentions } = require('discord.js');

module.exports = {
    aliases: 'kick',
    minArguments: 1,
    expectedArguments: '<member_mention> <reason(optional)>',
    requiredPermisions: 'ADMINISTRATOR',
    execute: (message, arguments) =>  {
        const { mentions, author, guild } = message;
        
        const targetUser = mentions.users.first();

        const reason = arguments.join(' ').replace(MessageMentions.USERS_PATTERN, '').trim();
        if(reason.length > 1000) return message.reply('please keep the reason within 1000 characters~');

        if(author.id === targetUser.id) return message.reply('get some help >_>');
        
        const targetMember = guild.members.cache.get(targetUser.id);

        targetMember.kick().then(() => {
            const kickEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`Kicked \`${ targetMember.user.tag }\``)
                .setDescription(`**Reason** • ${ reason || 'N/A' }\n**Responsible moderator** • ${ author.tag }`)
                .setFooter(`ID: ${ targetMember.id }`)
                .setTimestamp();

            const kickEmbedForKickedMember = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`You were kicked out of \`${ guild }\``)
                .setDescription(`**Responsible moderator** • ${ author.tag }\n**Reason** • ${ reason || 'N/A' }`)
                .setTimestamp();

            message.reply(kickEmbed);
            targetUser.send(kickEmbedForKickedMember).catch(err => console.error(err));
        }).catch(error => {
            message.reply('an unexpected error occured while processing your command.');
            console.error(error);
        }); 
    }
};
