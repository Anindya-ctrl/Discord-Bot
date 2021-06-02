function commandHandler(client, aliases, callback) {
    client.on('message', message => {
        if(message.author.bot || message.channel.type === 'dm') return ;
        
        if(typeof aliases === 'string') aliases = [ aliases ];

        const PREFIX = process.env.PREFIX;
        const { content } = message;

        for(const alias of aliases) {
            const command = `${ PREFIX }${ alias }`;

            if(content === command || content.startsWith(`${ command } `)) {
                console.log(`Running the command -> ${ command }`);

                return callback(message);
            }
        }
    });
}

module.exports = commandHandler;
