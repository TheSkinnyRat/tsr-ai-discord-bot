/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { readdirSync } from 'fs';

const registerCommands = async (client) => {
  readdirSync('./src/commands/').forEach(async (dir) => {
    const commandFiles = readdirSync(`./src/commands/${dir}/`).filter((f) => f.endsWith('.js'));
    for (const file of commandFiles) {
      let command = await import(`../commands/${dir}/${file}`);
      command = command.default;
      if (command.name) {
        client.commands.set(command.name, command);
        if (command.aliases && Array.isArray(command.aliases)) {
          command.aliases.forEach((alias) => {
            client.aliases.set(alias, command.name);
          });
        }
      }
    }
  });
};

const COMMANDS = async (client) => {
  await registerCommands(client);
  client.logger.log(`Client Commands Loaded ${client.commands.size}`, 'log');
};

export default COMMANDS;
