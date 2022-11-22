/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { readdirSync } from 'fs';

const EVENTS = (client) => {
  let count = 0;
  readdirSync('./src/events/Client/').forEach(async (file) => {
    let events = await import(`../events/Client/${file}`);
    events = events.default;
    client.on(events.name, (...args) => events.run(client, ...args));
    count += 1;
  });
  client.logger.log(`Client Events Loaded ${count}`, 'event');
};

export default EVENTS;
