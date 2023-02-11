import { App } from "@slack/bolt";

const app = new App({
  clientId: process.env.SLACK_APP_CLIENT_ID,
  clientSecret: process.env.SLACK_APP_CLIENT_SECRET,
  signingSecret: process.env.SLACK_APP_SIGN_SECRET,
  token: process.env.SLACK_APP_TOKEN,
});

export const slackClient = app.client;
