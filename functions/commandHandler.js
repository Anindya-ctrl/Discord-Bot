require('dotenv').config();

function commandHandler(client, aliases, callback) {
    if(typeof aliases === 'string') aliases = [ aliases ];

    client.on('message', message => {
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
