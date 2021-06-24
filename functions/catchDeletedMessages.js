const deletedMessages = new Map();
const moment = require('moment');

const getAttachmentURLs = attachments => {
    const iterableAttachments = attachments.array();
    const attachmentURLs = [];

    for(const attachment of iterableAttachments) {
        attachmentURLs.push(attachment.url);
    }

    return attachmentURLs;
}

function catchDeletedMessages(client) {
    client.on('messageDelete', message => {
        const { content, author, channel, attachments } = message;
        if(author.bot || channel.type === 'dm') return ;

        const { id: channelId } = channel;
        const deletedMessagesForThisChannel = deletedMessages.get(channelId);
        
        const attachmentURLs = getAttachmentURLs(attachments);
        const deletedAt = moment();

        const savableMessage = content && attachments.size ? {
            text: content,
            attachmentURLs,
        } : !content && attachments.size ? {
            attachmentURLs,
        } : {
            text: content,
        };
        
        if(deletedMessagesForThisChannel) {
            if(deletedMessagesForThisChannel.length >= 10) deletedMessagesForThisChannel.shift();
            
            deletedMessages.set(channelId, [...deletedMessagesForThisChannel, {
                member: author,
                message: savableMessage,
                deletedAt,
            }]);
        } else {
            deletedMessages.set(channelId, [{
                member: author,
                message: savableMessage,
                deletedAt,
            }]);
        }
    });
}

module.exports = {
    deletedMessages,
    catchDeletedMessages,
};
