const { Client } = require('discord.js');
const client = new Client();
client.setMaxListeners(1000);

// FUNCTIONS
const command = require('./functions/commandHandler');
const { loadPrefixes } = require('./functions/loadPrefixes');
const { deletedMessages, catchDeletedMessages } = require('./functions/catchDeletedMessages');
catchDeletedMessages(client);

require('dotenv').config();

client.on('ready', async () => {
    console.log('ready to roll~');
    
    client.user.setPresence({
        activity: {
            name: 'default prefix is now ~ run ~sp <new_prefix> to add a custom one',
            type: 'PLAYING',
        },
    });

    // await loadPrefixes(client);

    // TEST
    command(client, 'test', message => {
        message.channel.send('working~');
    });
    
    // MODERATION
    const kick = require('./moderation/kick');
    const ban = require('./moderation/ban');
    const mute = require('./moderation/mute/mute');
    // const unban = require('./moderation/unban');
    const welcome = require('./moderation/welcome');
    const setCustomPrefix = require('./moderation/setCustomPrefix');
    
    command(client, ['kick', 'k'], message => kick(client, message));
    command(client, ['ban', 'b'], message => ban(client, message));
    mute(client);
    // command(client, 'unban', message => unban(message));
    welcome(client);
    command(client, ['setPrefix', 'sp'], message => setCustomPrefix(message));
    
    // INFO
    const covid = require('./info/covid');
    const getUserInfo = require('./info/getUserInfo');
    const getServerInfo = require('./info/getServerInfo');
    // const afk = require('./info/afk');
    
    command(client, [ 'covid', 'c' ], message => covid(client, message));
    command(client, ['serverInfo', 'si'], message => getServerInfo(client, message));
    getUserInfo(client);
    // afk(client);
    
    // MUSIC
    const music = require('./music/musicMain');
    
    command(client, ['play', 'p'], message => music(message));
    
    // FUN
    const cat = require('./fun/cat');
    const dog = require('./fun/dog');
    const snipe = require('./fun/snipe');
    const say = require('./fun/say');
    
    command(client, 'cat', message => cat(client, message));
    command(client, 'dog', message => dog(client, message));
    command(client, [ 's', 'snipe' ], message => snipe(message, deletedMessages));
    say(client);

    // OTHERS
    // const help = require('./others/help');
    
    // command(client, 'help', message => help(client, message));
});


client.login(process.env.BOT_TOKEN);
