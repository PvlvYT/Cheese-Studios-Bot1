module.exports = {
    name: 'shutdown',
    aliases: ['off'],
    description: '',
    ownerOnly: true,
    execute(message, args) {
        const client = message.client
        const customEmojis = client.customEmojis
        message.react(customEmojis.success).then(() => {
            client.destroy()
        })
    },
};