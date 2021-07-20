const connectToMongoDB = require('../../functions/connectToMongoDB');
const AFKSchema = require('../../schema/AFKSchema');
const moment = require('moment');

const { AFKMessageCache } = require('../../info/afk');

module.exports = {
    aliases: 'afk',
    cooldown: 10,
    expectedArguments: '<afk_message(optional)>',
    execute: (message, arguments) =>  {
        const { author, guild, member } = message;
        const keyId = `${ guild.id }${ author.id }`;

        let AFKMessage = arguments.join(' ') || 'AFK';
        if(AFKMessage.length > 500) AFKMessage = 'AFK';

        const at = moment();
        AFKMessageCache.set(keyId, {
            AFKMessage,
            at,
        });

        connectToMongoDB('info').then(async mongoose => {
            try {
                await AFKSchema.findOneAndUpdate({
                    _id: keyId,
                }, {
                    _id: keyId,
                    AFKMessage,
                    at,
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
    }
};
