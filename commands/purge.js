const fs = require('fs');

module.exports = {
	name: 'purge',
    description: 'monke erases history',
    perms: true,
    args: true,
	execute(message, args) {
        if (!args[0] || isNaN(args[0])) {
            return message.reply('No amount specified');
        } else if (args[0] < 1 || args[0] > 100) {
            return message.reply('Invalid amount specified');
        }

        message.delete().then(() => {
            message.channel.bulkDelete(args[0]);
        });
	},
};