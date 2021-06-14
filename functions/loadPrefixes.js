const customPrefixes = {};
const connectToMongoDB = require('./connectToMongoDB');
const prefixSchema = require('../schema/prefixSchema');

async function loadPrefixes(client) {
    await connectToMongoDB('moderation').then(async mongoose => {
        try {
            for(const guild of client.guilds.cache) {
                const guildId = guild[1].id;
                const prefixDoc = await prefixSchema.findOne({ _id: guildId });
                
                if(prefixDoc) customPrefixes[guildId] = prefixDoc.prefix;
            }
        } finally {
            mongoose.connection.close();
        }
    });
}

module.exports = {
    customPrefixes,
    loadPrefixes,
};
