/* eslint-disable no-console */
import { ShardingManager } from 'discord.js';
import config from './src/config.js';

const manager = new ShardingManager('./src/index.js', {
  respawn: true,
  autoSpawn: true,
  token: config.token,
  totalShards: 'auto',
  shardList: 'auto',
});

manager
  .spawn({ amount: manager.totalShards, delay: null, timeout: -1 })
  .then((shards) => {
    console.log(`[CLIENT] ${shards.size} shard(s) spawned.`);
  })
  .catch((err) => {
    console.log('[CLIENT] An error has occurred :', err);
  });

manager.on('shardCreate', (shard) => {
  shard.on('ready', () => {
    console.log(`[CLIENT] Shard ${shard.id} connected to Discord's Gateway.`);
  });
});
