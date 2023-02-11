import { SlackEvent } from "@slack/bolt";
import { NextApiHandler, NextApiResponse } from "next";
import { slackClient } from "../../src/api/slackClient";

const handleEvent = async (event: SlackEvent, res: NextApiResponse) => {
  switch (event.type) {
    case "message":
      if ("bot_id" in event) {
        return;
      }
      if ("text" in event && event.text) {
        const [secretWord] = event.text.match(/nakki|höhö/i) || [];

        if (secretWord) {
          await slackClient.chat.postMessage({
            channel: event.channel,
            text: secretWord,
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
