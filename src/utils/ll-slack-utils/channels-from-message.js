const extractChannelIds = function (data) {
    const channelIds = [];
    if (data.blocks && Array.isArray(data.blocks)) {
        data.blocks.forEach(block => {
            if (block.elements && Array.isArray(block.elements)) {
                block.elements.forEach(element => {
                    if (element.elements && Array.isArray(element.elements)) {
                        element.elements.forEach(innerElement => {
                            if (innerElement.type === 'channel' && innerElement.channel_id) {
                                channelIds.push(innerElement.channel_id);
                            }
                        });
                    }
                });
            }
        });
    }
    return channelIds;
}

export default extractChannelIds;