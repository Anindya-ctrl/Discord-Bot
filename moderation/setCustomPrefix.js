const connectToMongoDB = require('../functions/connectToMongoDB');
const prefixSchema = require('../schema/prefixSchema');
const { customPrefixes } = require('../functions/loadPrefixes');

async function setCustomPrefix(message) {
    const { member, content, guild } = message;
    if(!member.hasPermission('ADMINISTRATOR')) return message.reply('you do not have the required permission to run this command~');

    const { id: guildId } = guild
    const customPrefix = content.split(/[ ]+/)[1];
    if(!customPrefix) return message.reply('make sure to provide the new prefix~');

    await connectToMongoDB('moderation').then(async mongoose => {
        try {
            await prefixSchema.findOneAndUpdate({
                _id: guildId,
            }, {
                _id: guildId,
                prefix: customPrefix,
            }, {
                upsert: true,
                useFindAndModify: false
            });

            customPrefixes[guildId] = customPrefix;
        } finally {
            mongoose.connection.close();
        }
    });

    message.reply(`set my prefix for this server: **${ customPrefix }**`);
}

module.exports = setCustomPrefix;
