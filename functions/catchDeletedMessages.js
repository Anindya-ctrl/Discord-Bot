const deletedMessages = new Map();
const moment = require('moment');

function catchDeletedMessages(client) {
    client.on('messageDelete', message => {
        const sentAt = moment();
        
        const { content, author, guild, attachments } = message;
        if(author.bot) return ;

        const { id } = guild;
        const deletedMessagesForThisGuild = deletedMessages.get(id);

        const savableMessage = content && attachments.size ? {
            text: content,
            attachmentURL: attachments.first().url,
            sentAt,
        } : !content && attachments.size ? {
            attachmentURL: attachments.first().url,
            sentAt,
        } : {
            text: content,
            sentAt,
        };
        
        if(deletedMessagesForThisGuild) {
            if(deletedMessagesForThisGuild.length >= 10) deletedMessagesForThisGuild.shift();
            
            deletedMessages.set(id, [...deletedMessagesForThisGuild, {
                member: author,
                message: savableMessage,
            }]);
        } else {
            deletedMessages.set(id, [{
                member: author,
                message: savableMessage,
            }]);
        }
    });
}

module.exports = {
    deletedMessages,
    catchDeletedMessages,
};
