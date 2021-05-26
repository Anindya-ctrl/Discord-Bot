const axios = require('axios');
const getRandomHexColor = require('../functions/getRandomHexColor');

async function cat(client, Discord, message) {
    const { author, channel } = message;
    const initialMessage = await channel.send('Searching, please wait a moment...');
    const fetchURL = 'https://api.thedogapi.com/v1/images/search';
    
    let data;
    await axios.get(fetchURL)
        .then(res => data = res.data)
        .catch(err => console.error(err));

    const catEmbed = new Discord.MessageEmbed()
        .setColor(getRandomHexColor())
        .setTitle('Random dog image :dog:')
        .setImage(data[0].url)
        .addField('Requested by', author)
        .setFooter('Time:', client.user.displayAvatarURL())
        .setTimestamp();

    initialMessage.delete();
    channel.send(catEmbed);
}

module.exports = cat;
