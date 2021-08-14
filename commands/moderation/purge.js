module.exports = {
    aliases: ['purge', 'pg'],
    description: 'Deletes messages in a channel',
    maxArguments: 1,
    expectedArguments: '<message_count(optional)>',
    permissionError: 'you don\'t have the required permission(s) to run this command~',
    requiredPermisions: 'ADMINISTRATOR',
    cooldown: 5,
    execute: (message, arguments) =>  {
        const { channel } = message;
        let [ messageCount ] = arguments;
        if(!+messageCount || messageCount < 0) messageCount = 0;
        if(messageCount > 49) messageCount = 49

        return channel.messages.fetch({ limit: +messageCount + 1 }).then(results => (
            channel.bulkDelete(results)
        )).catch(err => console.error(err));
    }
};
