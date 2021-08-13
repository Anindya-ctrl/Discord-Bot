const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const getRandomHexColor = require('../../functions/getRandomHexColor');

module.exports = {
    aliases: 'dog',
    description: 'Get a random dog image.',
    maxArguments: 0,
    execute: async message =>  {
        const { author, channel } = message;
        const initialMessage = await channel.send('Searching, please wait a moment...');
        const fetchURL = 'https://api.thedogapi.com/v1/images/search';

        let data;
        await axios.get(fetchURL)
            .then(res => data = res.data)
            .catch(err => console.error(err));

        const catEmbed = new MessageEmbed()
            .setColor(getRandomHexColor())
            .setTitle('Random dog image :dog:')
            .setImage(data[0].url)
            .setFooter(`Requested by • ${ author.tag }`);

        initialMessage.delete();
        channel.send(catEmbed);
    }
};
