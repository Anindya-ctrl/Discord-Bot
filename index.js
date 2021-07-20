const { Client } = require('discord.js');
const client = new Client();
client.setMaxListeners(1000);
const path = require('path');
const fs = require('fs');

// FUNCTIONS
const command = require('./functions/commandHandler');
const reactOnOwnerMention = require('./functions/reactOnOwnerMention');
const sendMessageOnNewServerJoin = require('./functions/sendMessageOnNewServerJoin');
const setBotPresence = require('./functions/setBotPresence');
const { loadPrefixes } = require('./functions/loadPrefixes');
const loadAFKMessages = require('./functions/loadAFKMessages');
const { deletedMessages, catchDeletedMessages } = require('./functions/catchDeletedMessages');
catchDeletedMessages(client);

// require('dotenv').config();

client.on('ready', async () => {
    console.log('ready to roll~');

    setBotPresence(client);
    reactOnOwnerMention(client);
    sendMessageOnNewServerJoin(client);
    await loadAFKMessages();
    await loadPrefixes(client);

    const commandsDirectory = 'commands';
    const baseFile = 'CommandBase.js';
    const { CommandBase } = require('./commands/CommandBase');

    function readCommands(commandsDirectory) {
        const commandFiles = fs.readdirSync(path.join(__dirname, commandsDirectory));

        for(const commandFile of commandFiles) {
            const currentCommandFilePath =path.join(__dirname, commandsDirectory, commandFile);
            const stat = fs.lstatSync(currentCommandFilePath);

            if(stat.isDirectory()) {
                readCommands(path.join(commandsDirectory, commandFile))
            } else if(commandFile !== baseFile) {
                const commandOptions = require(currentCommandFilePath);

                CommandBase(client, commandOptions);
            }
        }
    }
    readCommands(commandsDirectory);

    // MODERATION
    // const welcome = require('./moderation/welcome');
    const setCustomPrefix = require('./moderation/setCustomPrefix');

    // welcome(client);
    command(client, ['setPrefix', 'sp'], message => setCustomPrefix(message));

    // INFO
    const { afk } = require('./info/afk');

    afk(client);

    // MUSIC
    const music = require('./music/musicMain');
    
    command(client, ['play', 'p'], message => music(message));
    
    // FUN
    const cat = require('./fun/cat');
    const dog = require('./fun/dog');
    const snipe = require('./fun/snipe');
    const say = require('./fun/say');
    const nqn = require('./fun/nqn');
    
    command(client, 'cat', message => cat(client, message));
    command(client, 'dog', message => dog(client, message));
    command(client, [ 's', 'snipe' ], message => snipe(message, deletedMessages));
    say(client);
    command(client, '~', message => nqn(client, message));

    // NSFW
    const nhentai = require('./nsfw/nhentai');

    command(client, [ 'nhentai', 'nh' ], message => nhentai(client, message));

    // OTHERS
    const help = require('./others/help');
    const eval = require('./others/eval');
    
    help(client);
    command(client, 'eval', message => eval(message));
});

client.login(process.env.BOT_TOKEN);

// https://discord.com/api/oauth2/authorize?client_id=844158625069137930&permissions=4294967287&scope=bot
