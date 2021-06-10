const { MessageEmbed } = require('discord.js');
const getRandomHexColor = require('../functions/getRandomHexColor');

function snipe(message, deletedMessages) {
    const { content, guild } = message;
    let deletedMessageNumber = content.split(/[ ]+/)[1];
    const deletedMessagesForThisGuild = deletedMessages.get(guild.id);

    if(!deletedMessageNumber) deletedMessageNumber = 1;
    if(!+deletedMessageNumber || deletedMessageNumber > 10 || deletedMessageNumber < 1) return message.reply('make sure to provide an integer number between 1 to 10~');
    if(!deletedMessagesForThisGuild || deletedMessagesForThisGuild.length < deletedMessageNumber) return message.reply('couldn\'t find that deleted message for this server, the bot must\'ve restarted and lost the data... :smiling_face_with_tear:');

    const responsibleMember = deletedMessagesForThisGuild[deletedMessagesForThisGuild.length - deletedMessageNumber].member;
    const deletedMessage = deletedMessagesForThisGuild[deletedMessagesForThisGuild.length - deletedMessageNumber].message;

    const {
        text,
        attachmentURL,
        sentAt,
    } = deletedMessage;

    const snipeEmbed = new MessageEmbed()
        .setColor(getRandomHexColor())
        .setTitle('Got exposed b- :smiling_face_with_tear:')
        .addField('Member', responsibleMember)
        .setFooter(`Sent • ${ sentAt.fromNow() }`)

    message.reply(
        text && attachmentURL ? snipeEmbed.addField('Message', (text.length <= 1000 ? text : `${ text.slice(0, 1000) }...`)).setImage(attachmentURL)
        : !text && attachmentURL ? snipeEmbed.setImage(attachmentURL)
        : snipeEmbed.addField('Message', (text.length <= 1000 ? text : `${ text.slice(0, 1000) }...`))
    );
}

module.exports = snipe;
