const getRandomHexColor = require('../functions/getRandomHexColor');

function snipe(client, Discord, message, deletedMessages) {
    const { content, guild } = message;
    const deletedMessageNumber = content.split(/[ ]+/)[1];
    const deletedMessagesForThisGuild = deletedMessages.get(guild.id);

    if(!+deletedMessageNumber || deletedMessageNumber > 10 || deletedMessageNumber < 1) return message.reply('make sure to provide an integer number from 1 to 10~');
    if(!deletedMessagesForThisGuild || deletedMessagesForThisGuild.length < deletedMessageNumber) return message.reply('couldn\'t find that deleted message for this server, the bot must\'ve restarted and lost the data... :smiling_face_with_tear:');

    const responsibleMember = deletedMessagesForThisGuild[deletedMessagesForThisGuild.length - deletedMessageNumber].member;
    const deletedMessage = deletedMessagesForThisGuild[deletedMessagesForThisGuild.length - deletedMessageNumber].message;
    const snipeEmbed = new Discord.MessageEmbed()
        .setColor(getRandomHexColor())
        .setTitle('Got exposed b- :smiling_face_with_tear:')
        .addField('Member', responsibleMember)
        .addField('Message', (deletedMessage.length <= 1000 ? deletedMessage : `${ deletedMessage.slice(0, 1000) }...`) || '*Cannot snipe some types of messages yet, will add the feature soon ;)*')
        .setFooter('Time', client.user.displayAvatarURL())
        .setTimestamp();

    message.reply(snipeEmbed);
}

module.exports = snipe;
