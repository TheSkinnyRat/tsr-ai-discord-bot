import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} from 'discord.js';

export default {
  name: 'reboot',
  category: 'Config',
  description: 'Reboot bot system server.',
  args: false,
  usage: '',
  aliases: [],
  permission: [],
  owner: true,
  execute: async (message) => {
    // Delay before reboot in seconds
    let rebootDelay = 31;
    let rebootMessageEmbedColor = 'Green';

    const rebootMessageButtonCancel = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Danger);
    const rebootMessage = await message.reply({ embeds: [new EmbedBuilder().setDescription(`Initiating reboot in **${rebootDelay}s**`).setColor(rebootMessageEmbedColor)], components: [new ActionRowBuilder().addComponents(rebootMessageButtonCancel)] });

    const collector = rebootMessage.createMessageComponentCollector({
      filter: () => true,
    });

    const rebootIntervalMessage = setInterval(async () => {
      if (rebootDelay < 20 && rebootDelay > 10) {
        rebootMessageEmbedColor = 'Yellow';
      } else if (rebootDelay < 10) {
        rebootMessageEmbedColor = 'Red';
      }
      await rebootMessage.edit({ embeds: [new EmbedBuilder().setDescription(`Initiating reboot in **${rebootDelay}s**`).setColor(rebootMessageEmbedColor)] });
      rebootDelay -= 2;
      if (rebootDelay <= 0) {
        clearInterval(rebootIntervalMessage);
        await rebootMessage.edit({
          embeds: [new EmbedBuilder().setDescription(`System rebooted by ${message.author}`).setColor('Green').setFooter({ text: 'Please wait a while before you can give me commands again.' })],
          components: [],
        }).catch(() => {});
        return process.exit();
      }
      return true;
    }, 2000);

    collector.on('collect', async (b) => {
      if (!b.deferred) await b.deferUpdate();
      if (b.customId === 'cancel') {
        if (!rebootMessage) return;
        clearInterval(rebootIntervalMessage);
        await rebootMessage.edit({ embeds: [new EmbedBuilder().setDescription(`Reboot canceled by ${b.user}`).setColor('Green')], components: [] }).catch(() => {});
      }
    });
  },
};
