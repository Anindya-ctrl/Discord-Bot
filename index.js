const Discord = require('discord.js');
const client = new Discord.Client();

const command = require('./functions/commandHandler');
const kick = require('./moderation/kick');
const ban = require('./moderation/ban');
const unban = require('./moderation/unban');
require('dotenv').config();

client.on('ready', () => console.log('CringeGod69 is ready to make everyone cringe~'));

// TEST
command(client, [ 'ping', 'hi', 'test' ], message => {
    if(!message.member.hasPermission('BAN_MEMBERS')) return ;
    else message.channel.send('pong');
});

// MODERATION
command(client, 'kick', message => kick(client, Discord, message));

command(client, 'ban', message => ban(client, Discord, message));

command(client, 'unban', message => unban(message));

// MUSIC [COMING SOON]
// FUN [COMING SOON]

client.login(process.env.BOT_TOKEN);
