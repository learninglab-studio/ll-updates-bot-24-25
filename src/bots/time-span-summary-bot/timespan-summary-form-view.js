const createView = ({ user, trigger_id, commandText, channelId }) => {    
    const metadata = JSON.stringify({ slash_command_channel: channelId });
    const theView = {
        trigger_id: trigger_id,
        view: {
          type: 'modal',
          callback_id: 'timespan_summary_submission',
          private_metadata: metadata, 
          title: {
            type: 'plain_text',
            text: 'Updates Bot'
          },
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
                                    "text": "And now select one or more channels to scrape."
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "input",
                    "block_id": "channel_select_block",
                    "element": {
                        "type": "multi_channels_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select channels",
                            "emoji": true
                        },
                        "action_id": "multi_channels_select_action"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Label",
                        "emoji": true
                    }
                }
            ],
            submit: {
                type: 'plain_text',
                text: 'Submit'
            }
        }
    };
    return theView;
};

module.exports = createView;
