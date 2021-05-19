require('dotenv').config();

function commandHandler(client, aliases, callback) {
    client.on('message', message => {
        if(message.author.bot) return ;
        if(message.channel.type === 'dm') return ;
        
        if(typeof aliases === 'string') aliases = [ aliases ];

        const PREFIX = process.env.PREFIX;
        const { content } = message;

        aliases.forEach(alias => {
            const command = `${ PREFIX }${ alias }`;

            if(content === command || content.startsWith(command)) {
                console.log(`Running the command -> ${ command }`);

                callback(message);
            }
        });
    });
}

module.exports = commandHandler;
