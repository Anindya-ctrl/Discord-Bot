const { customPrefixes } = require('../functions/loadPrefixes');
const validatePermissions = require('../functions/validatePermissions');
// require('dotenv').config();

let recentRunRecords = [];

function CommandBase(client, commandOptions) {
    let {
        aliases,
        minArguments = 0,
        maxArguments = null,
        expectedArguments = '',
        permissionError = 'you don\'t have the required permission(s) to run this command~',
        requiredRoles = [],
        requiredPermisions = [],
        cooldown = 0,
        cooldownMessage = 'whoa there, too soon.',
        execute,
    } = commandOptions;

    // CONVERT TO ARRAY IF STRING
    if(typeof aliases === 'string') aliases = [aliases];
    if(requiredRoles.length > 0 && typeof requiredRoles === 'string') requiredRoles = [requiredRoles];
    if(requiredPermisions.length > 0) {
        if(typeof requiredPermisions === 'string') requiredPermisions = [requiredPermisions];

        validatePermissions(requiredPermisions);
    }

    console.log(`Registering command: "${ aliases[0] }"`);

    // LISTEN FOR MESSAGE EVENTS
    client.on('message', message => {
        const { author, channel, content, member, guild } = message;
        if(author.bot || channel.type === 'dm') return ;

        const PREFIX = customPrefixes[guild?.id] || process.env.PREFIX;

        for(const alias of aliases) {
            const command = `${ PREFIX }${ alias }`;

            // CHECK IF A COMMAND HAS BEEN RUN
            if(content === command || content.startsWith(`${ command } `)) {
                console.log(`Running the command -> ${ command }`);

                // CHECK FOR REQUIRED PERMISSIONS
                for(const requiredPermision of requiredPermisions) {
                    if(!member.hasPermission(requiredPermision)) return message.reply(permissionError);
                }

                // CHECK FOR REQUIRED ROLES
                for(const requiredRole of requiredRoles) {
                    const role = guild.roles.cache.find(role => role.name === requiredRole);

                    if(!role || !member.roles.cache.has(role.id)) return message.reply(`you must have a **${ requiredRole }** role to run this command~`);
                }
                
                const arguments = content.split(/[ ]+/).slice(1);
                
                // COMPLAIN IF THE NUMBER OF PROVIED ARGUMENTS IS MORE OR LESS THAN NEEDED
                if(arguments.length < minArguments || (
                    maxArguments !== null && arguments.length > maxArguments
                    )) return message.reply(`the provided syntax is incorrect, run the command like this \`${ command } ${ expectedArguments }\``);

                // HANDLE COOLDOWN
                const cooldownKey = `${ guild.id }${ author.id }-${ aliases.join('-') }`;
                if(cooldown > 0 && recentRunRecords.includes(cooldownKey)) return message.reply(cooldownMessage);

                if(cooldown > 0) {
                    recentRunRecords.push(cooldownKey);
                    setTimeout(() => (
                        recentRunRecords = recentRunRecords.filter(
                            recentRunRecord => recentRunRecord !== cooldownKey
                        )
                    ), cooldown * 1000);
                }

                // RUN THE CALLBACK
                return execute(message, arguments, client);
            }
        };
    });
}

module.exports = {
    recentRunRecords,
    CommandBase
};
