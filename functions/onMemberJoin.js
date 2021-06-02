const welcomeMessageCache = {};
const connectToMongoDB = require('./connectToMongoDB');
const welcomeSchema = require('../schema/welcomeSchema');

async function onMemberJoin(member) {
    const { guild, id: memberId } = member;
    const { id: guildId } = guild;
    let welcomeDataForThisGuild = welcomeMessageCache[guildId];

    if(!welcomeDataForThisGuild) {
        await connectToMongoDB().then(async mongoose => {
            try {
                console.log('fetching from database~');

                const fetchedWelcomeDataForThisGuild = await welcomeSchema.findOne({ _id: guildId });
                if(!fetchedWelcomeDataForThisGuild) return ;
                
                const { channelId, welcomeMessage } = fetchedWelcomeDataForThisGuild;
                welcomeMessageCache[guildId] = welcomeDataForThisGuild = [channelId, welcomeMessage];
            } finally {
                mongoose.connection.close();
            }
        });
    }

    if(!welcomeDataForThisGuild) return ;
    
    const [ cachedChannelId, cachedWelcomeMessage ] = welcomeDataForThisGuild;
    const channel = guild.channels.cache.get(cachedChannelId);

    channel.send(cachedWelcomeMessage.replace(/<@>/g, `<@${ memberId }>`));
}

module.exports = {
    welcomeMessageCache,
    onMemberJoin,
};
