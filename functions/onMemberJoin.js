const welcomeMessageCache = {};
const connectToMongoDB = require('./connectToMongoDB');
const welcomeSchema = require('../schema/welcomeSchema');
const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');
const path = require('path');

async function onMemberJoin(member) {
    const { guild, id: memberId } = member;
    const { id: guildId, channels } = guild;
    let welcomeDataForThisGuild = welcomeMessageCache[guildId];

    if(!welcomeDataForThisGuild) {
        await connectToMongoDB('moderation').then(async mongoose => {
            try {
                console.log('fetching from database~');

                const fetchedWelcomeDataForThisGuild = await welcomeSchema.findOne({ _id: guildId });
                if(!fetchedWelcomeDataForThisGuild) return ;
                
                const { channelId, welcomeMessage } = fetchedWelcomeDataForThisGuild;
                welcomeMessageCache[guildId] = welcomeDataForThisGuild = [channelId, welcomeMessage];
            } finally {
                mongoose.connection.close();
            }
        });
    }

    if(!welcomeDataForThisGuild) return ;
    
    const [ cachedChannelId, cachedWelcomeMessage ] = welcomeDataForThisGuild;
    const channel = channels.cache.get(cachedChannelId);

    // const canvas = Canvas.createCanvas(1920, 1080);
    // const canvasContext = canvas.getContext('2d');
    
    // const backgroundImage = await Canvas.loadImage('https://cdn.discordapp.com/attachments/810415154755665951/852908063433556029/file.jpg');
    // const userPfp = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));

    // let xAxis = 0;
    // let yAxis = 0;
    // canvasContext.drawImage(backgroundImage, xAxis, yAxis);

    // xAxis = canvas.width / 2 - userPfp.width / 2;
    // yAxis = canvas.height / 2 - userPfp.height / 2 - canvas.height / 5;
    // canvasContext.drawImage(userPfp, xAxis, yAxis, 400, 400);

    // canvasContext.fillStyle = '#ffffff';
    // canvasContext.font = '35px sans-serif';
    // let imageText = `Welcome Anindya~`;

    // xAxis = canvas.width / 2 - canvasContext.measureText(imageText).width / 2;
    // canvasContext.fillText(imageText, xAxis, 60 + userPfp.height);

    // const canvasAttachment = new MessageAttachment(canvas.toBuffer());
    // channel.send(cachedWelcomeMessage.replace(/<@>/g, `<@${ memberId }>`), canvasAttachment);

    channel.send(cachedWelcomeMessage.replace(/<@>/g, `<@${ memberId }>`));
}

module.exports = {
    welcomeMessageCache,
    onMemberJoin,
};
