function ban(client, Discord, message) {
    const { member, mentions, author } = message;
    
    if(!member.hasPermission('ADMINISTRATOR') && !member.hasPermission('BAN_MEMBERS')) {
        return message.reply('you do not have the required permission to run this command, sed lol~');
    }

    const targetUser = mentions.users.first();

    if(!targetUser) {
        message.reply('bruh... you actually didn\'t mention a valid member lol~');
    } else if(message.author.id === targetUser.id) {
        message.reply('you dumdum trynna ban yourself lol you depressed or something?');
    } else {
        // BAN THE SHIT OUT
        const targetMember = message.guild.members.cache.get(targetUser.id);

        targetMember.ban().then(() => {
            const banEmbed = new Discord.MessageEmbed()
                .setTitle('Banned the shit out :smiling_face_with_tear:')
                .addField('Banned', targetMember)
                .addField('Responsible member', author)
                .setFooter('Time:', client.user.displayAvatarURL())
                .setTimestamp();

            message.reply(banEmbed);
        }).catch(error => {
            message.reply('shit an unexpected error just occured...');
            console.error(error);
        }); 
    }
}

module.exports = ban;
