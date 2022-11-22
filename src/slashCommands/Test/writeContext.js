import {
  EmbedBuilder,
  CommandInteraction,
  ApplicationCommandType,
} from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';
import BotClient from '../../structures/Client.js';

export default {
  name: 'writeContext',
  category: 'Ai',
  // description: 'Write a message with the ai',
  userPermissions: false,
  type: ApplicationCommandType.Message,

  /**
   *
   * @param {BotClient} client The instantiating client
   * @param {CommandInteraction} interaction The interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    const prompt = interaction.targetMessage.content;
    const configuration = new Configuration({
      apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false,
    });

    if (response?.data?.choices) {
      const embed = new EmbedBuilder()
        .setTitle('Ai Response')
        .setDescription(`\`\`\`${response.data.choices[0].text}\`\`\``)
        .setColor('Random')
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    }
    const embed = new EmbedBuilder()
      .setTitle('Something went wrong')
      .setDescription('Please try again later')
      .setColor('Red');

    return interaction.editReply({ embeds: [embed] });
  },
};
