const { MessageEmbed, MessageMentions } = require('discord.js');
const getRandomHexColor = require('../functions/getRandomHexColor');

function ban(client, message) {
    const { member, content, mentions, author, guild } = message;
    
    if(!member.hasPermission('ADMINISTRATOR') && !member.hasPermission('BAN_MEMBERS')) {
        return message.reply('you do not have the required permission to run this command');
    }

    const targetUser = mentions.users.first();

    const reason = content.split(/[ ]+/).slice(1).join(' ').replace(MessageMentions.USERS_PATTERN, '');
    if(reason.length > 1000) return message.reply('please keep the reason within 1000 characters~');

    if(!targetUser) {
        message.reply('you didn\'t mention a valid member lol~');
    } else if(author.id === targetUser.id) {
        message.reply('you dumdum trynna ban yourself you depressed or something?');
    } else {
        // BAN THE SHIT OUT
        const targetMember = guild.members.cache.get(targetUser.id);

        targetMember.ban().then(() => {
            const banEmbed = new MessageEmbed()
                .setColor(getRandomHexColor())
                .setTitle('Banned the shit out :smiling_face_with_tear:')
                .addField('Banned', targetMember)
                .addField('Reason', reason || 'N/A')
                .addField('Responsible member', author)
                .setFooter('Time', client.user.displayAvatarURL())
                .setTimestamp();

            const banEmbedForBannedMember = new MessageEmbed()
                .setColor(getRandomHexColor())
                .setTitle(`You were banned from \`${ guild }\` :smiling_face_with_tear:`)
                .addField('Banned by', author)
                .addField('Reason', reason || 'N/A')
                .setFooter('Time', client.user.displayAvatarURL())
                .setTimestamp();

            message.reply(banEmbed);
            targetUser.send(banEmbedForBannedMember).catch(err => console.error(err));
        }).catch(error => {
            message.reply('an unexpected error occured while processing your command... :smiling_face_with_tear:');
            console.error(error);
        }); 
    }
}

module.exports = ban;
