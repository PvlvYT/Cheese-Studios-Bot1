const fs = require('fs');
module.exports = {
	name: 'reload',
    aliases: ['r'],
    description: 'Reloads a command',
    ownerOnly: true,
    args: true,
	execute(message, args) {
        const customEmojis = message.client.customEmojis

        if (args[0].toLowerCase() == 'all') {
            data = [];
            message.client.commands.forEach(command => {
                delete require.cache[require.resolve(`./${command.name}.js`)];

                try {
                    const newCommand = require(`./${command.name}.js`);
                    message.client.commands.set(newCommand.name, newCommand);
                    data.push(`${command.name} ${customEmojis.success}`);
                } catch (error) {
                    console.error(error);
                    data.push(`${command.name} ${customEmojis.fail}: \`${error.message}\``);
                }
            });
            message.channel.send(data, {split: true});
            return
        }
		const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
        if (!command) {
            return message.reply(`There is no such command`);
        }

        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.react(customEmojis.success);
        } catch (error) {
            console.error(error);
            message.react(customEmojis.fail);
            message.channel.send(`\`${command.name}\`: \`${error.message}\``);
        }
	},
};