import { readFileSync } from 'fs';

const packages = JSON.parse(readFileSync('./package.json'));
export default {
  name: 'ready',
  run: async (client) => {
    client.logger.log(`${client.user.username} online!`, 'ready');
    client.logger.log(`Ready on ${client.guilds.cache.size} servers, for a total of ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} users`, 'ready');

    // Game
    const statuses = [`v${packages.version.slice(0, 6)}`, `Build ${packages.version}`];
    setInterval(() => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      client.user.setActivity(status, { type: 3 });
    }, 10000);

    // client.user.setActivity(statuses[0], {type: 3});
  },
};
