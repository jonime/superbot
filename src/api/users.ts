import { UsersInfoResponse } from "@slack/web-api";
import { slackClient } from "./slackClient";

type UserPromise = Promise<UsersInfoResponse>;
const userPromises: Record<string, UserPromise | undefined> = {};

export const getUser = async (id: string) => {
  let promise: UserPromise | undefined = userPromises[id];

  if (!promise) {
    promise = slackClient.users.info({ user: id });
    userPromises[id] = promise;
  }

  return promise;
};
