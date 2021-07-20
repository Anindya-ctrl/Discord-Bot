module.exports = {
    aliases: 'test',
    execute: message =>  {
        return message.channel.send('working~')
    }
};
