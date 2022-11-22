/* eslint-disable no-eval */
import { EmbedBuilder } from 'discord.js';
import resuest from 'node-superfetch';
import util from 'util';

/**
 *
 * @param {string} string The string to escape
 * @returns {string} The escaped string
 */
function clean(string) {
  if (typeof text === 'string') {
    return string.replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`);
  }
  return string;
}

export default {
  name: 'eval',
  category: 'Owner',
  description: 'Eval Code',
  args: false,
  usage: '<string>',
  permission: [],
  owner: true,
  execute: async (message, args, client) => {
    const embed = new EmbedBuilder()
      .addFields({ name: 'Input', value: `\`\`\`js\n${args.join(' ')}\`\`\`` });

    try {
      const code = args.join(' ');
      if (!code) return message.channel.send('Please include the code.');
      let evaled;

      if (code.includes('SECRET') || code.includes('TOKEN') || code.includes('process.env')) {
        evaled = 'No, shut up, what will you do it with the token?';
      } else {
        // evaled = await eval(code);

        // wrap "code" in a self-executing async function
        evaled = await eval(`(async () => {${code}})()`);
      }

      if (typeof evaled !== 'string') evaled = util.inspect(evaled, { depth: 0 });

      const output = clean(evaled);
      if (output.length > 1024) {
        const { body } = await resuest.post('https://hastebin.com/documents').send(output);
        embed.setColor(client.embedColor);
        embed.addFields({ name: 'Output', value: `https://hastebin.com/${body.key}.js` });
      } else {
        embed.setColor(client.embedColor);
        embed.addFields({ name: 'Output', value: `\`\`\`js\n${output}\`\`\`` });
      }

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      const err = clean(error);
      if (err.length > 1024) {
        const { body } = await resuest.post('https://hastebin.com/documents').send(err);
        embed.setColor('Red');
        embed.addFields({ name: 'Output', value: `https://hastebin.com/${body.key}.js` });
      } else {
        embed.setColor('Red');
        embed.addFields({ name: 'Output', value: `\`\`\`js\n${err}\`\`\`` });
      }

      message.channel.send({ embeds: [embed] });
    }
    return true;
  },
};
