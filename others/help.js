const { MessageEmbed } = require('discord.js');
const { customPrefixes } = require('../functions/loadPrefixes');

function help(client) {
    client.on('message', async message => {
        const { content, guild, author } = message;
        const customPrefixForThisGuild = customPrefixes[guild?.id];
        
        // __setWelcome__ or __sw__: set a welcome message for the newcomers [*the welcome message as an argument, <@> to ping the newcomer*]
        if(content === `${ process.env.PREFIX }help` || (customPrefixForThisGuild && content === `${ customPrefixForThisGuild }help`)) {
            const HelpEmbed = new MessageEmbed()
                .setTitle(`Command Help Menu for \`${ guild.name }\``)
                .setDescription(`
*Prefix for this server:* ${ customPrefixForThisGuild || process.env.PREFIX }
help command can always be run with the default prefix for your convenience.

🛡️ **Moderation**
__kick__ or __k__: kick a member from the server [*member mention as an argument*]
__ban__ or __b__: ban a member from the server [*member mention as an argument*]
__setPrefix__ or __sp__: set a custom prefix for the server [*new prefix as an argument*]
__setWelcome__ or __sw__: [*deprecated at the moment*]

ℹ️ **Info**
__covid__ or __c__: get global COVID-19 status [*a country name as an argument to get info on a specific country*]
__serverInfo__ or __si__: get info on the server
__reveal__ or __r__: get info on a server member [*member mention as an argument, no argument will result in info about yourself*]
__avatar__ or __pfp__: get a server member's user avatar [*member mention as an argument, no argument will return your avatar*]
__afk__: set your afk (Away From Keyboard) message [*the afk message as an argument*]

🤪 **Fun**
__cat__: get a random cat image
__dog__: get a random dog image
__say__ or __tts__: convert text to voice (sStop to stop speaking and sLeave to leave the voice channel while the bot is connected) [*the text as an argument*]
__snipe__ or __s__: get 10 recent deleted messages per channel [*integer from 1 to 10 as an argument to get a specific one, no argument will be assumed as 1*]

🎵 **Music**
__play__ or __p__: play audio of a youtube video [*youtube video link as an argument*]

🔞 **NSFW**
__nhentai__ or __nh__: search for a specific doujin with 6 digit code [*code as an argument*]

__**Note**__: This bot is in development and so, issues might occur (some commands might appear to be incomplete and/or messy and they are). Please wait for a few moments if it seems to have crashed. It will stay unusable while being developed. Also, the bot is hosted on heroku for free (without credit card), so it might go offline anytime. That's all, have fun! :)
                `)
                .setTimestamp();
    
            await author.send(HelpEmbed);
            message.react('✅');
        }
    });
}

module.exports = help;
