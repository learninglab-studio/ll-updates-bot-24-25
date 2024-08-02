const { App } = require("@slack/bolt");
var path = require("path");
var fs = require("fs");
const llog = require("learninglab-log");
const slashHandlers = require("./src/handlers/slash-handlers")
const messageHandlers = require("./src/handlers/message-handlers")
const bots = require("./src/bots");

global.ROOT_DIR = path.resolve(__dirname);

require("dotenv").config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

app.command("/update", bots.timespanSummaryBot.slash);
// app.command("/hackmd", slashHandlers.hackmd);
// app.command("/report", slashHandlers.report);
app.command("/watch", slashHandlers.watch);

app.view(/timespan_summary_submission/, bots.timespanSummaryBot.viewSubmission);
// app.action()

app.message("testing testing", messageHandlers.testing);
app.message(/.*/, messageHandlers.parseAll);
app.message(process.env.SLACK_BOT_SLACK_ID,  bots.updatesBot.mentioned);

// app.event("reaction_added", handleEvents.reactionAdded);
// app.event("reaction_removed", handleEvents.reactionRemoved);

(async () => {
//   const channelConfig = await getAirtableConfig({
//     baseId: process.env.AIRTABLE_WORK_BASE,
//     table: "ChannelConfig",
//   });
//   llog.yellow(channelConfig);
//   global.BOT_CONFIG = {
//     channelConfig: channelConfig,
//   };
  // Check for folders
  if (!fs.existsSync("_temp")) {
    fs.mkdirSync("_temp");
  }
  if (!fs.existsSync("_output")) {
    fs.mkdirSync("_output");
  }
  await app.start(process.env.PORT || 3000);
  llog.yellow("⚡️ Bolt app is running!");
  let slackResult = await app.client.chat.postMessage({
    channel: process.env.SLACK_LOGGING_CHANNEL,
    text: "starting up the summer work bots",
  });
  // let logTest = await bots.loggingBot.logToSlack({
  //   client: app.client,
  //   text: "testing logging bot",
  // });
})();
