/* eslint-disable no-console */
import { EmbedBuilder } from 'discord.js';
import config from '../config.js';
import BotClient from '../structures/Client.js';

/**
 * @param {BotClient} client The instantiating client
 */
const ERROR_HANDLER = async (client) => {
  process.on('beforeExit', (code) => {
    // If You Want You Can Use
    console.log('[AntiCrash] | [BeforeExit_Logs] | [Start] : ===============');
    console.log(code);
    console.log('[AntiCrash] | [BeforeExit_Logs] | [End] : ===============');
  });
  process.on('exit', (error) => {
    // If You Want You Can Use
    console.log('[AntiCrash] | [Exit_Logs] | [Start]  : ===============');
    console.log(error);
    console.log('[AntiCrash] | [Exit_Logs] | [End] : ===============');
  });
  process.on('unhandledRejection', (reason) => {
    // Needed
    console.log('[AntiCrash] | [UnhandledRejection_Logs] | [start] : ===============');
    console.log(reason);
    console.log('[AntiCrash] | [UnhandledRejection_Logs] | [end] : ===============');

    const errorLogsChannel = client.channels.cache.get(config.errorLogsChannel);
    const errEmbed = new EmbedBuilder()
      .setColor('#000000')
      .setTitle('An Error Occured:')
      .setDescription(`\`\`\`${reason}\`\`\``)
      .setTimestamp();

    if (errorLogsChannel) {
      errorLogsChannel.send({
        embeds: [errEmbed],
      });
    }
  });
  process.on('rejectionHandled', (promise) => {
    // If You Want You Can Use
    console.log('[AntiCrash] | [RejectionHandled_Logs] | [Start] : ===============');
    console.log(promise);
    console.log('[AntiCrash] | [RejectionHandled_Logs] | [End] : ===============');
  });
  process.on('uncaughtException', (err) => {
    // Needed
    console.log('[AntiCrash] | [UncaughtException_Logs] | [Start] : ===============');
    console.log(err);
    console.log('[AntiCrash] | [UncaughtException_Logs] | [End] : ===============');
  });
  process.on('uncaughtExceptionMonitor', (err) => {
    // Needed
    console.log('[AntiCrash] | [UncaughtExceptionMonitor_Logs] | [Start] : ===============');
    console.log(err);
    console.log('[AntiCrash] | [UncaughtExceptionMonitor_Logs] | [End] : ===============');
  });
  process.on('warning', (warning) => {
    // If You Want You Can Use
    console.log('[AntiCrash] | [Warning_Logs] | [Start] : ===============');
    console.log(warning);
    console.log('[AntiCrash] | [Warning_Logs] | [End] : ===============');
  });
  // process.on('SIGINT', () => { // If You Want You Can Use
  //   console.log('☆・[AntiCrash] | [SIGINT]・☆');
  // });

  client.logger.log('Loaded ErrorHandler (AntiCrash)', 'log');
};

export default ERROR_HANDLER;
