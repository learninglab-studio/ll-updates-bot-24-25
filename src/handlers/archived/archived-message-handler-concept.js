const llog = require('learninglab-log');
const at = require('../utils/ll-airtable-tools');

exports.testing = async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`the bot is running, <@${message.user}>!`);
}

exports.parseAll = async ({ client, message, say, event }) => {
    llog.gray(message)

    let createdBy = null;
    let user = global.BOT_CONFIG.Users.find(user => user.SlackId === message.user);

    if (user) {
        createdBy = user.id;
    } else {
        // If user is not found, query Airtable to find or add the user
        const workerResult = await at.findOneByValue({
            baseId: process.env.AIRTABLE_UPDATES_BASE_ID,
            table: "_WORKERS",
            field: "SLACK_ID",
            value: message.user
        });

        if (workerResult) {
            const userResult = await at.addRecord({
                baseId: process.env.AIRTABLE_UPDATES_BASE_ID,
                table: "Users",
                record: {
                    _WORKER_RECORD: workerResult.id,
                    Name: workerResult.fields.SLACK_USERNAME
                }
            })
            createdBy = userResult.id
            global.BOT_CONFIG.Users.push({
                id: userResult.id,
                Name: userResult.fields.Name, // Adjust according to your Airtable fields
                SlackId: userResult.fields.SlackId
            });
        } else {
            llog.red(`couldn't find user in WORKERS table`)
        }
    }

    const atResult = await at.addRecord({
        baseId: process.env.AIRTABLE_UPDATES_BASE_ID,
        table: "Updates",
        record: {
            SlackTs: message.ts,
            SlackJson: JSON.stringify(message, null, 4),
            ThreadTs: message.thread_ts ? message.thread_ts : message.ts,
            Text: message.text,
            User: [createdBy],
            SlackUserId: message.user,
            Channel: message.channel
        }
    })
}
