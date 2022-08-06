import { Events } from 'discord.js';
import { client } from '../..';
import { env } from '../../lib';
import { Event } from '../../structures';

export default new Event({
  event: Events.MessageCreate,
  async run(message) {
    if (
      message.author.bot
      || !message.guild
      || !message.content.toLowerCase().startsWith(env.PREFIX)
    ) return;

    const [cmd, ...args] = message.content
      .slice(env.PREFIX.length)
      .trim()
      .split(/ +/g);

    if (!cmd) return;

    const command = client.messageCommands.get(cmd.toLocaleLowerCase())
      || client.messageCommands.find((c) => !!c.aliases?.includes(cmd.toLowerCase()));

    if (!command) return;
    await command.run({ client, message, args });
  },
});
