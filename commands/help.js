const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    aliases: ['cmds'],
	description: 'help command description',
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
            data.push(`Prefix: \`${prefix}\`\n`)
            data.push('Available Commands:');
            data.push('```');
            data.push(commands.map(command => command.name).join('\n'));
            data.push('```');
			data.push(`Use \`${prefix}help [command name]\` to get information on a specific command`);

			return message.channel.send(data, { split: true })
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('There is no such command');
		}

		data.push(`**name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
	},
};