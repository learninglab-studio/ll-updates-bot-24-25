const { yellow, grey, red, cyan, blue, magenta, divider } = require("learninglab-log")
const at = require('../../utils/ll-airtable-tools');

module.exports = async ({ message, client, say, updateRecord, user }) => {
    magenta(`checking for image on updateRecord`, updateRecord)
    try {
        let channelInfo = await client.conversations.info({ channel: message.channel });
        yellow(channelInfo);
        if (message.files && channelInfo.channel.is_member) {
            magenta(`handling attachment because we're a member of that channel`)
            var publicResult
            if (["mp4", "mov"].includes(message.files[0].filetype)) {
                // if (message.files[0].size < 50000000) {
                //     const gifResult = await makeGif({
                //         file: message.files[0],
                //         client: client,
                //     })
                //     magenta(gifResult)
                // }
                yellow(`got a movie, not doing anything about that right now`)
                blue(message)
            } else {
                try {

                    publicResult = await client.files.sharedPublicURL({
                        token: process.env.SLACK_USER_TOKEN,
                        file: message.files[0].id,
                    });
        
                    const theRecord = {
                        baseId: process.env.AIRTABLE_UPDATES_BASE_ID,
                        table: "Images",
                        record: {
                            "Id": `${message.files[0].name}-${message.event_ts}`,
                            "Title": message.files[0].title,
                            "FileName": message.files[0].name,
                            "MarkdownForSlackUrl": `![alt text](${makeSlackImageURL(message.files[0].permalink, message.files[0].permalink_public)})`,
                            "SlackFileInfoJson": JSON.stringify(message.files[0], null, 4),
                            // "SlackFileInfoJSON": JSON.stringify(fileInfo, null, 4),
                            "ImageFiles": [
                                {
                                "url": makeSlackImageURL(message.files[0].permalink, message.files[0].permalink_public)
                                }
                            ],
                            "SlackUrl": makeSlackImageURL(message.files[0].permalink, message.files[0].permalink_public),
                            "PostedBySlackUser": message.files[0].user,
                            "SlackTs": message.event_ts,
                            "Updates": [updateRecord.id],
                            "User": [user]
                        }
                    }
                    magenta(divider)
                    cyan(theRecord)
                    const airtableResult = await at.addRecord(theRecord) 
        
                    const mdPostResult = await client.chat.postMessage({
                        channel: message.channel,
                        thread_ts: message.ts,
                        unfurl_media: false,
                        unfurl_links: false,
                        parse: "none",
                        text: `here's the markdown for embedding the image: \n\`\`\`![alt text](${makeSlackImageURL(message.files[0].permalink, message.files[0].permalink_public)})\`\`\``
                    })
                    return({
                        airtableResult: airtableResult,
                        slackResult: mdPostResult
                    })
                } catch (error) {
                    console.log(error)
                    return("there was an error")
                }
                
            }
        } else {
            red("there was no file attached to this message or we aren't a member")
        }
    } catch (error) {
        red(error)
    }
    
}


function makeSlackImageURL (permalink, permalink_public) {
    let secrets = (permalink_public.split("slack-files.com/")[1]).split("-")
    let suffix = permalink.split("/")[(permalink.split("/").length - 1)]
    let filePath = `https://files.slack.com/files-pri/${secrets[0]}-${secrets[1]}/${suffix}?pub_secret=${secrets[2]}`
    return filePath
}
  