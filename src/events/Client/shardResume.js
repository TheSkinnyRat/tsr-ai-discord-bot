export default {
  name: 'shardResume',
  run: async (client, id) => {
    client.logger.log(`Shard #${id} Resumed`, 'log');
  },
};
