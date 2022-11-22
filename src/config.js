import * as dotenv from 'dotenv';

dotenv.config();
const CONFIG = {
  token: process.env.DISCORD_TOKEN || 'x',
  clientId: process.env.DISCORD_ID || '0',
  prefix: process.env.APP_PREFIX || '!',
  ownerId: process.env.APP_OWNERID || '493752775721746432',
  embedColor: process.env.APP_EMBED_COLOR || '#0099ff',
  logs: process.env.APP_LOGS || '966661862550818887',
  errorLogsChannel: process.env.APP_LOGS || '966661862550818887',
};

export default CONFIG;
