/* eslint-disable no-case-declarations */
/* eslint-disable no-constant-condition */
import {
  InteractionType,
  PermissionsBitField,
  EmbedBuilder,
  CommandInteraction,
} from 'discord.js';
import BotClient from '../../structures/Client.js';

export default {
  name: 'interactionCreate',
  /**
   *
   * @param {BotClient} client The instantiating client
   * @param {CommandInteraction} interaction The interaction
   */
  run: async (client, interaction) => {
    const { prefix } = client;
    // const ress = await db.findOne({ Guild: interaction.guildId });
    // if (ress && ress.Prefix) prefix = ress.Prefix;

    if (interaction.type === InteractionType.ApplicationCommand) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return undefined;

      const embed = new EmbedBuilder().setColor('Red');

      if (command.botPermissions) {
        if (
          !interaction.guild.members.me.permissions.has(
            PermissionsBitField.resolve(command.botPermissions || []),
          )
        ) {
          embed.setDescription(
            `I don't have **\`${
              command.botPermissions
            }\`** permission in ${interaction.channel.toString()} to execute this **\`${
              command.name
            }\`** command.`,
          );
          return interaction.reply({ embeds: [embed] });
        }
      }

      if (command.userPermissions) {
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.resolve(command.userPermissions || []),
          )
        ) {
          embed.setDescription(
            `You don't have **\`${
              command.userPermissions
            }\`** permission in ${interaction.channel.toString()} to execute this **\`${
              command.name
            }\`** command.`,
          );
          return interaction.reply({ embeds: [embed] });
        }
      }

      try {
        await command.run(client, interaction, prefix);
      } catch (error) {
        if (interaction.replied) {
          await interaction
            .editReply({
              content: 'An unexcepted error occured.',
            })
            .catch(() => {});
        } else {
          await interaction
            .reply({
              ephemeral: true,
              content: 'An unexcepted error occured.',
            })
            .catch(() => {});
        }
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

    return undefined;
  },
};
