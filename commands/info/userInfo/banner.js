const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const getRandomHexColor = require('../../../functions/getRandomHexColor');

module.exports = {
    aliases: 'banner',
    maxArguments: 1,
    expectedArguments: '<member_mention>(optional)',
    execute: async message =>  {
        const { mentions, guild, author } = message;
    
        const targetUser = mentions.users.first() || author;
        const targetMember = guild.members.cache.get(targetUser.id);

        let banner ;
        await axios({
            url: `https://discord.com/api/v8/users/${ targetMember.id }`,
            method: 'GET',
            headers: {
                Authorization: `Bot ${ process.env.BOT_TOKEN }`,
            },
        }).then(res => {
            const bannerId = res?.data?.banner;
            banner = bannerId ?
                `https://cdn.discordapp.com/banners/${ targetMember.id }/${ bannerId }.${ bannerId.startsWith('a_') ? 'gif' : 'png' }?size=1024` :
                'https://cdn.discordapp.com/embed/avatars/0.png';
        }).catch(err => console.error(err));

        const InfoEmbed = new MessageEmbed()
            .setTitle(`**User Banner of** ${ targetMember.user.tag }`)
            .setColor(getRandomHexColor())
            .setImage(banner)
            .setFooter(`Requested by • ${ author.tag }`);

        message.reply(InfoEmbed);
    }
};
