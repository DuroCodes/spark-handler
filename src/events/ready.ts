import chalk from 'chalk';
import { Events } from 'discord.js';
import { Event } from '../structures/index.js';
import { client } from '../index.js';

export default new Event({
  event: Events.ClientReady,
  once: true,
  run() {
    client.logger.success(`${chalk.bold(client.user?.tag)} is online now!`);
  },
});
