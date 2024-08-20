const llog = require("learninglab-log")
const at = require('../../utils/ll-airtable-tools');

module.exports = async ({ message, client }) => {
    llog.blue(`is it a thread?`)
    try {
        if (message.thread_ts) {
            llog.green(`it is a thread`);
            const atRecord = await at.findOneByValue({
                baseId: process.env.AIRTABLE_UPDATES_BASE_ID,
                table: "Updates",
                view: "MAIN",
                field: "SlackTs",
                value: message.thread_ts
            })
            return atRecord;
        } else {
            llog.red(`it is not a thread`)
            return false;
        }
    } catch (error) {
        llog.red(error)
        return false;
    }
}


