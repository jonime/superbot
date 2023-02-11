import { NextApiHandler } from "next";
import { rateLimiter } from "../../src/api/rateLimiter";
import { slackClient } from "../../src/api/slackClient";
import env from "../../src/env";

const handler: NextApiHandler = rateLimiter(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(404).send("Not found");
  }

  const result = await slackClient.chat.postMessage({
    channel: env.channel,
    text: req.body,
  });

  res.status(200).json({ thread: result.ts });
});

export default handler;
