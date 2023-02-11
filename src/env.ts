import { getRequiredValue } from "./utils";

const env = {
  channel: getRequiredValue(process.env.SLACK_CHANNEL),
  botUser: getRequiredValue(process.env.SLACK_BOT_USER),
};

export default env;
