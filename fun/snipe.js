const { MessageEmbed } = require('discord.js');
const getRandomHexColor = require('../functions/getRandomHexColor');

const formatAttachmentURLs = attachmentURLs => {
    let formattedMessage = '';

    attachmentURLs.forEach((attachmentURL, index) => {
        formattedMessage += `\n[Attachment (${ index + 1 })](${ attachmentURL })`;
    });

    return formattedMessage;
}

function snipe(message, deletedMessages) {
    const { content, guild } = message;
    let deletedMessageNumber = content.split(/[ ]+/)[1];
    const deletedMessagesForThisGuild = deletedMessages.get(guild.id);

    if(!deletedMessageNumber) deletedMessageNumber = 1;
    if(!+deletedMessageNumber || deletedMessageNumber > 10 || deletedMessageNumber < 1) return message.reply('make sure to provide an integer number between 1 to 10~');
    if(!deletedMessagesForThisGuild || deletedMessagesForThisGuild.length < deletedMessageNumber) return message.reply('couldn\'t find that deleted message for this server, the bot must\'ve restarted and lost the data... :smiling_face_with_tear:');

    const requestedMessage = deletedMessagesForThisGuild[deletedMessagesForThisGuild.length - deletedMessageNumber]

    const {
        member: responsibleMember,
        message: deletedMessage,
        channelName,
        deletedAt,
    } = requestedMessage;

    const {
        text,
        attachmentURLs,
    } = deletedMessage;

    const snipeEmbed = new MessageEmbed()
        .setColor(getRandomHexColor())
        .setAuthor(responsibleMember.username, responsibleMember.displayAvatarURL({ dynamic : true }))
        .setFooter(`Deleted from #${ channelName } • ${ deletedAt.fromNow() }`);

    message.reply(
        text && attachmentURLs ? snipeEmbed.setDescription(`${ text.length <= 1000 ? text : `${ text.slice(0, 1000) }...` }${ formatAttachmentURLs(attachmentURLs) }`)
        : !text && attachmentURLs ? snipeEmbed.setDescription(`${ formatAttachmentURLs(attachmentURLs) }`)
        : snipeEmbed.setDescription(text.length <= 1000 ? text : `${ text.slice(0, 1000) }...`)
    );
}

module.exports = snipe;
