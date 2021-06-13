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
        
        const { content, author, guild, channel, attachments } = message;
        if(author.bot) return ;

        const { id: guildId } = guild;
        const deletedMessagesForThisGuild = deletedMessages.get(guildId);
        
        const { name: channelName } = channel;
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
        
        if(deletedMessagesForThisGuild) {
            if(deletedMessagesForThisGuild.length >= 10) deletedMessagesForThisGuild.shift();
            
            deletedMessages.set(guildId, [...deletedMessagesForThisGuild, {
                member: author,
                message: savableMessage,
                channelName,
                deletedAt,
            }]);
        } else {
            deletedMessages.set(guildId, [{
                member: author,
                message: savableMessage,
                channelName,
                deletedAt,
            }]);
        }
    });
}

module.exports = {
    deletedMessages,
    catchDeletedMessages,
};
