const command = require('../functions/commandHandler');
const connectToMongoDB = require('../functions/connectToMongoDB');
const AFKSchema = require('../schema/AFKSchema');
const { customPrefixes } = require('../functions/loadPrefixes');

const AFKMessageCache = new Map();

function afk(client) {
    // LISTEN FOR AFK MEMBER MESSAGE
    client.on('message', async message => {
        const { author, content, guild, member, channel } = message;
        if(author.bot || content.startsWith(`${ customPrefixes[guild.id] }afk`)) return ;
        const keyId = `${ guild.id }${ author.id }`;
    
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

            channel.send(`Welcome back ${ author }, I've removed your afk.`);
        }
    });

    // LISTEN FOR AFK MEMBER MENTION
    client.on('message', message => {
        const { author, content, mentions, guild, channel } = message;
        if(author.bot || content.includes('@everyone') || content.includes('@here')) return ;

        
        mentions.users.forEach(user => {
            const keyId = `${ guild.id }${ user.id }`;

            if(AFKMessageCache.has(keyId)) {
                channel.send(`${ user.username } is afk: ${ AFKMessageCache.get(keyId) }`);
            }
        });
    });

    // SET AFK
    command(client, 'afk', async message => {
        const { content, author, guild, member } = message;
        const keyId = `${ guild.id }${ author.id }`;

        const AFKMessage = content.split(/[ ]+/).slice(1).join(' ') || 'AFK';
        if(AFKMessage.length > 500) return message.reply('please keep the afk message length within 500 characters~');

        AFKMessageCache.set(keyId, AFKMessage);

        await connectToMongoDB('info').then(async mongoose => {
            try {
                await AFKSchema.findOneAndUpdate({
                    _id: keyId,
                }, {
                    _id: keyId,
                    AFKMessage,
                }, {
                    upsert: true,
                    useFindAndModify: false
                });
                
                const { nickname, user } = member;
                
                if(nickname && !nickname.startsWith('[AFK] ')) {
                    member.setNickname(`[AFK] ${ nickname }`).catch(err => {});
                } else if (!nickname && !user.username.startsWith('[AFK] ')) {
                    member.setNickname(`[AFK] ${ user.username }`).catch(err => {});
                }

                message.reply(`you are now AFK: ${ AFKMessage }`);
            } finally {
                mongoose.connection.close();
            }
        });
    });
}

module.exports = {
    AFKMessageCache,
    afk
};
