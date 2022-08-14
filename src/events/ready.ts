import { bold } from 'chalk';
import { Events } from 'discord.js';
import { Event } from '../structures';
import { client } from '..';

export default new Event({
  event: Events.ClientReady,
  once: true,
  run() {
    client.logger.info(`${bold(client.user?.tag)} is online now!`);
  },
});
