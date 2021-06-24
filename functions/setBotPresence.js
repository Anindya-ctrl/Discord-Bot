function setBotPresence(client) {
    setInterval(() => {
        let totalMembers = 0;
        const guilds = client.guilds.cache.array();

        for(const guild of guilds) totalMembers += +guild.memberCount;
    
        client.user.setPresence({
            activity: {
                name: `${ guilds.length } guilds and ${ totalMembers } members | ${ process.env.PREFIX }help`,
                type: 'WATCHING',
            },
        });
    }, 60 * 1000);
}

module.exports = setBotPresence;
