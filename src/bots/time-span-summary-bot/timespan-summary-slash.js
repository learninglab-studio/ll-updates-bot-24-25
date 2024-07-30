const llog = require('learninglab-log');
const timeSpanSummaryView = require('./time-span-summary-form-view');

module.exports = async ({ command, ack, say, client }) => {
    ack();
    llog.magenta(llog.divider, "got a update summary slash request")
    llog.gray(JSON.stringify(command, null, 4));
    try {
        const theView = await timeSpanSummaryView({
            user: command.user_id, 
            trigger_id: command.trigger_id,
            commandText: command.text
        })
        try {
            const result = await client.views.open(theView);
        } catch (error) {
            red(error)
        }
    } catch (error) {
        llog.red(error)
    }
}



async ({ command, ack, client, say }) => {
    llog.blue("got a command");
    await ack();
    try {
        let udpateResult = await say("working on that update ...");
        llog.magenta("got a /update request:", command);
       
    } catch (error) {
        console.error(error)
        return error;
    }
}