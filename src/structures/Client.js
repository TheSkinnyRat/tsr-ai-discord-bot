/* eslint-disable max-len */
import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} from 'discord.js';
import config from '../config.js';
import logger from '../utils/logger.js';

class BotClient extends Client {
  constructor() {
    super({
      failIfNotExists: true,
      allowedMentions: {
        parse: ['everyone', 'roles', 'users'],
      },
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildInvites,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
      ],
    });
    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.aliases = new Collection();
    this.config = config;
    this.owner = this.config.ownerId;
    this.prefix = this.config.prefix;
    this.embedColor = this.config.embedColor;
    this.logger = logger;
    if (!this.token) this.token = this.config.token;

    this.rest.on('rateLimited', (info) => {
      this.logger.log(info, 'log');
    });

    ['commands', 'slashCommand', 'events', 'errorHandler'].forEach((handler) => {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      import(`../handlers/${handler}.js`).then((module) => module.default(this));
    });
  }

  connect() {
    return super.login(this.token);
  }
}

export default BotClient;
