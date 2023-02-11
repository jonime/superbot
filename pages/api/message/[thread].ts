import { NextApiHandler } from "next";
import { rateLimiter } from "../../../src/api/rateLimiter";
import { slackClient } from "../../../src/api/slackClient";
import { getUser } from "../../../src/api/users";
import env from "../../../src/env";
import { Message } from "../../../src/types";
import { getStringValue } from "../../../src/utils";

const handler: NextApiHandler = rateLimiter(async (req, res) => {
  const thread = getStringValue(req.query.thread);
  if (!thread) {
    res.status(404).send("Not found");
    return;
  }

  try {
    if (req.method === "POST") {
      await slackClient.chat.postMessage({
        channel: env.channel,
        thread_ts: thread,
        text: req.body,
      });
      res.status(200).json({ status: "OK" });
    } else {
      const response = await slackClient.conversations.replies({
        ts: thread,
        channel: env.channel,
      });

      const messages = await Promise.all(
        response.messages?.map(
          async (message): Promise<Message> => ({
            from:
              message.user === env.botUser
                ? "you"
                : (message.user && (await getUser(message.user)).user?.name) ||
                  "somebody",
            text: message.text || "",
          })
        ) || []
      );

      res.status(200).json(messages);
    }
  } catch (e) {
    res.status(400).send("Invalid request");
  }
});

export default handler;
