export default {
  name: 'shardDisconnect',
  run: async (client, event, id) => {
    client.logger.log(`Shard #${id} Disconnected`, 'warn');
  },
};
