const connectToRedis = require('../../functions/connectToRedis');

async function onMemberJoin(member, redisKeyPrefix) {
    const { id: memberId, guild, roles } = member;

    const redisClient = await connectToRedis();
    try {
        redisClient.get(`${ redisKeyPrefix }${ memberId }`, (err, res) => {
            if(err) return console.error('REDIS GET ERROR', err);

            if(res) {
                const muteRole = guild.roles.cache.find(role => role.name === 'Muted');

                if(muteRole) {
                    roles.add(muteRole);
                    console.log('Muted:', member);
                } else {
                    console.log('Couldn\'t find the required role');
                }
            } else {
                console.log('The user who just joined wasn\'t muted');
            }
        });
    } finally {
        redisClient.quit();
    }
}

module.exports = onMemberJoin;
