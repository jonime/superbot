import { App, SlackEvent } from "@slack/bolt";
import { NextApiHandler, NextApiResponse } from "next";

const app = new App({
  clientId: process.env.SLACK_APP_CLIENT_ID,
  clientSecret: process.env.SLACK_APP_CLIENT_SECRET,
  signingSecret: process.env.SLACK_APP_SIGN_SECRET,
  token: process.env.SLACK_APP_TOKEN,
});

const handleEvent = async (event: SlackEvent, res: NextApiResponse) => {
  switch (event.type) {
    case "message":
      if ("bot_id" in event) {
        return;
      }
      if ("text" in event && event.text) {
        const [secretWord] = event.text.match(/nakki|höhö/) || [];

        if (secretWord) {
          await app.client.chat.postMessage({
            channel: event.channel,
            text: secretWord,
          });
        } else if (event.user === "U4TBQUUN4") {
          await app.client.reactions.add({
            name: "+1",
            timestamp: event.ts,
            channel: event.channel,
          });
        }
      }
  }
};

const handler: NextApiHandler = async (req, res) => {
  if (req.body.type === "url_verification") {
    res.status(200).send(req.body.challenge);
  } else if (req.body.type === "event_callback") {
    await handleEvent(req.body.event, res);
    res.status(200).send("OK");
  } else {
    res.status(400).send("Invalid request");
  }
};

export default handler;
