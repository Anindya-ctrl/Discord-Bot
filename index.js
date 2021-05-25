const Discord = require('discord.js');
const client = new Discord.Client();
client.setMaxListeners(100);

const command = require('./functions/commandHandler');

// MODERATION
const kick = require('./moderation/kick');
const ban = require('./moderation/ban');
// const unban = require('./moderation/unban');

// MUSIC
const music = require('./music/musicMain');

// FUN [COMING SOON]

// OTHERS
const getUserInfo = require('./others/getUserInfo');
const getServerInfo = require('./others/getServerInfo');
// const help = require('./others/help');

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
command(client, 'kick', message => kick(client, Discord, message));
command(client, 'ban', message => ban(client, Discord, message));

// command(client, 'unban', message => unban(message));

// MUSIC [COMING SOON]
command(client, 'play', message => music(message));

// FUN [COMING SOON]

// OTHERS
command(client, 'reveal', message => getUserInfo(client, Discord, message));
command(client, 'serverInfo', message => getServerInfo(client, Discord, message));
command(client, 'help', message => help(client, Discord, message));

client.login(process.env.BOT_TOKEN);
