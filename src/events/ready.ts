import { Events } from 'discord.js';
import { logger } from '../lib';
import { Event } from '../structures';
import { client } from '..';

export default new Event({
  event: Events.ClientReady,
  run() {
    logger.info(`${client.user?.tag} is online now!`);
  },
});
