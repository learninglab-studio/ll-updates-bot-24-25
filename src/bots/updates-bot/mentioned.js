const llog = require("learninglab-log");

module.exports = async ({ client, message, say, event }) => {
    llog.yellow(`got a mention: ${message.user} in ${message.channel}`)
    llog.magenta(message)
    const initialResult = await client.chat.postMessage({
        channel: message.channel,
        text: `hello <@${message.user}>! I'm working on developing the ability to respond to you. Channel: <#C06KHNRBYKU>`,
        thread_ts: message.ts
    })
    llog.green(initialResult)
    const interativeResult = await client.chat.postMessage({
        channel: message.channel,
        blocks: [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Timespan Summary",
                    "emoji": true
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "This slash command will help you get a quick summary of one or more slack channels for a specified range of time. *Please note that the ll-updates-bot bust be added to the channel(s) for this to work.*"
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "rich_text",
                "elements": [
                    {
                        "type": "rich_text_section",
                        "elements": [
                            {
                                "type": "text",
                                "text": "Please input the start and stop dates for the summary."
                            }
                        ]
                    }
                ]
            },
            {
                "type": "actions",
                block_id: "datepicker_block",
                "elements": [
                    {
                        "type": "datepicker",
                        "initial_date": "2024-07-01",
                        "action_id": "timespan_start"
                    },
                    {
                        "type": "datepicker",
                        "initial_date": "2024-12-31",
                        "action_id": "timespan_stop"
                    }
                ]
            },
            {
                "type": "divider"
            },
            {
                "type": "rich_text",
                "elements": [
                    {
                        "type": "rich_text_section",
                        "elements": [
                            {
                                "type": "text",
                                "text": "And now select one or more channels to scrape <#C07EHBVRSHL|updates>."
                            }
                        ]
                    }
                ]
            },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Click Me",
                                "emoji": true
                            },
                            "value": "click_me_123",
                            "action_id": "actionId-0"
                        }
                    ]
                }
            
        ],
        thread_ts: message.ts
    })

}

