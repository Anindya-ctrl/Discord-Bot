const getRandomHexColor = require('../functions/getRandomHexColor');

function kick(client, Discord, message) {
    const { member, mentions, author } = message;
    
    if(!member.hasPermission('ADMINISTRATOR') && !member.hasPermission('KICK_MEMBERS')) {
        return message.reply('you do not have the required permission to run this command, sed lol~');
    }

    const targetUser = mentions.users.first();

    if(!targetUser) {
        message.reply('bruh... you actually didn\'t mention a valid member lol~');
    } else if(message.author.id === targetUser.id) {
        message.reply('you dumdum trynna kick yourself lol you depressed or something?');
    } else {
        // KICK THE SHIT OUT
        const targetMember = message.guild.members.cache.get(targetUser.id);

        targetMember.kick().then(() => {
            const kickEmbed = new Discord.MessageEmbed()
                .setColor(getRandomHexColor())
                .setTitle('Kicked the shit out :smiling_face_with_tear:')
                .addField('Kicked', targetUser)
                .addField('Responsible member', author)
                .setFooter('Time:', client.user.displayAvatarURL())
                .setTimestamp();

            message.reply(kickEmbed);
        }).catch(error => {
            message.reply('shit an unexpected error just occured... :smiling_face_with_tear:');
            console.error(error);
        }); 
    }
}

module.exports = kick;
