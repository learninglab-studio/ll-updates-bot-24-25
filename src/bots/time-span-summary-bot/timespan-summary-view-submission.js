const llog = require('learninglab-log');
const fs = require('fs');
const path = require('path');
const axios = require('axios');




module.exports = async ({ ack, body, view, client }) => {
    // Acknowledge the view_submission request
    await ack();
    // llog.gray(llog.divider, "timespan view submission", view);
    // llog.gray(llog.divider, "timespan view submission body", body);

    const stateValues = body.view.state.values;
    llog.yellow(stateValues)
    const timespanStart = new Date(stateValues.datepicker_block.timespan_start.selected_date).getTime() / 1000;
    const timespanStop = new Date(stateValues.datepicker_block.timespan_stop.selected_date).getTime() / 1000;
    const selectedChannels = stateValues.channel_select_block.multi_channels_select_action.selected_channels;
    const metadata = JSON.parse(body.view.private_metadata);
    const userId = body.user.id;

    console.log('Timespan Start:', timespanStart);
    console.log('Timespan Stop:', timespanStop);
    console.log('Selected Channels:', selectedChannels);
    llog.green(metadata)


    let allMessages = [];
    let skippedChannels = [];

    for (const channel of selectedChannels) {
        let isInChannel = false;
        try {
            joinResult = await client.conversations.join({ channel: channel });
            if (joinResult) {
                isInChannel = true;
            }
        } catch (error) {
            console.error(error);
            return
        }
        if (!isInChannel) {
            skippedChannels.push(channel);
            continue;
        } else {
            let hasMore = true;
            let cursor;
            while (hasMore) {
                const response = await client.conversations.history({
                    channel: channel,
                    oldest: timespanStart,
                    latest: timespanStop,
                    limit: 1000,
                    cursor: cursor
                });

                allMessages = allMessages.concat(response.messages);

                hasMore = response.has_more;
                cursor = response.response_metadata.next_cursor;
            }
        }
        
    }

    // Write the messages to a temporary JSON file
    const tempDir = path.join(global.ROOT_DIR, '_temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const tempFilePath = path.join(tempDir, `messages_${Date.now()}.json`);
    fs.writeFileSync(tempFilePath, JSON.stringify(allMessages, null, 2));

    console.log('Messages saved to:', tempFilePath);

    const imResponse = await client.conversations.open({
        users: userId
    });
    const dmChannelId = imResponse.channel.id;

    try {
        
    // Step 1: Get upload URL
    const fileStats = fs.statSync(tempFilePath);
    const uploadURLResponse = await client.files.getUploadURLExternal({
        filename: path.basename(tempFilePath),
        length: fileStats.size
    });

    const uploadURL = uploadURLResponse.upload_url;
    const fileId = uploadURLResponse.file_id;

    // Step 2: Upload the file
    const fileStream = fs.createReadStream(tempFilePath);
    await axios.post(uploadURL, fileStream, {
        headers: {
            'Content-Type': 'application/octet-stream'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
    });

    // Step 3: Complete the upload
    const imResponse = await client.conversations.open({
        users: userId
    });
    const dmChannelId = imResponse.channel.id;

    await client.files.completeUploadExternal({
        files: [{
            id: fileId,
            title: path.basename(tempFilePath)
        }],
        channel_id: dmChannelId,
        initial_comment: `Here are the messages from ${new Date(timespanStart * 1000).toLocaleDateString()} to ${new Date(timespanStop * 1000).toLocaleDateString()}. We were unable to get data for ${skippedChannels.join(', ')}.`,
    });

    console.log('File uploaded successfully');
    } catch (error) {
        llog.red(error)
    }
    // Upload the JSON file to the DM channel
   

    

    // fs.unlinkSync(tempFilePath);
    // return uploadResponse.file.id;
    // return tempFilePath; 
}
