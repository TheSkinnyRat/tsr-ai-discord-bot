import {
  EmbedBuilder,
  ApplicationCommandOptionType,
  CommandInteraction,
} from 'discord.js';
import BotClient from '../../structures/Client.js';

export default {
  name: 'avatar',
  category: 'Fun',
  description: 'Display the avatar of the mentioned user or your own',
  userPermissions: false,
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: 'user',
      description: 'The user to display the avatar of',
      required: false,
    },
  ],

  /**
   *
   * @param {BotClient} client The instantiating client
   * @param {CommandInteraction} interaction The interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    const user = interaction.options.getUser('user') || interaction.user;
    const profilePictureMessageEmbed = new EmbedBuilder().setImage(
      user.displayAvatarURL({ dynamic: true, size: 2048 }),
    );
    interaction.editReply({ embeds: [profilePictureMessageEmbed] });
  },
};
