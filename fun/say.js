const discordTTS = require('discord-tts');
const command = require('../functions/commandHandler');

function speak(client) {
    command(client, 'say', message => {
        const { member, content } = message;
        const voiceChannel = member.voice.channel;
        if(!voiceChannel) return message.reply('make sure to join a voice channel to run this command ;)');
        
        const broadcast = client.voice.createBroadcast();
        const permissions = voiceChannel.permissionsFor(client.user);
        if(!permissions.has('CONNECT') || !permissions.has('SPEAK')) return message.reply('please make sure I have the required permissions to connect and speak in that channel~');
    
        const textToSpeak = content.split(/[ ]+/).slice(1).join(' ');
        if(!textToSpeak) return message.reply('please provide the text you want me to speak~');
        if(textToSpeak.length > 200) return message.reply('please keep the text length within 200 characters~');
    
        voiceChannel.join().then(connection => {
            broadcast.play(discordTTS.getVoiceStream(textToSpeak));
            const dispatcher = connection.play(broadcast);
    
            dispatcher.on('speaking', () => {
                client.on('message', message => {
                    switch(message.content) {
                        case 'sStop':
                            dispatcher.end();
                            return message.react('✔️');
                        case 'sLeave':
                            return voiceChannel.leave();
                        default:
                            return ;
                    }
                });
            });
        });
    });
}

module.exports = speak;
