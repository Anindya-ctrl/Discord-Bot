const connectToMongoDB = require('../functions/connectToMongoDB');
const AFKSchema = require('../schema/AFKSchema');
const { recentRunRecords } = require('../commands/CommandBase');
const { customPrefixes } = require('../functions/loadPrefixes');
const moment = require('moment');

const AFKMessageCache = new Map();

function afk(client) {
    // LISTEN FOR AFK MEMBER MESSAGE
    client.on('message', async message => {
        const { author, content, guild, member, channel } = message;
        if(author.bot || channel.type === 'dm') return ;

        const keyId = `${ guild.id }${ author.id }`;
        const prefixForThisGuild = customPrefixes[guild.id] || process.env.PREFIX;

        if(
            recentRunRecords.includes(`${ keyId }-afk`) ||
            content.startsWith(`${ prefixForThisGuild }afk`) ||
            content.startsWith(`${ prefixForThisGuild }afk `)
        ) return ;

        if(AFKMessageCache.has(keyId)) {
            AFKMessageCache.delete(keyId);
        
            await connectToMongoDB('info').then(async mongoose => {
                try {
                    await AFKSchema.deleteOne({ _id: keyId });
                } finally {
                    mongoose.connection.close();
                }
            });
    
            const { nickname, user } = member;

            if(nickname && nickname.startsWith('[AFK] ')) {
                if(nickname.replace('[AFK] ', '') === user.username) {
                    member.setNickname('').catch(err => {});
                } else {
                    member.setNickname(nickname.replace('[AFK] ', '')).catch(err => {});
                }
            }

            channel.send(`Welcome back ${ author }, I've removed your afk.`)
                .then(message => setTimeout(() => message.delete(), 8 * 1000));
        }
    });

    // LISTEN FOR AFK MEMBER MENTION
    client.on('message', message => {
        const { author, content, mentions, guild, channel } = message;
        if(
            author.bot ||
            channel.type === 'dm' ||
            content.includes('@everyone') ||
            content.includes('@here')
        ) return ;

        mentions.users.forEach(user => {
            const keyId = `${ guild.id }${ user.id }`;
            
            if(AFKMessageCache.has(keyId)) {
                const { username, discriminator } = user;
                const AFKMessageForThisMember = AFKMessageCache.get(keyId);

                channel.send(`${ username }#${ discriminator } is afk: ${ AFKMessageForThisMember.AFKMessage } • ${ moment(AFKMessageForThisMember.at).fromNow() }`);
            }
        });
    });
}

module.exports = {
    AFKMessageCache,
    afk
};
