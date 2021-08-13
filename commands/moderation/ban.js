const { MessageEmbed, MessageMentions } = require('discord.js');

module.exports = {
    aliases: 'ban',
    minArguments: 1,
    expectedArguments: '<member_mention> <reason(optional)>',
    requiredPermisions: 'ADMINISTRATOR',
    execute: (message, arguments) =>  {
        const { mentions, author, guild } = message;

        const targetUser = mentions.users.first();
        if(!targetUser) return message.reply('make sure to mention a member to ban~');

        const reason = arguments.join(' ').replace(MessageMentions.USERS_PATTERN, '').trim();
        if(reason.length > 1000) return message.reply('please keep the reason within 1000 characters~');

        if(author.id === targetUser.id) return message.reply('get some help >_>');
        
        const targetMember = guild.members.cache.get(targetUser.id);

        targetMember.ban().then(() => {
            const banEmbed = new MessageEmbed()
                .setColor('#cb1033')
                .setTitle(`Banned \`${ targetMember.user.tag }\``)
                .setDescription(`**Reason** • *${ reason || 'N/A' }*\n**Responsible moderator** • ${ author.tag }`)
                .setFooter(`ID: ${ targetMember.id }`)
                .setTimestamp();

            const banEmbedForbannedMember = new MessageEmbed()
                .setColor('#cb1033')
                .setTitle(`You were banned from \`${ guild }\``)
                .setDescription(`**Responsible moderator** • ${ author.tag }\n**Reason** • ${ reason || 'N/A' }`)
                .setTimestamp();

            message.reply(banEmbed);
            targetUser.send(banEmbedForbannedMember).catch(err => console.error(err));
        }).catch(error => {
            message.reply('an unexpected error occured while processing your command.');
            console.error(error);
        }); 
    }
};
