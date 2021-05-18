const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

client.on('ready', () => console.log('CringeGod69 is ready to make everyone cringe~'));

client.login(process.env.BOT_TOKEN);
