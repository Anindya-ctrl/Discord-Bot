function kick(message) {
        const { member, mentions } = message;
        
        if(!member.hasPermission('ADMINISTRATOR') && !member.hasPermission('BAN_MEMBERS')) {
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
                message.reply(`kicked the shit out, won't be able to move for a while :smiling_face_with_tear:`);
            }).catch(error => {
                message.reply('shit an unexpected error just occured...');
                console.error(error);
            }); 
        }
}

module.exports = kick;
