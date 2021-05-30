const Discord = require('discord.js');
const client = new Discord.Client();
client.setMaxListeners(100);

// FUNCTIONS
const command = require('./functions/commandHandler');
const { deletedMessages, catchDeletedMessages } = require('./functions/catchDeletedMessages');
catchDeletedMessages(client);

// require('dotenv').config();

client.on('ready', () => {
    console.log('ready to roll~');
    
    client.user.setPresence({
        activity: {
            name: 'in development',
            type: 'PLAYING',
        },
    });
});

// TEST
command(client, [ 'ping', 'hi', 'test' ], message => {
    message.channel.send('pong');
});

// MODERATION
const kick = require('./moderation/kick');
const ban = require('./moderation/ban');
// const unban = require('./moderation/unban');

command(client, 'kick', message => kick(client, Discord, message));
command(client, 'ban', message => ban(client, Discord, message));
// command(client, 'unban', message => unban(message));

// INFO
const covid = require('./info/covid');
const getUserInfo = require('./info/getUserInfo');
const getServerInfo = require('./info/getServerInfo');

command(client, 'covid', message => covid(client, Discord, message));
command(client, 'reveal', message => getUserInfo(client, Discord, message));
command(client, 'serverInfo', message => getServerInfo(client, Discord, message));

// MUSIC
const music = require('./music/musicMain');

command(client, 'play', message => music(message));

// FUN
const cat = require('./fun/cat');
const dog = require('./fun/dog');
const snipe = require('./fun/snipe');

command(client, 'cat', message => cat(client, Discord, message));
command(client, 'dog', message => dog(client, Discord, message));
command(client, [ 'sp', 'snipe' ], message => snipe(Discord, message, deletedMessages));

// OTHERS
// const help = require('./others/help');

// command(client, 'help', message => help(client, Discord, message));

client.login(process.env.BOT_TOKEN);
