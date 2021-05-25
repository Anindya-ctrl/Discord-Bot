// const Discord = require('discord.js');
// const client = new Discord.Client();
const ytdl = require('ytdl-core');

async function musicMain(message) {
    // client.on('message', message => {
        const { content, member, client, channel } = message;
        const voiceChannel = member.voice.channel;
        if(!voiceChannel) return message.reply('make sure to join a voice channel to run this command ;)');
    
        const permissions = voiceChannel.permissionsFor(client.user);
        if(!permissions.has('CONNECT') || !permissions.has('SPEAK')) return message.reply('please make sure I have the required permissions to connect and speak in that channel~');
    
        const urlPattern = new RegExp('^(https:\\/\\/)'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator            
        
        const URL = content.replace(`${ process.env.PREFIX }play `, '').split(/[ ]+/).find(elem => urlPattern.test(elem));
        if(!URL) return message.reply('make sure you provide a youtube video link~');

        const songInfo = await ytdl.getInfo(URL).catch(err => {
            console.error(err);
            message.reply('an unexpected error occured while processing your command... :smiling_face_with_tear:');
        });
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
        }

        const connection = await voiceChannel.join();
        const dispatcher = connection.play(ytdl(song.url, { filter: 'audioonly' }));

        channel.send(`Now playing \`${ song.title }\``);

        dispatcher.on('finish', () => {
            channel.send(`Finished playing \`${ song.title }\``);
            voiceChannel.leave();
        });
    // });
}

module.exports = musicMain
