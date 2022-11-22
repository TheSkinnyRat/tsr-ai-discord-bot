/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-restricted-syntax */
import { readdir } from 'node:fs/promises';
import { REST, PermissionsBitField, Routes } from 'discord.js';

export default async (client) => {
  const slashCommandData = await Promise.all((await readdir('./src/slashCommands/')).map(async (dir) => {
    const data = [];
    const slashCommandFile = (await readdir(`./src/slashCommands/${dir}/`)).filter(
      (files) => files.endsWith('.js'),
    );
    for (const file of slashCommandFile) {
      const slashCommands = (await import(`../slashCommands/${dir}/${file}`)).default;
      if (!slashCommands.name) {
        return console.error(
          `slashCommandNameError: ${
            slashCommands.split('.')[0]
          } application command name is required.`,
        );
      }
      // if (!slashCommands.description) {
      //   return console.error(
      //     `slashCommandDescriptionError: ${
      //       slashCommands.split('.')[0]
      //     } application command description is required.`,
      //   );
      // }

      client.slashCommands.set(slashCommands.name, slashCommands);
      data.push({
        name: slashCommands.name,
        description: slashCommands.description,
        type: slashCommands.type,
        options: slashCommands.options ? slashCommands.options : null,
        default_member_permissions: slashCommands.userPermissions
          ? PermissionsBitField.resolve(
            slashCommands.userPermissions,
          ).toString()
          : null,
      });
    }
    return data[0];
  }));

  client.logger.log(`Client SlashCommands Command (/) Loaded: ${slashCommandData.length}`);
  const rest = new REST({ version: '10' }).setToken(client.config.token);

  (async () => {
    try {
      client.logger.log('Started refreshing application (/) commands.', 'cmd');
      await rest.put(Routes.applicationCommands(client.config.clientId), {
        body: slashCommandData,
      });
      client.logger.log(
        'Successfully reloaded application (/) commands.',
        'cmd',
      );
    } catch (error) {
      console.error(error);
    }
  })();
};
