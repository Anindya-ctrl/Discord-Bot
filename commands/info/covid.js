const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const getRandomHexColor = require('../../functions/getRandomHexColor');
const formatLongNumber = require('../../functions/formatLongNumber');

module.exports = {
    aliases: ['covid', 'cv'],
    maxArguments: 1,
    expectedArguments: '<country_name>(optional)',
    execute: async (message, arguments, client) =>  {
        const { author, channel } = message;
        const initialMessage = await channel.send('Fetching data, please wait a moment...');

        const [ countryName ] = arguments;
        const fetchURL = countryName ? `https://coronavirus-19-api.herokuapp.com/countries/${ countryName.toLowerCase() }` : 'https://coronavirus-19-api.herokuapp.com/all';
        const adviceForPublic = '[Advice for public](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public)';
        let data ;

        await axios.get(fetchURL)
            .then(res => data = res.data)
            .catch(err => console.error(err));

        if(data === 'Country not found') {
            initialMessage.delete();
            return message.reply('country not found, please make sure to provide a valid country name~');
        }

        const {
            cases,
            deaths,
            recovered,
            country,
            totalTests='N/A',
            todayCases='N/A',
            todayDeaths='N/A',
            casesPerOneMillion='N/A',
            deathsPerOneMillion='N/A',
            testsPerOneMillion='N/A',
        } = data;

        const COVIDEmbed = new MessageEmbed()
            .setColor(getRandomHexColor())
            .setTitle(country ? `COVID-19 information for ${ country }` : 'Global information of COVID-19')
            .setThumbnail('https://www.fda.gov/files/covid19-1600x900.jpg')
            .addField('Cases', formatLongNumber(cases), true)
            .addField('Deaths', formatLongNumber(deaths), true)
            .addField('Recovered', formatLongNumber(recovered), true)
            .setFooter(`Requested by • ${ author.tag }`)
            .setTimestamp();
    
        initialMessage.delete();
        channel.send(
            !countryName ? COVIDEmbed.addField('Let\'s stop covid together!', adviceForPublic) : COVIDEmbed
                .addField('Total tests', formatLongNumber(totalTests), true)
                .addField('Total cases today', formatLongNumber(todayCases), true)
                .addField('Total deaths today', formatLongNumber(todayDeaths), true)
                .addField('Cases per million', formatLongNumber(casesPerOneMillion), true)
                .addField('Deaths per million', formatLongNumber(deathsPerOneMillion), true)
                .addField('Tests per million', formatLongNumber(testsPerOneMillion), true)
                .addField('Let\'s stop covid together!', adviceForPublic)
        );
    }
};
