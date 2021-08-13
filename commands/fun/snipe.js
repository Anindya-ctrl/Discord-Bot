const { MessageEmbed } = require('discord.js');
const { deletedMessages } = require('../../functions/catchDeletedMessages');
const getRandomHexColor = require('../../functions/getRandomHexColor');

const formatAttachmentURLs = attachmentURLs => {
    let formattedMessage = '';

    attachmentURLs.forEach((attachmentURL, index) => {
        formattedMessage += `\n[Attachment (${ index + 1 })](${ attachmentURL })`;
    });

    return formattedMessage;
}

module.exports = {
    aliases: [ 'snipe', 's' ],
    description: 'Get upto 10 latest deleted messages per channel.',
    minArguments: 0,
    maxArguments: 1,
    expectedArguments: '<message_number(optional)>',
    execute: (message, arguments) =>  {
        const { channel } = message;
        let [ deletedMessageNumber ] = arguments;
        const deletedMessagesForThisChannel = deletedMessages.get(channel.id);
    
        if(!deletedMessageNumber) deletedMessageNumber = 1;
        if(!+deletedMessageNumber || deletedMessageNumber > 10 || deletedMessageNumber < 1) return message.reply('make sure to provide an integer number between 1 to 10~');
        if(!deletedMessagesForThisChannel || deletedMessagesForThisChannel.length < deletedMessageNumber) return message.reply('couldn\'t find that deleted message for this server, the bot must\'ve restarted and lost the data... :smiling_face_with_tear:');
    
        const requestedMessage = deletedMessagesForThisChannel[deletedMessagesForThisChannel.length - deletedMessageNumber]
    
        const {
            member: responsibleMember,
            message: deletedMessage,
            deletedAt,
        } = requestedMessage;
    
        const {
            text,
            attachmentURLs,
        } = deletedMessage;
    
        const snipeEmbed = new MessageEmbed()
            .setColor(getRandomHexColor())
            .setAuthor(`${ responsibleMember.username }#${ responsibleMember.discriminator }`, responsibleMember.displayAvatarURL({ dynamic : true }))
            .setFooter(deletedAt.fromNow());
    
        message.reply(
            text && attachmentURLs ? snipeEmbed.setDescription(`${ text.length <= 1000 ? text : `${ text.slice(0, 1000) }...` }${ formatAttachmentURLs(attachmentURLs) }`)
            : !text && attachmentURLs ? snipeEmbed.setDescription(`${ formatAttachmentURLs(attachmentURLs) }`)
            : snipeEmbed.setDescription(text.length <= 1000 ? text : `${ text.slice(0, 1000) }...`)
        );
    }
};
