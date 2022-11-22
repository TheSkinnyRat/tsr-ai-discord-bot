import { EmbedBuilder, CommandInteraction } from 'discord.js';
import BotClient from '../../structures/Client.js';

export default {
  name: 'ping',
  category: 'Information',
  description: 'Check bot ping',
  userPermissions: false,

  /**
   *
   * @param {BotClient} client The instantiating client
   * @param {CommandInteraction} interaction The interaction
   */
  run: async (client, interaction) => {
    const pingingEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription('Pinging...');

    const reply = await interaction.reply({ embeds: [pingingEmbed], fetchReply: true });

    const ping = reply.createdTimestamp - interaction.createdTimestamp;
    const apiPing = client.ws.ping;

    const pingEmbed = new EmbedBuilder()
      .setAuthor({ name: 'Ping! Pong!', iconURL: client.user.displayAvatarURL() })
      .setColor(client.embedColor)
      .addFields(
        { name: 'Bot Latency', value: `\`\`\`ini\n[ ${ping}ms ]\n\`\`\``, inline: true },
        { name: 'API Latency', value: `\`\`\`ini\n[ ${apiPing}ms ]\n\`\`\``, inline: true },
      )
      .setFooter({ text: `Requested by ${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await interaction.editReply({
      embeds: [pingEmbed],
    });
  },
};
