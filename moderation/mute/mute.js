const command = require('../../functions/commandHandler');
const connectToRedis = require('../../functions/connectToRedis');
const { customPrefixes } = require('../../functions/loadPrefixes');
const onMemberJoin = require('./onMemberJoin');
const redisKeyPrefix = 'muted-';

function mute(client) {
    command(client, ['mute', 'm'], async message => {
        const { member, content, guild, mentions } = message;
        if(!member.hasPermission('ADMINISTRATOR')) return message.reply('you do not have the required permission to run this command~');

        const syntax = `\`${ customPrefixes[guild.id] }mute <@> <duration_in_number> <duration_type (m, h, d or perm)>\``;
        const [ mention, duration, durationType ] = content.split(/[ ]+/).slice(1);

        if(content.split(/[ ]+/).slice(1).length !== 3) return message.reply(`please use the correct syntax: ${ syntax }`);
        if(isNaN(duration)) return message.reply(`please provide a number as duration. syntax: ${ syntax }`);

        const validDurations = {
            m: 60,
            h: 60 * 60,
            d: 60 * 60 * 24,
            perm: -1,
        };
        if(!validDurations[durationType]) return message.reply(`please provide \`m\`, \`h\`, \`d\` or \`perm\` as duration type. syntax: ${ syntax }`);

        const targetUser = mentions.users.first();
        if(!targetUser) return message.reply(`please tag an user to mute. syntax: ${ syntax }`);

        const { id: targetUserId, name, discriminator } = targetUser;
        const durationInSeconds = duration * validDurations[durationType];

        const redisClient = await connectToRedis();
        try {
            const redisKey = `${ redisKeyPrefix }${ targetUserId }`;
            if(durationInSeconds < 0) {
                redisClient.set(redisKey, 'true');
            } else {
                redisClient.set(redisKey, 'true', 'EX', durationInSeconds);
            }

            message.reply(`Muted ${ targetUser } for ${ duration }${ durationType }`);
        } finally {
            redisClient.quit();
        }
    });

    command(client, ['simulateMutedMemberJoin', 'smmj'], message => message.member.hasPermission('ADMINISTRATOR') ? onMemberJoin( message.guild.members.cache.get(message.mentions.users.first().id), redisKeyPrefix) : message.reply('you don\'t have the required permission(s) to run this command~'));
    client.on('guildMemberAdd', member => onMemberJoin(member, redisKeyPrefix));
}

module.exports = mute
