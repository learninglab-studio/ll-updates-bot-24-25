const llog = require('learninglab-log');
const at = require('../utils/ll-airtable-tools');

exports.testing = async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`the bot is running, <@${message.user}>!`);
}

exports.parseAll = async ({ client, message, say, event }) => {
    llog.gray(message)
    // saving everything this bot can hear to Airtable updates for now.
    const atResult = await at.addRecord({
        baseId: process.env.AIRTABLE_UPDATES_BASE_ID,
        table: "Updates",
        record: {
            SlackTs: message.ts,
            SlackJson: JSON.stringify(message, null, 4),
            ThreadTs: message.thread_ts ? message.thread_ts : message.ts,
            Text: message.text,
            User: message.user,
            Channel: message.channel
        }
    })
}
