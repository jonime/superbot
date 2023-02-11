import { IncomingHttpHeaders } from "http";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getStringValue } from "../utils";

const ipMap = new Map<string, number>();

export const rateLimiter = (handler: NextApiHandler): NextApiHandler => {
  return (req, res) => {
    if (req.method === "GET") {
      return handler(req, res);
    }

    const now = Date.now();
    const ip = getStringValue(req.headers["x-real-ip"]) || "dev";

    const lastRequest = ip && ipMap.get(ip);
    ip && ipMap.set(ip, now);

    if (lastRequest && lastRequest + 2000 > now) {
      res.status(429).send("Stop spamming");
      return;
    } else {
      return handler(req, res);
    }
  };
};
