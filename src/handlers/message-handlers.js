const llog = require('learninglab-log');
const at = require('../utils/ll-airtable-tools');
const imageToMarkdownBot = require('../bots/image-to-markdown-bot');

exports.testing = async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`the bot is running, <@${message.user}>!`);
}

exports.parseAll = async ({ client, message, say, event }) => {
    llog.gray(message)
    let createdBy = null;
    let user = global.BOT_CONFIG.Users.find(user => user.SlackId === message.user);
    if (user) {
        llog.green(`found user`, user)
        createdBy = user.id;
    } else {
       llog.blue(`couldn't find user`, message.user)
        try {
            const userInfo = await client.users.info({ user: message.user });
            llog.green(`userInfo`, userInfo)
            const slackUser = userInfo.user;
        // If user is not found, query Airtable to find or add the user
        const userResult = await at.addRecord({
            baseId: process.env.AIRTABLE_UPDATES_BASE_ID,
            table: 'Users',
            record: {
                SlackId: message.user,
                Name: slackUser.real_name || slackUser.name
            }
        });
        global.BOT_CONFIG.Users.push({
            id: userResult.id,
            Name: userResult.fields.Name, // Adjust according to your Airtable fields
            SlackId: userResult.fields.SlackId
        });
        createdBy = userResult.id 
        } catch (error) {
            llog.red(error)
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

    const imageToMarkdownCheck = await imageToMarkdownBot({ message, client, say })
}
