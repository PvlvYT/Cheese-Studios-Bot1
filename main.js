const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, ownerId } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.customEmojis = require('./emojis.json');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
    console.log(`${client.user.username} is online.`);
    console.log(`Invite: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`);
    client.user.setPresence({ activity: {name: `for ${prefix}help`, type: `WATCHING`}});
})

client.on('message', message => { 
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) return;

    if (command.ownerOnly && message.author.id != ownerId) {
        return message.channel.send(`This command is owner-only, ${message.author}.`);
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}.`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime && message.author.id != ownerId) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.channel.send('There was an error trying to execute that command.');
    }

});

client.login(token);