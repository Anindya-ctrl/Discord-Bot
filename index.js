const Discord = require('discord.js');
const client = new Discord.Client();
client.setMaxListeners(100);

// FUNCTIONS
const command = require('./functions/commandHandler');
const { loadPrefixes } = require('./functions/loadPrefixes');
const { deletedMessages, catchDeletedMessages } = require('./functions/catchDeletedMessages');
catchDeletedMessages(client);

// require('dotenv').config();

client.on('ready', async () => {
    console.log('ready to roll~');
    
    client.user.setPresence({
        activity: {
            name: 'default prefix is now ~ run ~sp <new_prefix> to add a custom one',
            type: 'PLAYING',
        },
    });

    await loadPrefixes(client);

    // TEST
    command(client, 'test', message => {
        message.channel.send('working~');
    });
    
    // MODERATION
    const kick = require('./moderation/kick');
    const ban = require('./moderation/ban');
    // const unban = require('./moderation/unban');
    const welcome = require('./moderation/welcome');
    const setCustomPrefix = require('./moderation/setCustomPrefix');
    
    command(client, ['kick', 'k'], message => kick(client, message));
    command(client, ['ban', 'b'], message => ban(client, message));
    // command(client, 'unban', message => unban(message));
    welcome(client);
    command(client, ['setPrefix', 'sp'], message => setCustomPrefix(message));
    
    // INFO
    const covid = require('./info/covid');
    const getUserInfo = require('./info/getUserInfo');
    const getServerInfo = require('./info/getServerInfo');
    
    command(client, [ 'covid', 'c' ], message => covid(client, message));
    command(client, ['serverInfo', 'si'], message => getServerInfo(client, message));
    getUserInfo(client);
    
    // MUSIC
    const music = require('./music/musicMain');
    
    command(client, ['play', 'p'], message => music(message));
    
    // FUN
    const cat = require('./fun/cat');
    const dog = require('./fun/dog');
    const snipe = require('./fun/snipe');
    
    command(client, 'cat', message => cat(client, message));
    command(client, 'dog', message => dog(client, message));
    command(client, [ 's', 'snipe' ], message => snipe(message, deletedMessages));
    
    // OTHERS
    // const help = require('./others/help');
    
    // command(client, 'help', message => help(client, message));
});


client.login(process.env.BOT_TOKEN);
