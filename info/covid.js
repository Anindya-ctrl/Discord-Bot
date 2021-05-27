const axios = require('axios');
const getRandomHexColor = require('../functions/getRandomHexColor');

const getPercentageIfNumber = arg => typeof arg === 'number' ? `${ arg / 10000 }%` : arg;

async function covid(client, Discord, message) {
    const { content, author, channel } = message;
    const initialMessage = await channel.send('Fetching data, please wait a moment...');
    
    const countryName = content.split(/[ ]+/)[1];
    const fetchURL = countryName ? `https://coronavirus-19-api.herokuapp.com/countries/${ countryName.toLowerCase() }` : 'https://coronavirus-19-api.herokuapp.com/all';
    let data;
    
    await axios.get(fetchURL)
        .then(res => data = res.data)
        .catch(err => console.error(err));
    
    if(data === 'Country not found') {
        initialMessage.delete();
        return message.reply('country not found, please make sure to provide a valid country name~');
    }

    const { cases, deaths, recovered, country, todayCases='N/A', todayDeaths='N/A', casesPerOneMillion='N/A', deathsPerOneMillion='N/A', testsPerOneMillion='N/A', totalTests='N/A' } = data;
    const COVIDEmbed = new Discord.MessageEmbed()
        .setColor(getRandomHexColor())
        .setTitle(country ? `COVID-19 information for ${ country }` : 'Global information of COVID-19')
        .setThumbnail('https://www.fda.gov/files/covid19-1600x900.jpg')
        .addField('Cases', cases, true)
        .addField('Deaths', deaths, true)
        .addField('Recovered', recovered, true)
        .addField('Total tests', totalTests, true)
        .addField('Total cases today', todayCases, true)
        .addField('Total deaths today', todayDeaths, true)
        .addField('percentage of cases', getPercentageIfNumber(casesPerOneMillion), true)
        .addField('Percentage of deaths', getPercentageIfNumber(deathsPerOneMillion), true)
        .addField('Percentage of tests', getPercentageIfNumber(testsPerOneMillion), true)
        .addField('Requested by', author)
        .setFooter('Time', client.user.displayAvatarURL())
        .setTimestamp();

    initialMessage.delete();
    channel.send(COVIDEmbed);
}

module.exports = covid;
