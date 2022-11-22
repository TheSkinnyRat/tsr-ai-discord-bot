import {
  EmbedBuilder,
  PermissionsBitField,
  Message,
} from 'discord.js';
import BotClient from '../../structures/Client.js';

export default {
  name: 'messageCreate',
  /**
   *
   * @param {BotClient} client The instantiating client
   * @param {Message} message The message
   */
  run: async (client, message) => {
    if (message.author.bot) return undefined;

    const { prefix } = client;
    // const ress = await db.findOne({ Guild: message.guildId });
    // if (ress && ress.Prefix) prefix = ress.Prefix;

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**› My prefix in this server is \`${prefix}\`**\n**› You can see my all commands type \`${prefix}\`help**`);
      message.channel.send({ embeds: [embed] });
    }
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    // const prefixRegex = new RegExp(`^(<@!?${client.user.id}>)\\s*`);
    if (!prefixRegex.test(message.content)) return undefined;
    const [matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
      || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return undefined;

    if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve('SendMessages'))) return message.author.dmChannel.send({ content: `I don't have **\`SEND_MESSAGES\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.` }).catch(() => { });
    if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve('ViewChannel'))) return message.author.dmChannel.send({ content: `I don't have **\`VIEW_CHANNEL\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.` }).catch(() => { });
    if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve('EmbedLinks'))) return message.channel.send({ content: `I don't have **\`EMBED_LINKS\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.` }).catch(() => { });

    const embed = new EmbedBuilder().setColor('Red');

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;

      if (command.usage) {
        reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``;
      }

      embed.setDescription(reply);
      return message.channel.send({ embeds: [embed] });
    }

    if (command.botPermissions) {
      if (!message.guild.members.me.permissions.has(
        PermissionsBitField.resolve(command.botPermissions || []),
      )) {
        embed.setDescription(`I don't have **\`${command.botPermissions}\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`);
        return message.channel.send({ embeds: [embed] });
      }
    }
    if (command.userPermissions) {
      if (!message.member.permissions.has(
        PermissionsBitField.resolve(command.userPermissions || []),
      )) {
        embed.setDescription(`You don't have **\`${command.userPermissions}\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`);
        return message.channel.send({ embeds: [embed] });
      }
    }

    if (command.owner && message.author.id !== `${client.owner}`) {
      embed.setDescription(
        `You <@${message.author.id}> with
        ID: \`${message.author.id}\`
        > does not have enough permissions to access this command!.

        Only <@${client.owner}> can use this command!`,
      );
      return message.channel.send({ embeds: [embed] });
    }

    try {
      command.execute(message, args, client, prefix);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      embed.setDescription('There was an error executing that command.\nI have contacted the owner of the bot to fix it immediately.');
      return message.channel.send({ embeds: [embed] });
    }
    return undefined;
  },
};
