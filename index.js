const Discord = require('discord.js');
const client = new Discord.Client();

const commandHandler = require('./functions/commandHandler');
require('dotenv').config();

client.on('ready', () => console.log('CringeGod69 is ready to make everyone cringe~'));

commandHandler(client, [ 'ping', 'hi', 'hello' ], message => {
    message.channel.send('pong');
});

client.login(process.env.BOT_TOKEN);
