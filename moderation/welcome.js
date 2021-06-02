const command = require('../functions/commandHandler');
const welcomeSchema = require('../schema/welcomeSchema');
const { welcomeMessageCache, onMemberJoin } = require('../functions/onMemberJoin');
const connectToMongoDB = require('../functions/connectToMongoDB');

function welcome(client) {
    command(client, ['setWelcome', 'sw'], async message => {
        const { member, content, guild, channel } = message;
        if(!member.hasPermission('ADMINISTRATOR')) return message.reply('you don\'t have the required permission(s) to run this command~');

        const welcomeMessage = content.split(/[ ]+/).slice(1).join(' ');
        if(!welcomeMessage) return message.reply('please provide a message that you\'d like to set as the welcome message~');

        welcomeMessageCache[guild.id] = [channel.id, welcomeMessage];

        await connectToMongoDB().then(async mongoose => {
            try {
                await welcomeSchema.findOneAndUpdate({
                    _id: guild.id,
                }, {
                    _id: guild.id,
                    channelId: channel.id,
                    welcomeMessage,
                }, {
                    upsert: true,
                    useFindAndModify: false
                });

                message.reply(`set welcome message for this server: ${ welcomeMessage }`)
                    .then(message => setTimeout(() => message.delete(), 5000));
            } finally {
                mongoose.connection.close();
            }
        });
    });

    client.on('guildMemberAdd', member => onMemberJoin(member));
    
    command(client, ['simulateJoin', 'simJoin'], message => message.member.hasPermission('ADMINISTRATOR') ? onMemberJoin(message.member) : message.reply('you don\'t have the required permission(s) to run this command~'));
}

module.exports = welcome;
