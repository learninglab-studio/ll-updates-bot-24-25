const OpenAI = require("openai");
const llog = require("learninglab-log");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const updateBotIcon = "https://files.slack.com/files-pri/T0HTW3H0V-F06980PK5S8/guy-tiled.jpg?pub_secret=347a4fe478";
const timespanSummaryBot = require("../bots/time-span-summary-bot/index.js")


// module.exports.update = async ({ command, ack, client, say }) => {
//     llog.blue("got a command");
//     await ack();
//     try {
//         let udpateResult = await say("working on that update ...");
//         llog.magenta("got a /update request:", command);
       
//     } catch (error) {
//         console.error(error)
//         return error;
//     }
// }

module.exports.update = timespanSummaryBot.slash;

module.exports.watch = async ({ command, ack, client, say }) => {
    llog.blue("got a watch command");
    await ack();
    try {
        let udpateResult = await say("working on that update ...");
        llog.magenta("got a /watch request:", command);
       
    } catch (error) {
        console.error(error)
        return error;
    }
}

