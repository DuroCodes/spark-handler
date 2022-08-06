import { Events } from 'discord.js';
import { Event } from '../structures';
import { client } from '..';

export default new Event({
  event: Events.ClientReady,
  run() {
    client.logger.info(`${client.user?.tag} is online now!`);
  },
});
