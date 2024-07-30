const llog = require('learninglab-log')

exports.testing = async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`the bot is running, <@${message.user}>!`);
}

exports.parseAll = async ({ client, message, say, event }) => {
    llog.gray(message)
}

